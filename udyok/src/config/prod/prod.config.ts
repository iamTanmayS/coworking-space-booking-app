export const prodConfig = {
    api: {
        timeout: 120_000, // 2 minutes to allow free tier backend to spin up
        retryAttempts: 2,
        enableLogging: false,
    },
    features: {
        enableDebugMode: false,
        enableMockData: false,
    },
} as const;
