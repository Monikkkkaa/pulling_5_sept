import * as EventService from "../services/event.service.js"

export async function listInvitations(req, res) {
  const data = await EventService.listInvitations({ userId: req.user.id })
  res.json({ invitations: data })
}

export async function respondInvitation(req, res) {
  const { invitationId } = req.params
  const { action } = req.body // 'accept' | 'decline'
  const updated = await EventService.respondInvitation({ invitationId, userId: req.user.id, action })
  res.json({ invitation: updated })
}
