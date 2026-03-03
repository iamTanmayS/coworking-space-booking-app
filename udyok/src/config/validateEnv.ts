import { env } from './env';

export const validateEnv = () => {
    const errors: string[] = [];

    if (!env.API_URL) {
        errors.push('EXPO_PUBLIC_API_URL is required');
    }

    if (!env.CHAT_URL) {
        errors.push('EXPO_PUBLIC_CHAT_URL is required');
    }

    if (!['development', 'staging', 'production'].includes(env.ENV)) {
        errors.push('EXPO_PUBLIC_ENV must be one of: development, staging, production');
    }

    if (errors.length > 0) {
        throw new Error(
            `Environment validation failed:\n${errors.map((e) => `  - ${e}`).join('\n')}`
        );
    }

    return env;
};

export const validatedEnv = validateEnv();
