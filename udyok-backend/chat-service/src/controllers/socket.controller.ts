import { Server, Socket } from 'socket.io';
import { Message } from '../models/message.model.js';
import { Conversation } from '../models/conversation.model.js';
import jwt from 'jsonwebtoken';

// Track connected users: userId -> socketId
const connectedUsers = new Map<string, string>();

interface SocketData {
    userId: string;
}

export const setupSocketHandlers = (io: Server) => {
    // Middleware for Socket Auth
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
            if (!token) return next(new Error('Authentication error: Token missing'));

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
            (socket as any).user = { userId: decoded.userId };
            next();
        } catch (err) {
            next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', (socket: Socket) => {
        const userId = (socket as any).user.userId;
        connectedUsers.set(userId, socket.id);

        // Update presence in DB
        Conversation.updateMany(
            { 'participants.userId': userId },
            { $set: { 'participants.$.isOnline': true } }
        ).exec();

        // Broadcast presence to all users
        io.emit('user_status', { userId, isOnline: true });

        console.log(`User connected: ${userId} (Socket: ${socket.id})`);

        // --- Chat Events ---
        socket.on('join_chat', (chatId: string) => {
            socket.join(chatId);
        });

        socket.on('send_message', async (data: { chatId: string, text: string, type?: 'text' | 'image' }, callback) => {
            try {
                const message = await Message.create({
                    conversationId: data.chatId,
                    senderId: userId,
                    text: data.text,
                    type: data.type || 'text',
                    readBy: [userId]
                });

                // Update Conversation Last Message
                const conversation = await Conversation.findByIdAndUpdate(
                    data.chatId,
                    {
                        lastMessage: data.text,
                        lastMessageTime: new Date()
                    },
                    { new: true }
                );

                // Increment unread counts for other participants
                if (conversation) {
                    conversation.participants.forEach(p => {
                        if (p.userId !== userId) {
                            const count = conversation.unreadCounts.get(p.userId) || 0;
                            conversation.unreadCounts.set(p.userId, count + 1);
                        }
                    });
                    await conversation.save();
                }

                // Broadcast to everyone in the chat room
                io.to(data.chatId).emit('receive_message', message);

                if (callback) callback({ success: true, message });
            } catch (error) {
                console.error('Send message error:', error);
                if (callback) callback({ success: false, error: 'Internal error' });
            }
        });

        socket.on('read_receipt', async (chatId: string) => {
            await Message.updateMany(
                { conversationId: chatId, senderId: { $ne: userId } },
                { $addToSet: { readBy: userId } }
            );

            const updateKey = `unreadCounts.${userId}`;
            await Conversation.updateOne(
                { _id: chatId },
                { $set: { [updateKey]: 0 } }
            );

            // Let others in the room know messages were read
            socket.to(chatId).emit('messages_read', { chatId, readBy: userId });
        });

        // --- WebRTC Calling Signaling ---
        socket.on('call_user', (data: { targetUserId: string, rtcMessage: any, type: 'audio' | 'video', chatId: string }) => {
            const targetSocketId = connectedUsers.get(data.targetUserId);
            if (targetSocketId) {
                // Ensure target knows who is calling
                io.to(targetSocketId).emit('incoming_call', {
                    callerId: userId,
                    rtcMessage: data.rtcMessage,
                    type: data.type,
                    chatId: data.chatId
                });
            } else {
                // Target is offline
                socket.emit('call_declined', { callerId: data.targetUserId, reason: 'offline' });
            }
        });

        socket.on('answer_call', (data: { callerId: string, rtcMessage: any }) => {
            const callerSocketId = connectedUsers.get(data.callerId);
            if (callerSocketId) {
                io.to(callerSocketId).emit('call_answered', {
                    responderId: userId,
                    rtcMessage: data.rtcMessage
                });
            }
        });

        socket.on('ice_candidate', (data: { targetUserId: string, rtcMessage: any }) => {
            const targetSocketId = connectedUsers.get(data.targetUserId);
            if (targetSocketId) {
                io.to(targetSocketId).emit('ice_candidate', {
                    senderId: userId,
                    rtcMessage: data.rtcMessage
                });
            }
        });

        socket.on('end_call', (data: { targetUserId: string }) => {
            const targetSocketId = connectedUsers.get(data.targetUserId);
            if (targetSocketId) {
                io.to(targetSocketId).emit('call_ended', { senderId: userId });
            }
        });

        // --- Disconnect ---
        socket.on('disconnect', async () => {
            connectedUsers.delete(userId);
            console.log(`User disconnected: ${userId}`);

            await Conversation.updateMany(
                { 'participants.userId': userId },
                {
                    $set: {
                        'participants.$.isOnline': false,
                        'participants.$.lastSeen': new Date()
                    }
                }
            );

            io.emit('user_status', { userId, isOnline: false, lastSeen: new Date() });
        });
    });
};
