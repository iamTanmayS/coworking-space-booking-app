// api/base.api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { RootState } from '../store/store';
import { config } from '../config';
import { logout, setTokens } from '../features/authentication/Auth.slice';
import { Mutex } from 'async-mutex';

// Create a mutex to prevent multiple refresh attempts
const mutex = new Mutex();

const createBaseQuery = (baseUrl: string) => fetchBaseQuery({
    baseUrl,
    timeout: config.api.timeout,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        headers.set('Content-Type', 'application/json');
        return headers;
    },
});

const coreBaseQuery = createBaseQuery(config.apiUrl);

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    // Wait until the mutex is available without locking it
    await mutex.waitForUnlock();

    let result = await coreBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // Check if mutex is locked (another request is already refreshing)
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();

            try {
                const state = api.getState() as RootState;
                const refreshToken = state.auth.refreshToken;

                // Try to refresh the token
                const refreshResult = await coreBaseQuery(
                    {
                        url: '/auth/refresh',
                        method: 'POST',
                        body: { refreshToken },
                    },
                    api,
                    extraOptions
                );

                if (refreshResult.data) {
                    // Store the new tokens
                    const { accessToken, refreshToken: newRefreshToken } = refreshResult.data as { accessToken: string; refreshToken: string };
                    api.dispatch(setTokens({ accessToken, refreshToken: newRefreshToken }));

                    // Retry the original query with new token
                    result = await coreBaseQuery(args, api, extraOptions);
                } else {
                    // Refresh failed - logout user
                    api.dispatch(logout());
                }
            } finally {
                release();
            }
        } else {
            // Wait for the mutex to be available, then retry
            await mutex.waitForUnlock();
            result = await coreBaseQuery(args, api, extraOptions);
        }
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User', 'Space', 'Booking', 'Wallet', 'Favorites', 'Chat', 'Settings', 'Reviews'],
    endpoints: () => ({}),
});
