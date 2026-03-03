export interface Message {
    _id: string;
    conversationId: string;
    senderId: string;
    text: string;
    readBy: string[];
    type: 'text' | 'image' | 'system';
    createdAt: string;
    updatedAt: string;
}

export interface ChatParticipant {
    userId: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
    lastSeen?: string;
}

export interface Chat {
    _id: string;
    participants: ChatParticipant[];
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCounts: Record<string, number>;
    createdAt: string;
    updatedAt: string;
}

export interface Call {
    chatId: string;
    participantId: string;
    participantName: string;
    type: 'voice' | 'video';
    status: 'incoming' | 'outgoing' | 'active' | 'ended';
}

export interface ChatState {
    chats: Chat[];
    messages: Record<string, Message[]>;
    activeChat: string | null;
    activeCall: Call | null;
    loading: boolean;
}

export interface SendMessageRequest {
    text: string;
}
