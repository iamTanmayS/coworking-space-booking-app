import React, { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAppSelector } from '@/store/store';
import { config } from '@/config';
import { NotificationService } from '@/services/NotificationService';

// Connect directly to the standalone chat-service running on Render/Local.
// WebSockets proxying through the API Gateway causes multiple hops and drops,
// so we contact it directly using the EXPO_PUBLIC_CHAT_URL environment variable.
const SOCKET_URL = config.chatUrl;

interface SocketContextProps {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextProps>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // We assume the token is stored in the Redux auth slice. Adjust if needed.
    const token = useAppSelector((state: any) => state.auth?.accessToken);

    useEffect(() => {
        if (!token) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        const newSocket = io(SOCKET_URL, {
            path: '/socket.io',
            auth: { token },
            transports: ['websocket', 'polling'], // Prioritize websocket to try skipping polling overhead on Render
        });

        newSocket.on('connect', () => {
            console.log('[Socket] Connected:', newSocket.id);
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('[Socket] Disconnected');
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('[Socket] Connection Error:', error.message);
        });

        // Global message push notification
        newSocket.on('receive_message', (message: any) => {
            // Check if we are the sender (avoid notifying ourselves)
            // (Assuming `profile.id` is in state but token dependency handles it for now)
            NotificationService.notifyNewChatMessage("Udyok Chat", message.content || "You have a new message.");
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [token]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
