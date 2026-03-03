export const devConfig = {
  api: {
    timeout: 240000, // 2 minutes to allow free tier backend to spin up
    retryAttempts: 0,
    enableLogging: true,
  },
  features: {
    enableDebugMode: true,
    enableMockData: false,
  },
} as const;
