// User API types
// Re-export User interface from slice
export interface UserLocation {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    avatar?: string;
    location?: UserLocation | null;
    isVerified: boolean;
    isProfileComplete: boolean;
    isOnboarded: boolean;
}

export interface UserState {
    profile: User | null;
    loading: boolean;
    error: string | null;
}

export interface UpdateProfileRequest {
    name?: string;
    phone?: string;
    location?: UserLocation;
    email?: string;
}

export interface UploadAvatarResponse {
    avatarUrl: string;
}

export interface UserSettings {
    theme: string;
    notifications: boolean;
    language: string;
    timezone: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
}

export interface UpdateSettingsRequest {
    theme?: string;
    notifications?: boolean;
    language?: string;
    timezone?: string;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
}
