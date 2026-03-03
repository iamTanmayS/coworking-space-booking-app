import { useState, useEffect } from 'react';
import { useGetChatsQuery, useGetMessagesQuery, chatApi } from '@/features/chat/chat.api';
import type { Chat, Message } from '@/features/chat/chat.types';
import { useSocket } from '@/features/chat/SocketContext';
import { useAppSelector, useAppDispatch } from '@/store/store';

export interface UIChat {
    id: string;
    participantId: string;
    participantName: string;
    participantAvatar?: string;
    isOnline: boolean;
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount: number;
}

/** Decode the userId from a JWT token payload without verifying the signature */
const decodeUserId = (token: string | null): string | null => {
    if (!token) return null;
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        return payload.userId || payload.id || payload.sub || null;
    } catch {
        return null;
    }
};

export const useChatListViewModel = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { data: chatsRaw = [], isLoading, refetch } = useGetChatsQuery();
    const accessToken = useAppSelector((state: any) => state.auth?.accessToken);
    const currentUserId = decodeUserId(accessToken);
    const { socket } = useSocket();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = () => {
            // Refetch chats to update lastMessage and unread counts
            refetch();
        };

        const handleUserStatus = () => {
            refetch();
        };

        socket.on('receive_message', handleReceiveMessage);
        socket.on('user_status', handleUserStatus);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
            socket.off('user_status', handleUserStatus);
        };
    }, [socket, refetch]);

    const uiChats: UIChat[] = (chatsRaw as Chat[]).map(chat => {
        const otherParticipant = chat.participants.find(p => p.userId !== currentUserId)
            || chat.participants[0]; // fallback if mapping to oneself

        return {
            id: (chat as any)._id || (chat as any).id,
            participantId: otherParticipant?.userId || '',
            participantName: otherParticipant?.name || 'Unknown',
            participantAvatar: otherParticipant?.avatar,
            isOnline: otherParticipant?.isOnline || false,
            lastMessage: chat.lastMessage,
            lastMessageTime: chat.lastMessageTime ? new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
            unreadCount: currentUserId ? (chat.unreadCounts?.[currentUserId] || 0) : 0
        };
    });

    const filteredChats = uiChats.filter((chat: UIChat) =>
        chat.participantName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
        chats: filteredChats,
        isLoading,
        searchQuery,
        setSearchQuery,
        refetch,
    };
};

export const useChatDetailViewModel = (chatId: string) => {
    const { data: messagesRaw = [], isLoading } = useGetMessagesQuery(chatId);
    const [isSending, setIsSending] = useState(false);
    const { socket, isConnected } = useSocket();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!socket) return;

        socket.emit('join_chat', chatId);

        const handleReceiveMessage = (newMessage: Message) => {
            if (newMessage.conversationId === chatId) {
                dispatch(
                    chatApi.util.updateQueryData('getMessages', chatId, (draft) => {
                        // Append to the list (backend returned newest first, but if we render newest bottom, 
                        // we might need to unshift depending on flatlist generic inversion)
                        draft.unshift(newMessage);
                    })
                );
                // Assume if we received it, we mark as read in the active scope
                socket.emit('read_receipt', chatId);
            }
        };

        socket.on('receive_message', handleReceiveMessage);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [socket, chatId, dispatch]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || !socket || !isConnected) return;

        setIsSending(true);
        socket.emit('send_message', { chatId, text, type: 'text' }, (response: any) => {
            setIsSending(false);
            if (response?.success) {
                // message is returned from server, will be broadcasted and picked up by our own receive_message stream
            } else {
                console.error('Failed to send real-time message');
            }
        });
    };

    const markAsRead = async () => {
        if (socket && isConnected) {
            socket.emit('read_receipt', chatId);
        }
    };

    return {
        messages: messagesRaw,
        isLoading,
        isSending,
        sendMessage,
        markAsRead,
    };
};
