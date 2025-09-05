import { Router } from "express"
import { authRequired } from "../../_middleware/auth.middleware.js"
import { validate } from "../../_middleware/validate.middleware.js"
import {
  createEventSchema,
  updateEventSchema,
  getByIdSchema,
  inviteSchema,
  voteSchema,
} from "../validate_schema/event.validation.js"
import * as C from "../controllers/event.controller.js"

const router = Router()
router.use(authRequired)

router.get("/", C.listEvents)
router.post("/", validate(createEventSchema), C.createEvent)
router.get("/:id", validate(getByIdSchema), C.getEventById)
router.patch("/:id", validate(updateEventSchema), C.updateEvent)
router.delete("/:id", validate(getByIdSchema), C.deleteEvent)

router.post("/:id/invitations", validate(inviteSchema), C.inviteUsers)
router.post("/:id/votes", validate(voteSchema), C.vote)
router.get("/:id/results", validate(getByIdSchema), C.results)

export default router
