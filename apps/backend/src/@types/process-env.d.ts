declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: string;
      PORT?: string;
      CORS_ALLOWED_ORIGINS?: string;
      LOCALE?: string;
      TZ?: string;

      // postgres
      POSTGRES_PORT?: string;
      POSTGRES_HOST?: string;
      POSTGRES_DB?: string;
      POSTGRES_USER?: string;
      POSTGRES_PASSWORD?: string;

      // graph db (apache age)
      GRAPH_DB_VENDOR?: string;
      AGE_PORT?: string;
      AGE_HOST?: string;
      AGE_DB?: string;
      AGE_USER?: string;
      AGE_PASSWORD?: string;
      AGE_POOL_MAX_CONNECTIONS?: string;
      AGE_POOL_IDLE_TIMEOUT_MS?: string;
      AGE_POOL_MAX_LIFETIME_SECONDS?: string;

      // vector db (pgvector)
      VECTOR_DB_VENDOR?: string;
      PGVECTOR_PORT?: string;
      PGVECTOR_HOST?: string;
      PGVECTOR_DB?: string;
      PGVECTOR_USER?: string;
      PGVECTOR_PASSWORD?: string;
      PGVECTOR_POOL_MAX_CONNECTIONS?: string;
      PGVECTOR_POOL_IDLE_TIMEOUT_MS?: string;
      PGVECTOR_POOL_MAX_LIFETIME_SECONDS?: string;

      // redis
      REDIS_PORT?: string;
      REDIS_HOST?: string;
      REDIS_DB?: string;
      REDIS_PASSWORD?: string;

      // storage
      STORAGE_VENDOR?: string;
      STORAGE_ACCESS_KEY?: string;
      STORAGE_SECRET_KEY?: string;
      STORAGE_REGION?: string;
      STORAGE_PUBLIC_BUCKET_NAME?: string;
      STORAGE_PRIVATE_BUCKET_NAME?: string;
      STORAGE_FORCE_PATH_STYLE?: string;
      STORAGE_INTERNAL_ENDPOINT?: string;
      STORAGE_EXTERNAL_ENDPOINT?: string;

      // better-auth
      BETTER_AUTH_SECRET?: string;
      BETTER_AUTH_URL?: string;
    }
  }
}

export {};
