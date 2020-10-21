import { Document, Schema, model, Model } from "mongoose";

export interface IMessage extends Document {
  conversationId: string;
  content: string;
  targets: string[];
  emitter: string;
  createdAt: Date;
}

const messageSchema = new Schema({
  conversationId: { type: String, required: true},
  content: { type: String, required: true},
  targets: [{ type: String, required: true }],
  emitter: { type: String, required: true},
  createdAt: { type: Date, required: true}
})

export const Message = model<IMessage, Model<IMessage>>('Message', messageSchema);
