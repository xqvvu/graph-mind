declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: string;
      PORT?: string;
      DATABASE_URL?: string;
      REDIS_URL?: string;
      CORS_ALLOWED_ORIGINS?: string;
      BETTER_AUTH_SECRET?: string;
      BETTER_AUTH_URL?: string;
      LOCALE?: string;
      TZ?: string;
    }
  }
}

export {};
