import { Router } from "express"
import authRoutes from "../app/routes/auth.routes.js"
import eventRoutes from "../app/routes/event.routes.js"
import invitationRoutes from "../app/routes/invitation.routes.js"

// If needed later:
// import adminRoutes from '../admin/routes/index.js'
// import vendorRoutes from '../vendor/routes/index.js'

const router = Router()

router.use("/auth", authRoutes)
router.use("/events", eventRoutes)
router.use("/invitations", invitationRoutes)

// router.use('/admin', adminRoutes)
// router.use('/vendor', vendorRoutes)

export default router
