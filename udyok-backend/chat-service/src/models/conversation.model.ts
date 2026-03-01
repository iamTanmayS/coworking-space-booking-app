import mongoose, { Document, Schema } from 'mongoose';

export interface IParticipant {
    userId: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
    lastSeen?: Date;
}

export interface IConversation extends Document {
    participants: IParticipant[];
    lastMessage?: string;
    lastMessageTime?: Date;
    unreadCounts: Map<string, number>; // userId -> count
    createdAt: Date;
    updatedAt: Date;
}

const ParticipantSchema = new Schema<IParticipant>({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date }
});

const ConversationSchema = new Schema<IConversation>({
    participants: [ParticipantSchema],
    lastMessage: { type: String },
    lastMessageTime: { type: Date },
    unreadCounts: {
        type: Map,
        of: Number,
        default: {}
    }
}, {
    timestamps: true
});

// Index to quickly find conversations for a user
ConversationSchema.index({ 'participants.userId': 1 });

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
