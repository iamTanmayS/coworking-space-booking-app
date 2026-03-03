import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { User, UserState } from './user.types';

const initialState: UserState = {
    profile: null,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserProfile: (state, action: PayloadAction<User>) => {
            console.log('User.slice - setUserProfile called with:', action.payload);
            state.profile = action.payload;
            console.log('User.slice - profile after set:', state.profile);
        },
        updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
            if (state.profile) {
                state.profile = { ...state.profile, ...action.payload };
            }
        },
        clearUserProfile: (state) => {
            state.profile = null;
        },
        setUserLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setUserError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const { setUserProfile, updateUserProfile, clearUserProfile, setUserLoading, setUserError } = userSlice.actions;
export default userSlice.reducer;
