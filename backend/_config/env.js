import dotenv from "dotenv"
dotenv.config()

const required = ["MONGODB_URI", "JWT_SECRET"]
for (const key of required) {
  if (!process.env[key]) {
    console.warn(`[env] missing ${key}`)
  }
}
