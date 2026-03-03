import { useState } from 'react';
import { useAppSelector } from '@/store/store';
import { useUpdateProfileMutation, useUploadAvatarMutation } from '@/features/user/user.api';
import { UpdateProfileRequest } from '@/features/user/user.types';
import { Alert } from 'react-native';

export const useUserViewModel = () => {
    const { profile } = useAppSelector((state) => state.user);
    const [updateProfileMutation, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [uploadAvatarMutation, { isLoading: isUploading }] = useUploadAvatarMutation();

    const [error, setError] = useState<string | null>(null);

    const updateProfile = async (data: UpdateProfileRequest) => {
        try {
            setError(null);
            await updateProfileMutation(data).unwrap();
            Alert.alert('Success', 'Profile updated successfully');
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
            Alert.alert('Error', err.message || 'Failed to update profile');
            return false;
        }
    };

    const uploadAvatar = async (formData: FormData) => {
        try {
            setError(null);
            const response = await uploadAvatarMutation(formData).unwrap();
            return response.avatarUrl;
        } catch (err: any) {
            setError(err.message || 'Failed to upload avatar');
            Alert.alert('Error', err.message || 'Failed to upload avatar');
            return null;
        }
    };

    return {
        user: profile,
        updateProfile,
        uploadAvatar,
        isLoading: isUpdating || isUploading,
        error
    };
};
