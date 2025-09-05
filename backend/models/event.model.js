import mongoose from "mongoose"
const { Schema } = mongoose

const PollOptionSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    label: { type: String, required: true, trim: true },
  },
  { _id: true },
)

const VoteSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    optionId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

const EventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User", index: true }],
    dateOptions: [
      {
        _id: { type: Schema.Types.ObjectId, auto: true },
        label: { type: String, required: true, trim: true }, // e.g., "2025-09-10 17:00"
      },
    ],
    poll: {
      question: { type: String, required: true },
      options: { type: [PollOptionSchema], default: [] },
      votes: { type: [VoteSchema], default: [] },
    },
  },
  { timestamps: true },
)

export const Event = mongoose.model("Event", EventSchema)
