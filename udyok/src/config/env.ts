export const env = {
    API_URL: process.env.EXPO_PUBLIC_API_URL || '',
    CHAT_URL: process.env.EXPO_PUBLIC_CHAT_URL || '',
    ENV: (process.env.EXPO_PUBLIC_ENV || 'development') as 'development' | 'staging' | 'production',
} as const;
