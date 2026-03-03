import { useState, useEffect, useCallback } from 'react';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '@/features/user/user.api';
import type { UserSettings } from '@/features/user/user.types';

export const useSettingsViewModel = () => {
    const { data: serverSettings, isLoading, error } = useGetSettingsQuery();
    const [updateSettingsMutation] = useUpdateSettingsMutation();

    // Local state for optimistic UI updates
    const [localSettings, setLocalSettings] = useState<UserSettings>({
        theme: 'light',
        notifications: true,
        language: 'en',
        timezone: 'UTC',
        emailNotifications: true,
        smsNotifications: false,
    });

    // Sync local state when server data loads or changes
    useEffect(() => {
        if (serverSettings) {
            setLocalSettings(serverSettings);
        }
    }, [serverSettings]);

    const updateSetting = useCallback(async <K extends keyof UserSettings>(
        key: K,
        value: UserSettings[K]
    ) => {
        // Optimistically update local state
        setLocalSettings(prev => ({
            ...prev,
            [key]: value
        }));

        try {
            // Send mutation to backend
            await updateSettingsMutation({ [key]: value }).unwrap();
        } catch (err) {
            console.error(`Failed to update setting ${key}:`, err);
            // Revert on failure (if needed, though typically we just let the next refetch sync it)
            if (serverSettings) {
                setLocalSettings(prev => ({
                    ...prev,
                    [key]: serverSettings[key]
                }));
            }
        }
    }, [serverSettings, updateSettingsMutation]);

    return {
        settings: localSettings,
        isLoading,
        error,
        updateSetting,
    };
};
