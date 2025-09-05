import * as EventService from "../services/event.service.js"

export async function createEvent(req, res) {
  const { title, description, dateOptions, poll, participants } = req.body
  const event = await EventService.createEvent({
    creatorId: req.user.id,
    title,
    description,
    dateOptions,
    poll,
    participants,
  })
  res.status(201).json({ event })
}

export async function listEvents(req, res) {
  const { scope } = req.query
  const events = await EventService.listEvents({ userId: req.user.id, scope })
  res.json({ events })
}

export async function getEventById(req, res) {
  const event = await EventService.getEventById({ id: req.params.id, userId: req.user.id })
  res.json({ event })
}

export async function updateEvent(req, res) {
  const event = await EventService.updateEvent({ id: req.params.id, userId: req.user.id, patch: req.body })
  res.json({ event })
}

export async function deleteEvent(req, res) {
  await EventService.deleteEvent({ id: req.params.id, userId: req.user.id })
  res.json({ ok: true })
}

export async function inviteUsers(req, res) {
  const invitations = await EventService.inviteUsers({
    id: req.params.id,
    userId: req.user.id,
    userIds: req.body.userIds,
  })
  res.status(201).json({ invitations })
}

export async function vote(req, res) {
  const event = await EventService.voteOnEvent({
    id: req.params.id,
    userId: req.user.id,
    optionId: req.body.optionId,
  })
  res.json({ event })
}

export async function results(req, res) {
  const event = await EventService.getEventById({ id: req.params.id, userId: req.user.id })
  res.json({ results: EventService.computeResults(event) })
}
