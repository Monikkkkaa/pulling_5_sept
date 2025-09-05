import createError from "http-errors"
import { User } from "../../models/user.model.js"
import { hashPassword, comparePassword } from "../../_helpers/crypto.js"
import { signToken } from "../../_helpers/jwt.js"

export async function signup({ name, email, password }) {
  const exists = await User.findOne({ email })
  if (exists) throw createError(409, "Email already registered")
  const passwordHash = await hashPassword(password)
  const user = await User.create({ name, email, passwordHash })
  const token = signToken({ sub: user._id.toString() })
  return { user: { id: user._id, name: user.name, email: user.email }, token }
}

export async function login({ email, password }) {
  const user = await User.findOne({ email })
  if (!user) throw createError(401, "Invalid email or password")
  const ok = await comparePassword(password, user.passwordHash)
  if (!ok) throw createError(401, "Invalid email or password")
  const token = signToken({ sub: user._id.toString() })
  return { user: { id: user._id, name: user.name, email: user.email }, token }
}
