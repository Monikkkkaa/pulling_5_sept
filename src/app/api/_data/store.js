import { randomUUID } from "crypto";

function uid() {
  try {
    return randomUUID();
  } catch {
    // Fallback for environments without crypto.randomUUID
    return Math.random().toString(36).slice(2);
  }
}

// Users
export const users = [
  { id: "u1", name: "Alice", email: "alice@example.com", password: "password" },
  { id: "u2", name: "Bob", email: "bob@example.com", password: "password" },
];

// Events
export const events = [
  {
    id: "e1",
    title: "Product Planning",
    description: "Choose a suitable date for the product planning meeting.",
    dateOptions: [
      new Date(Date.now() + 1 * 86400000).toISOString(),
      new Date(Date.now() + 2 * 86400000).toISOString(),
      new Date(Date.now() + 3 * 86400000).toISOString(),
    ],
    creatorId: "u1",
    participants: ["u2"],
    votes: [], // { userId, optionIndex }
  },
];

// Helpers
export function findUserByEmail(email) {
  return users.find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase()
  );
}
export function getUserFromToken(authHeader) {
  if (!authHeader) return null;
  const parts = authHeader.split(" ");
  const token = parts.length === 2 ? parts[1] : null;
  if (!token) return null;
  // Token is simply the user id in this mock
  return users.find((u) => u.id === token) || null;
}
export function createUser({ name, email, password }) {
  if (findUserByEmail(email)) throw new Error("Email already registered");
  const user = { id: uid(), name, email, password };
  users.push(user);
  return user;
}
export function createEvent({ title, description, dateOptions, creatorId }) {
  const event = {
    id: uid(),
    title,
    description,
    dateOptions: Array.isArray(dateOptions) ? dateOptions : [],
    creatorId,
    participants: [],
    votes: [],
  };
  events.push(event);
  return event;
}
export function listEventsForUser(userId, scope) {
  if (scope === "created") {
    return events.filter((e) => e.creatorId === userId);
  }
  if (scope === "invited") {
    return events.filter((e) => e.participants?.includes(userId));
  }
  return events;
}
export function getEvent(id) {
  return events.find((e) => e.id === id);
}
export function inviteUserToEvent(eventId, userId, byUserId) {
  const event = getEvent(eventId);
  if (!event) throw new Error("Event not found");
  if (event.creatorId !== byUserId)
    throw new Error("Only the creator can invite");
  if (!users.find((u) => u.id === userId)) throw new Error("User not found");
  if (!event.participants.includes(userId)) event.participants.push(userId);
  return event;
}
export function castVote(eventId, userId, optionIndex) {
  const event = getEvent(eventId);
  if (!event) throw new Error("Event not found");
  if (!event.participants.includes(userId))
    throw new Error("Only invited users can vote");
  const idx = event.votes.findIndex((v) => v.userId === userId);
  if (idx >= 0) event.votes.splice(idx, 1);
  event.votes.push({ userId, optionIndex });
  return event;
}
export function computeResults(event) {
  const counts = new Array(event.dateOptions.length).fill(0);
  for (const v of event.votes) {
    if (v.optionIndex >= 0 && v.optionIndex < counts.length)
      counts[v.optionIndex] += 1;
  }
  return counts;
}
