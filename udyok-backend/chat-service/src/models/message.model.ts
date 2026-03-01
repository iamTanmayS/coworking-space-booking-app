import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMessage extends Document {
    conversationId: Types.ObjectId;
    senderId: string;
    text: string;
    readBy: string[]; // User IDs who have read this message
    type: 'text' | 'image' | 'system';
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    senderId: { type: String, required: true },
    text: { type: String, required: true },
    readBy: [{ type: String }],
    type: { type: String, enum: ['text', 'image', 'system'], default: 'text' }
}, {
    timestamps: true
});

// Index to quickly load messages for a specific conversation
MessageSchema.index({ conversationId: 1, createdAt: -1 });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
