import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required");
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 15000,
  });
  console.log("[db] connected to MongoDB Atlas");
}
const uri = process.env.MONGODB_URI;
await mongoose
  .connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 15000,
  })
  .then(() => console.log("[db] connected to MongoDB Atlas"))
  .catch((err) => console.error("[db] connection error:", err));
