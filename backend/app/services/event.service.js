import createError from "http-errors"
import mongoose from "mongoose"
import { Event } from "../../models/event.model.js"
import { Invitation } from "../../models/invitation.model.js"
import { User } from "../../models/user.model.js"

export async function createEvent({ creatorId, title, description, dateOptions, poll, participants }) {
  const uniqueParticipantIds = Array.from(new Set([creatorId, ...(participants || [])])).map(
    (id) => new mongoose.Types.ObjectId(id),
  )
  const event = await Event.create({
    title,
    description,
    creator: creatorId,
    participants: uniqueParticipantIds,
    dateOptions: dateOptions.map((d) => ({ label: d.label })),
    poll: {
      question: poll.question,
      options: poll.options.map((o) => ({ label: o.label })),
      votes: [],
    },
  })
  return event
}

export async function listEvents({ userId, scope }) {
  if (scope === "invited") {
    return Event.find({ participants: userId, creator: { $ne: userId } }).sort({ createdAt: -1 })
  }
  return Event.find({ creator: userId }).sort({ createdAt: -1 })
}

export async function getEventById({ id, userId }) {
  const event = await Event.findById(id)
  if (!event) throw createError(404, "Event not found")
  if (event.creator.toString() !== userId && !event.participants.map(String).includes(userId)) {
    throw createError(403, "Forbidden")
  }
  return event
}

export async function ensureCreator(eventId, userId) {
  const event = await Event.findById(eventId)
  if (!event) throw createError(404, "Event not found")
  if (event.creator.toString() !== userId) throw createError(403, "Only creator can modify the event")
  return event
}

export async function updateEvent({ id, userId, patch }) {
  const event = await ensureCreator(id, userId)
  if (patch.title !== undefined) event.title = patch.title
  if (patch.description !== undefined) event.description = patch.description
  if (patch.dateOptions !== undefined) {
    event.dateOptions = patch.dateOptions.map((d) => ({ label: d.label }))
  }
  await event.save()
  return event
}

export async function deleteEvent({ id, userId }) {
  await ensureCreator(id, userId)
  await Event.findByIdAndDelete(id)
  await Invitation.deleteMany({ event: id })
  return { ok: true }
}

export async function inviteUsers({ id, userId, userIds }) {
  const event = await ensureCreator(id, userId)
  const unique = Array.from(new Set(userIds)).filter((uid) => uid !== userId)
  const existingUsers = await User.find({ _id: { $in: unique } }).select("_id")
  const validIds = existingUsers.map((u) => u._id.toString())
  const invitations = await Promise.all(
    validIds.map((toUser) =>
      Invitation.findOneAndUpdate(
        { event: event._id, toUser },
        { $setOnInsert: { createdBy: userId, status: "pending" } },
        { upsert: true, new: true },
      ),
    ),
  )
  const toAdd = validIds
    .filter((uid) => !event.participants.map(String).includes(uid))
    .map((uid) => new mongoose.Types.ObjectId(uid))
  if (toAdd.length) {
    event.participants.push(...toAdd)
    await event.save()
  }
  return invitations
}

export async function listInvitations({ userId }) {
  return Invitation.find({ toUser: userId }).populate("event", "title description")
}

export async function respondInvitation({ invitationId, userId, action }) {
  const inv = await Invitation.findById(invitationId)
  if (!inv) throw createError(404, "Invitation not found")
  if (inv.toUser.toString() !== userId) throw createError(403, "Forbidden")
  inv.status = action === "accept" ? "accepted" : "declined"
  await inv.save()
  if (inv.status === "accepted") {
    await Event.updateOne({ _id: inv.event, participants: { $ne: userId } }, { $push: { participants: userId } })
  }
  return inv
}

export async function voteOnEvent({ id, userId, optionId }) {
  const event = await Event.findById(id)
  if (!event) throw createError(404, "Event not found")
  if (event.creator.toString() !== userId && !event.participants.map(String).includes(userId)) {
    throw createError(403, "Only participants can vote")
  }
  const optionExists = event.poll.options.some((o) => o._id.toString() === optionId)
  if (!optionExists) throw createError(400, "Invalid poll option")
  event.poll.votes = event.poll.votes.filter((v) => v.user.toString() !== userId)
  event.poll.votes.push({ user: userId, optionId })
  await event.save()
  return event
}

export function computeResults(event) {
  const counts = {}
  for (const opt of event.poll.options) {
    counts[opt._id.toString()] = { optionId: opt._id.toString(), label: opt.label, votes: 0 }
  }
  for (const v of event.poll.votes) {
    const key = v.optionId.toString()
    if (counts[key]) counts[key].votes += 1
  }
  return {
    eventId: event._id.toString(),
    question: event.poll.question,
    totals: Object.values(counts),
    totalVotes: event.poll.votes.length,
  }
}
