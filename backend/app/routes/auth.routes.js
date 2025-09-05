import { Router } from "express"
import { validate } from "../../_middleware/validate.middleware.js"
import { authSchema } from "../validate_schema/auth.validation.js"
import { postSignup, postLogin, getMe } from "../controllers/auth.controller.js"
import { authRequired } from "../../_middleware/auth.middleware.js"

const router = Router()
router.post("/signup", validate(authSchema), postSignup)
router.post("/login", validate(authSchema), postLogin)
router.get("/me", authRequired, getMe)
export default router
