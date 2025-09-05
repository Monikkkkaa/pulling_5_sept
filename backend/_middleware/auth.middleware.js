import createHttpError from "http-errors"
import { verifyToken } from "../_helpers/jwt.js"
import { User } from "../models/user.model.js"

export async function authRequired(req, _res, next) {
  try {
    const header = req.headers.authorization || ""
    const token = header.startsWith("Bearer ") ? header.slice(7) : null
    if (!token) throw createHttpError(401, "Missing Authorization header")

    const decoded = verifyToken(token)
    const user = await User.findById(decoded.sub).select("_id name email")
    if (!user) throw createHttpError(401, "Invalid token user")

    req.user = { id: user._id.toString(), name: user.name, email: user.email }
    next()
  } catch (err) {
    next(createHttpError(401, err.message || "Unauthorized"))
  }
}
