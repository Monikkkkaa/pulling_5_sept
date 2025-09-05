import mongoose from "mongoose"
const { Schema } = mongoose

const InvitationSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    toUser: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending", index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
)

export const Invitation = mongoose.model("Invitation", InvitationSchema)
