export interface Settings {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
    timezone: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
}

export interface SettingsState {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
    timezone: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
    loading: boolean;
    error: string | null;
}

export interface UpdateSettingsRequest {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    language?: string;
    timezone?: string;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
}
