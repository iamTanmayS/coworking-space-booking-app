// Settings API
import { baseApi } from '../../api/base.api';
import type { Settings, UpdateSettingsRequest } from './settings.types';

export const settingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSettings: builder.query<Settings, void>({
            query: () => '/settings',
            providesTags: ['Settings'],
        }),

        updateSettings: builder.mutation<Settings, UpdateSettingsRequest>({
            query: (data) => ({
                url: '/settings',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Settings'],
        }),
    }),
});

export const {
    useGetSettingsQuery,
    useUpdateSettingsMutation,
} = settingsApi;
