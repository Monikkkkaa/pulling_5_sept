import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret"
const DEFAULT_EXPIRES = "7d"

export function signToken(payload, opts = {}) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: DEFAULT_EXPIRES, ...opts })
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET)
}
