import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NotificationItem {
    id: string;
    title: string;
    body: string;
    date: string;
    isRead: boolean;
    data?: any;
}

interface NotificationsState {
    items: NotificationItem[];
}

const initialState: NotificationsState = {
    items: [],
};

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Omit<NotificationItem, 'id' | 'date' | 'isRead'>>) => {
            state.items.unshift({
                ...action.payload,
                id: Date.now().toString() + Math.random().toString(),
                date: new Date().toISOString(),
                isRead: false,
            });
        },
        markAsRead: (state, action: PayloadAction<string>) => {
            const index = state.items.findIndex(n => n.id === action.payload);
            if (index !== -1) {
                state.items[index].isRead = true;
            }
        },
        markAllAsRead: (state) => {
            state.items.forEach(n => { n.isRead = true; });
        },
        clearAll: (state) => {
            state.items = [];
        }
    }
});

export const { addNotification, markAsRead, markAllAsRead, clearAll } = notificationsSlice.actions;
export default notificationsSlice.reducer;
