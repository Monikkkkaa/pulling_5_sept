import { Router } from "express"
import { authRequired } from "../../_middleware/auth.middleware.js"
import { listInvitations, respondInvitation } from "../controllers/invitation.controller.js"

const router = Router()
router.use(authRequired)
router.get("/", listInvitations)
router.post("/:invitationId/respond", respondInvitation)

export default router
