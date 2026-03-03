import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { Message, Chat, Call, ChatState } from './chat.types';

const initialState: ChatState = {
    chats: [],
    messages: {},
    activeChat: null,
    activeCall: null,
    loading: false,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChats: (state, action: PayloadAction<Chat[]>) => {
            state.chats = action.payload;
        },
        setMessages: (state, action: PayloadAction<{ chatId: string; messages: Message[] }>) => {
            state.messages[action.payload.chatId] = action.payload.messages;
        },
        addMessage: (state, action: PayloadAction<Message>) => {
            const conversationId = action.payload.conversationId;
            if (!state.messages[conversationId]) {
                state.messages[conversationId] = [];
            }
            state.messages[conversationId].push(action.payload);
        },
        setActiveChat: (state, action: PayloadAction<string | null>) => {
            state.activeChat = action.payload;
        },
        startCall: (state, action: PayloadAction<Call>) => {
            state.activeCall = action.payload;
        },
        endCall: (state) => {
            state.activeCall = null;
        },
        updateCallStatus: (state, action: PayloadAction<Call['status']>) => {
            if (state.activeCall) {
                state.activeCall.status = action.payload;
            }
        },
        setChatLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const { setChats, setMessages, addMessage, setActiveChat, startCall, endCall, updateCallStatus, setChatLoading } = chatSlice.actions;
export default chatSlice.reducer;
