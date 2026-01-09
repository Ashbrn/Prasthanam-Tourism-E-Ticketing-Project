import mongoose, { Schema, Document } from "mongoose";
import { IConversation } from "../types";

interface IConversationDocument extends Omit<IConversation, '_id'>, Document {}

const conversationSchema = new Schema<IConversationDocument>(
  {
    userId: { type: "ObjectId", ref: "User" },
    sessionId: { type: String, required: true, unique: true },
    language: { type: String, default: "en" },
    messages: [
      {
        from: { type: String, enum: ["user", "bot"], required: true },
        text: { type: String, required: true },
        ts: { type: Date, default: Date.now },
      },
    ],
    intent: { type: String },
    entities: { type: Schema.Types.Mixed },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

conversationSchema.index({ sessionId: 1 });
conversationSchema.index({ userId: 1 });

export const Conversation = mongoose.model<IConversationDocument>("Conversation", conversationSchema);
