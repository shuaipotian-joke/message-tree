export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:9001/api',
    host: import.meta.env.VITE_API_HOST || 'localhost',
    port: import.meta.env.VITE_API_PORT || '9001',
    protocol: import.meta.env.VITE_API_PROTOCOL || 'http',
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Message Tree',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    port: import.meta.env.VITE_APP_PORT || '5173',
    host: import.meta.env.VITE_APP_HOST || 'localhost',
  },
} as const;

export default config;
