import { devConfig } from './dev/dev.config';
import { prodConfig } from './prod/prod.config';
import { validatedEnv } from './validateEnv';

const baseConfig = {
    appName: 'Udyok',
    apiUrl: validatedEnv.API_URL,
    chatUrl: validatedEnv.CHAT_URL,
    env: validatedEnv.ENV,
} as const;

const envConfig = validatedEnv.ENV === 'production' ? prodConfig : devConfig;

export const config = {
    ...baseConfig,
    ...envConfig,
} as const;

export type Config = typeof config;
