import { baseApi } from '../../api/base.api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { logout } from './Auth.slice';
import { persistor } from '../../store/store';

/**
 * Global logout thunk that handles clearing all layers of state:
 * 1. Purges persisted storage (AsyncStorage)
 * 2. Resets RTK Query API cache
 * 3. Clears the local auth state (token, etc.)
 */
export const logoutThunk = createAsyncThunk(
    'auth/logoutThunk',
    async (_, { dispatch }) => {
        try {
            // Clear persisted storage
            await persistor.purge();

            // Wipe RTK Query cache
            dispatch(baseApi.util.resetApiState());

            // Reset local auth slice
            dispatch(logout());
        } catch (error) {
            console.error('Logout failed:', error);
            // Even if purge fails, we should still try to clear the local state
            dispatch(logout());
        }
    }
);
