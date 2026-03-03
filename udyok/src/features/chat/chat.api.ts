import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '../../config';
import type { Chat, Message, SendMessageRequest } from './chat.types';
import { RootState } from '../../store/store';

export const chatApi = createApi({
    reducerPath: 'chatApi',
    baseQuery: fetchBaseQuery({
        baseUrl: config.chatUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.accessToken;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Chat'],
    endpoints: (builder) => ({
        getChats: builder.query<any[], void>({
            query: () => '/conversations',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ _id }) => ({ type: 'Chat' as const, id: _id })),
                        { type: 'Chat', id: 'LIST' },
                    ]
                    : [{ type: 'Chat', id: 'LIST' }],
        }),

        getMessages: builder.query<any[], string>({
            query: (chatId) => `/conversations/${chatId}/messages`,
            providesTags: (result, error, chatId) => [{ type: 'Chat', id: chatId }],
        }),

        createChat: builder.mutation<any, { targetUserId: string, targetName?: string, targetAvatar?: string, myName?: string, myAvatar?: string }>({
            query: (data) => ({
                url: '/conversations',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Chat', id: 'LIST' }],
        }),

        // sendMessage and markAsRead are primarily handled by WebSockets now,
        // but keeping stubs here if you want to implement them via REST fallback
    }),
});

export const {
    useGetChatsQuery,
    useGetMessagesQuery,
    useCreateChatMutation,
} = chatApi;
