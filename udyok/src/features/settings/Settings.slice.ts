import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { SettingsState } from './settings.types';

const initialSettingsState: SettingsState = {
    theme: 'light',
    notifications: true,
    language: 'en',
    timezone: 'UTC',
    emailNotifications: true,
    smsNotifications: false,
    loading: false,
    error: null,
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState: initialSettingsState,
    reducers: {
        updateTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
        },
        toggleNotifications: (state) => {
            state.notifications = !state.notifications;
        },
        updateLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload;
        },
        updateTimezone: (state, action: PayloadAction<string>) => {
            state.timezone = action.payload;
        },
        toggleEmailNotifications: (state) => {
            state.emailNotifications = !state.emailNotifications;
        },
        toggleSmsNotifications: (state) => {
            state.smsNotifications = !state.smsNotifications;
        },
        updateSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
            return { ...state, ...action.payload };
        },
        setSettingsLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setSettingsError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});


export const {
    updateTheme,
    toggleNotifications,
    updateLanguage,
    updateTimezone,
    toggleEmailNotifications,
    toggleSmsNotifications,
    updateSettings,
    setSettingsLoading,
    setSettingsError
} = settingsSlice.actions;



export default settingsSlice.reducer;