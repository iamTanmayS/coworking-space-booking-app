// User API
import { baseApi } from '../../api/base.api';
import type { User, UpdateProfileRequest, UploadAvatarResponse, UserSettings, UpdateSettingsRequest } from './user.types';
import type { SaveLocationRequest, SaveLocationResponse } from '../location/location.types';

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query<User, void>({
            query: () => '/users/me',
            providesTags: ['User'],
        }),

        updateProfile: builder.mutation<User, UpdateProfileRequest>({
            query: (data) => ({
                url: '/users/me',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),

        updateLocation: builder.mutation<SaveLocationResponse, SaveLocationRequest>({
            query: (data) => ({
                url: '/users/me/location',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),

        uploadAvatar: builder.mutation<UploadAvatarResponse, FormData>({
            query: (formData) => ({
                url: '/users/me/avatar',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['User'],
        }),

        getSettings: builder.query<UserSettings, void>({
            query: () => '/settings',
            providesTags: ['User'],
        }),

        updateSettings: builder.mutation<UserSettings, UpdateSettingsRequest>({
            query: (data) => ({
                url: '/settings',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),

        changePassword: builder.mutation<{ message: string }, { currentPassword: string; newPassword: string }>({
            query: (data) => ({
                url: '/users/me/password',
                method: 'PATCH',
                body: data,
            }),
        }),
    }),
});

export const {
    useGetProfileQuery,
    useUpdateProfileMutation,
    useUpdateLocationMutation,
    useUploadAvatarMutation,
    useGetSettingsQuery,
    useUpdateSettingsMutation,
    useChangePasswordMutation,
} = userApi;
