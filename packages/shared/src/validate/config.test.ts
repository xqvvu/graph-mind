import { ConfigInitSchema } from "@yokg/shared/validate/config";
import { clone, omit } from "es-toolkit";
import { beforeEach, describe, expect, it } from "vitest";
import { ZodError } from "zod";

describe("ConfigInitSchema", () => {
  const validProcessEnv = {
    // server
    NODE_ENV: "development",
    PORT: "10001",
    CORS_ALLOWED_ORIGINS: "http://localhost:3000,http://localhost:3001",
    LOCALE: "en-US",
    TZ: "America/Los_Angeles",

    // postgres
    POSTGRES_PORT: "5432",
    POSTGRES_HOST: "localhost",
    POSTGRES_DB: "yokg",
    POSTGRES_USER: "postgres",
    POSTGRES_PASSWORD: "mypassword",

    // graph db (age)
    GRAPH_DB_VENDOR: "age",
    AGE_PORT: "5455",
    AGE_HOST: "localhost",
    AGE_DB: "graph",
    AGE_USER: "postgres",
    AGE_PASSWORD: "mypassword",
    AGE_POOL_MAX_CONNECTIONS: "10",
    AGE_POOL_IDLE_TIMEOUT_MS: "30000",
    AGE_POOL_MAX_LIFETIME_SECONDS: "36000",

    // vector db (pgvector)
    VECTOR_DB_VENDOR: "pgvector",
    PGVECTOR_PORT: "5487",
    PGVECTOR_HOST: "localhost",
    PGVECTOR_DB: "vector",
    PGVECTOR_USER: "postgres",
    PGVECTOR_PASSWORD: "mypassword",
    PGVECTOR_POOL_MAX_CONNECTIONS: "10",
    PGVECTOR_POOL_IDLE_TIMEOUT_MS: "30000",
    PGVECTOR_POOL_MAX_LIFETIME_SECONDS: "36000",

    // redis
    REDIS_PORT: "6379",
    REDIS_HOST: "localhost",
    REDIS_DB: "0",
    REDIS_PASSWORD: "mypassword",

    // storage
    STORAGE_VENDOR: "rustfs",
    STORAGE_ACCESS_KEY: "rustfsadmin",
    STORAGE_SECRET_KEY: "mypassword",
    STORAGE_REGION: "us-east-1",
    STORAGE_PUBLIC_BUCKET_NAME: "public",
    STORAGE_PRIVATE_BUCKET_NAME: "private",
    STORAGE_FORCE_PATH_STYLE: "true",
    STORAGE_INTERNAL_ENDPOINT: "http://localhost:9000",
    STORAGE_EXTERNAL_ENDPOINT: "http://localhost:9001",

    // better-auth
    BETTER_AUTH_SECRET: "a7081891386aea621b1c766c07f2186b573fbe5f8497c5243801565683d039d9",
    BETTER_AUTH_URL: "http://localhost:10001",
  };

  let error: unknown;
  let processEnv: Partial<typeof validProcessEnv>;

  beforeEach(() => {
    error = undefined;
    processEnv = clone(validProcessEnv);
  });

  describe("Default values", () => {
    it("should apply default PORT when missing", () => {
      processEnv = omit(processEnv, ["PORT"]);
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.PORT).toBe(10001);
    });

    it("should apply default LOCALE when missing", () => {
      processEnv = omit(processEnv, ["LOCALE"]);
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.LOCALE).toBe("zh-CN");
    });

    it("should apply default TZ when missing", () => {
      processEnv = omit(processEnv, ["TZ"]);
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.TZ).toBe("Asia/Shanghai");
    });

    it("should apply default CORS_ALLOWED_ORIGINS when missing", () => {
      processEnv = omit(processEnv, ["CORS_ALLOWED_ORIGINS"]);
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.CORS_ALLOWED_ORIGINS).toEqual([]);
    });
  });

  describe("CORS_ALLOWED_ORIGINS transformation", () => {
    it("should transform comma-separated origins to array", () => {
      processEnv.CORS_ALLOWED_ORIGINS = "http://localhost:3000,https://example.com";
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.CORS_ALLOWED_ORIGINS).toEqual(["http://localhost:3000", "https://example.com"]);
    });

    it("should handle origins with spaces", () => {
      processEnv.CORS_ALLOWED_ORIGINS = " http://localhost:3000 , https://example.com ";
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.CORS_ALLOWED_ORIGINS).toEqual(["http://localhost:3000", "https://example.com"]);
    });

    it("should handle empty entries in comma-separated list", () => {
      processEnv.CORS_ALLOWED_ORIGINS = "http://localhost:3000,,https://example.com,";
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.CORS_ALLOWED_ORIGINS).toEqual(["http://localhost:3000", "https://example.com"]);
    });

    it("should allow wildcard origin", () => {
      processEnv.CORS_ALLOWED_ORIGINS = "*";
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.CORS_ALLOWED_ORIGINS).toEqual(["*"]);
    });

    it("should allow mixed wildcard and URLs", () => {
      processEnv.CORS_ALLOWED_ORIGINS = "*,http://localhost:3000";
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.CORS_ALLOWED_ORIGINS).toEqual(["*", "http://localhost:3000"]);
    });

    it("should throw error for invalid URL format", () => {
      processEnv.CORS_ALLOWED_ORIGINS = "not-a-valid-url";
      try {
        ConfigInitSchema.parse(processEnv);
      } catch (e) {
        error = e;
      }
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(ZodError);
    });

    it("should throw error when any URL in list is invalid", () => {
      processEnv.CORS_ALLOWED_ORIGINS = "http://localhost:3000,invalid-url";
      try {
        ConfigInitSchema.parse(processEnv);
      } catch (e) {
        error = e;
      }
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(ZodError);
    });
  });

  describe("BETTER_AUTH_URL validation", () => {
    it("should accept HTTP URL", () => {
      processEnv.BETTER_AUTH_URL = "http://localhost:3000";
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.BETTER_AUTH_URL).toBe(processEnv.BETTER_AUTH_URL);
    });

    it("should accept HTTPS URL", () => {
      processEnv.BETTER_AUTH_URL = "https://example.com";
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.BETTER_AUTH_URL).toBe(processEnv.BETTER_AUTH_URL);
    });

    it("should accept URL with path", () => {
      processEnv.BETTER_AUTH_URL = "https://example.com/auth";
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.BETTER_AUTH_URL).toBe(processEnv.BETTER_AUTH_URL);
    });

    it("should reject missing BETTER_AUTH_URL", () => {
      processEnv = omit(processEnv, ["BETTER_AUTH_URL"]);
      try {
        ConfigInitSchema.parse(processEnv);
      } catch (e) {
        error = e;
      }
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(ZodError);
    });

    it("should reject non-URL string", () => {
      processEnv.BETTER_AUTH_URL = "not-a-url";
      try {
        ConfigInitSchema.parse(processEnv);
      } catch (e) {
        error = e;
      }
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(ZodError);
    });
  });

  describe("BETTER_AUTH_SECRET validation", () => {
    it("should reject missing BETTER_AUTH_SECRET", () => {
      processEnv = omit(processEnv, ["BETTER_AUTH_SECRET"]);
      try {
        ConfigInitSchema.parse(processEnv);
      } catch (e) {
        error = e;
      }
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(ZodError);
    });

    it("should reject empty secret", () => {
      processEnv.BETTER_AUTH_SECRET = "";
      try {
        ConfigInitSchema.parse(processEnv);
      } catch (e) {
        error = e;
      }
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(ZodError);
    });

    it("should accept valid secret", () => {
      processEnv.BETTER_AUTH_SECRET = "valid-secret-key-here";
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.BETTER_AUTH_SECRET).toBe(processEnv.BETTER_AUTH_SECRET);
    });
  });

  describe("PORT boundary values", () => {
    it("should accept minimum valid port (1024)", () => {
      processEnv.PORT = "1024";
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.PORT).toBe(1024);
    });

    it("should accept maximum valid port (65535)", () => {
      processEnv.PORT = "65535";
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.PORT).toBe(65535);
    });

    it("should accept default port when explicitly set to default value", () => {
      processEnv.PORT = "10001";
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.PORT).toBe(10001);
    });

    it("should reject port when not a number", () => {
      processEnv.PORT = "Not a Number";
      try {
        ConfigInitSchema.parse(processEnv);
      } catch (e) {
        error = e;
      }
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(ZodError);
    });

    it("should reject port when not an integer", () => {
      processEnv.PORT = "1024.5";
      try {
        ConfigInitSchema.parse(processEnv);
      } catch (e) {
        error = e;
      }
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(ZodError);
    });

    it("should reject port less than 1024", () => {
      processEnv.PORT = "1023";
      try {
        ConfigInitSchema.parse(processEnv);
      } catch (e) {
        error = e;
      }
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(ZodError);
    });

    it("should reject port greater than 65535", () => {
      processEnv.PORT = "65536";
      try {
        ConfigInitSchema.parse(processEnv);
      } catch (e) {
        error = e;
      }
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(ZodError);
    });

    it("should reject port 0", () => {
      processEnv.PORT = "0";
      try {
        ConfigInitSchema.parse(processEnv);
      } catch (e) {
        error = e;
      }
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(ZodError);
    });

    it("should reject negative port", () => {
      processEnv.PORT = "-1";
      try {
        ConfigInitSchema.parse(processEnv);
      } catch (e) {
        error = e;
      }
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(ZodError);
    });
  });

  describe("NODE_ENV validation", () => {
    it("should accept any NODE_ENV value", () => {
      const validNodeEnvValues = ["development", "production", "test", "staging", "custom"];
      for (const nodeEnvValue of validNodeEnvValues) {
        processEnv.NODE_ENV = nodeEnvValue;
        const result = ConfigInitSchema.parse(processEnv);
        expect(result.NODE_ENV).toBe(nodeEnvValue);
      }
    });

    it("should accept empty NODE_ENV", () => {
      processEnv.NODE_ENV = "";
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.NODE_ENV).toBe("");
    });
  });

  describe("PostgreSQL validation", () => {
    it("should apply default POSTGRES_PORT when missing", () => {
      processEnv = omit(processEnv, ["POSTGRES_PORT"]);
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.POSTGRES_PORT).toBe(5432);
    });

    it("should apply default POSTGRES_HOST when missing", () => {
      processEnv = omit(processEnv, ["POSTGRES_HOST"]);
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.POSTGRES_HOST).toBe("localhost");
    });

    it("should apply default POSTGRES_DB when missing", () => {
      processEnv = omit(processEnv, ["POSTGRES_DB"]);
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.POSTGRES_DB).toBe("yokg");
    });

    it("should apply default POSTGRES_USER when missing", () => {
      processEnv = omit(processEnv, ["POSTGRES_USER"]);
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.POSTGRES_USER).toBe("postgres");
    });

    it("should reject missing POSTGRES_PASSWORD", () => {
      processEnv = omit(processEnv, ["POSTGRES_PASSWORD"]);
      try {
        ConfigInitSchema.parse(processEnv);
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(ZodError);
    });

    it("should reject empty POSTGRES_PASSWORD", () => {
      processEnv.POSTGRES_PASSWORD = "";
      try {
        ConfigInitSchema.parse(processEnv);
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(ZodError);
    });
  });

  describe("Redis validation", () => {
    it("should apply default REDIS_PORT when missing", () => {
      processEnv = omit(processEnv, ["REDIS_PORT"]);
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.REDIS_PORT).toBe(6379);
    });

    it("should apply default REDIS_HOST when missing", () => {
      processEnv = omit(processEnv, ["REDIS_HOST"]);
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.REDIS_HOST).toBe("localhost");
    });

    it("should apply default REDIS_DB when missing", () => {
      processEnv = omit(processEnv, ["REDIS_DB"]);
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.REDIS_DB).toBe(0);
    });

    it("should reject missing REDIS_PASSWORD", () => {
      processEnv = omit(processEnv, ["REDIS_PASSWORD"]);
      try {
        ConfigInitSchema.parse(processEnv);
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(ZodError);
    });

    it("should reject empty REDIS_PASSWORD", () => {
      processEnv.REDIS_PASSWORD = "";
      try {
        ConfigInitSchema.parse(processEnv);
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(ZodError);
    });
  });

  describe("Graph DB (AGE) validation", () => {
    it("should apply default GRAPH_DB_VENDOR when missing", () => {
      processEnv = omit(processEnv, ["GRAPH_DB_VENDOR"]);
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.GRAPH_DB_VENDOR).toBe("age");
    });

    it("should apply default AGE_PORT when missing", () => {
      processEnv = omit(processEnv, ["AGE_PORT"]);
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.AGE_PORT).toBe(5455);
    });

    it("should apply default AGE_HOST when missing", () => {
      processEnv = omit(processEnv, ["AGE_HOST"]);
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.AGE_HOST).toBe("localhost");
    });

    it("should apply default AGE_DB when missing", () => {
      processEnv = omit(processEnv, ["AGE_DB"]);
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.AGE_DB).toBe("graph");
    });

    it("should apply default AGE_USER when missing", () => {
      processEnv = omit(processEnv, ["AGE_USER"]);
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.AGE_USER).toBe("postgres");
    });

    it("should reject missing AGE_PASSWORD", () => {
      processEnv = omit(processEnv, ["AGE_PASSWORD"]);
      try {
        ConfigInitSchema.parse(processEnv);
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(ZodError);
    });

    it("should reject empty AGE_PASSWORD", () => {
      processEnv.AGE_PASSWORD = "";
      try {
        ConfigInitSchema.parse(processEnv);
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(ZodError);
    });
  });

  describe("Vector DB (pgvector) validation", () => {
    it("should apply default VECTOR_DB_VENDOR when missing", () => {
      processEnv = omit(processEnv, ["VECTOR_DB_VENDOR"]);
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.VECTOR_DB_VENDOR).toBe("pgvector");
    });

    it("should apply default PGVECTOR_PORT when missing", () => {
      processEnv = omit(processEnv, ["PGVECTOR_PORT"]);
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.PGVECTOR_PORT).toBe(5487);
    });

    it("should apply default PGVECTOR_HOST when missing", () => {
      processEnv = omit(processEnv, ["PGVECTOR_HOST"]);
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.PGVECTOR_HOST).toBe("localhost");
    });

    it("should apply default PGVECTOR_DB when missing", () => {
      processEnv = omit(processEnv, ["PGVECTOR_DB"]);
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.PGVECTOR_DB).toBe("vector");
    });

    it("should apply default PGVECTOR_USER when missing", () => {
      processEnv = omit(processEnv, ["PGVECTOR_USER"]);
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.PGVECTOR_USER).toBe("postgres");
    });

    it("should reject missing PGVECTOR_PASSWORD", () => {
      processEnv = omit(processEnv, ["PGVECTOR_PASSWORD"]);
      try {
        ConfigInitSchema.parse(processEnv);
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(ZodError);
    });

    it("should reject empty PGVECTOR_PASSWORD", () => {
      processEnv.PGVECTOR_PASSWORD = "";
      try {
        ConfigInitSchema.parse(processEnv);
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(ZodError);
    });
  });

  describe("Storage validation", () => {
    it("should apply default STORAGE_VENDOR when missing", () => {
      processEnv = omit(processEnv, ["STORAGE_VENDOR"]);
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.STORAGE_VENDOR).toBe("rustfs");
    });

    it("should transform STORAGE_FORCE_PATH_STYLE 'true' to boolean true", () => {
      processEnv.STORAGE_FORCE_PATH_STYLE = "true";
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.STORAGE_FORCE_PATH_STYLE).toBe(true);
    });

    it("should transform STORAGE_FORCE_PATH_STYLE 'false' to boolean false", () => {
      processEnv.STORAGE_FORCE_PATH_STYLE = "false";
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.STORAGE_FORCE_PATH_STYLE).toBe(false);
    });

    it("should apply default STORAGE_FORCE_PATH_STYLE when missing", () => {
      processEnv = omit(processEnv, ["STORAGE_FORCE_PATH_STYLE"]);
      const result = ConfigInitSchema.parse(processEnv);
      expect(result.STORAGE_FORCE_PATH_STYLE).toBe(false);
    });

    it("should reject missing STORAGE_ACCESS_KEY", () => {
      processEnv = omit(processEnv, ["STORAGE_ACCESS_KEY"]);
      try {
        ConfigInitSchema.parse(processEnv);
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(ZodError);
    });

    it("should reject empty STORAGE_ACCESS_KEY", () => {
      processEnv.STORAGE_ACCESS_KEY = "";
      try {
        ConfigInitSchema.parse(processEnv);
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(ZodError);
    });

    it("should reject missing STORAGE_SECRET_KEY", () => {
      processEnv = omit(processEnv, ["STORAGE_SECRET_KEY"]);
      try {
        ConfigInitSchema.parse(processEnv);
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(ZodError);
    });

    it("should reject empty STORAGE_SECRET_KEY", () => {
      processEnv.STORAGE_SECRET_KEY = "";
      try {
        ConfigInitSchema.parse(processEnv);
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(ZodError);
    });
  });

  describe("Complete validation scenarios", () => {
    it("should accept valid configuration with all fields", () => {
      const result = ConfigInitSchema.parse(processEnv);
      expect(result).toEqual({
        // server
        NODE_ENV: "development",
        PORT: 10001,
        CORS_ALLOWED_ORIGINS: ["http://localhost:3000", "http://localhost:3001"],
        LOCALE: "en-US",
        TZ: "America/Los_Angeles",

        // postgres
        POSTGRES_PORT: 5432,
        POSTGRES_HOST: "localhost",
        POSTGRES_DB: "yokg",
        POSTGRES_USER: "postgres",
        POSTGRES_PASSWORD: "mypassword",

        // graph db (age)
        GRAPH_DB_VENDOR: "age",
        AGE_PORT: 5455,
        AGE_HOST: "localhost",
        AGE_DB: "graph",
        AGE_USER: "postgres",
        AGE_PASSWORD: "mypassword",
        AGE_POOL_MAX_CONNECTIONS: 10,
        AGE_POOL_IDLE_TIMEOUT_MS: 30000,
        AGE_POOL_MAX_LIFETIME_SECONDS: 36000,

        // vector db (pgvector)
        VECTOR_DB_VENDOR: "pgvector",
        PGVECTOR_PORT: 5487,
        PGVECTOR_HOST: "localhost",
        PGVECTOR_DB: "vector",
        PGVECTOR_USER: "postgres",
        PGVECTOR_PASSWORD: "mypassword",
        PGVECTOR_POOL_MAX_CONNECTIONS: 10,
        PGVECTOR_POOL_IDLE_TIMEOUT_MS: 30000,
        PGVECTOR_POOL_MAX_LIFETIME_SECONDS: 36000,

        // redis
        REDIS_PORT: 6379,
        REDIS_HOST: "localhost",
        REDIS_DB: 0,
        REDIS_PASSWORD: "mypassword",

        // storage
        STORAGE_VENDOR: "rustfs",
        STORAGE_ACCESS_KEY: "rustfsadmin",
        STORAGE_SECRET_KEY: "mypassword",
        STORAGE_REGION: "us-east-1",
        STORAGE_PUBLIC_BUCKET_NAME: "public",
        STORAGE_PRIVATE_BUCKET_NAME: "private",
        STORAGE_FORCE_PATH_STYLE: true,
        STORAGE_INTERNAL_ENDPOINT: "http://localhost:9000",
        STORAGE_EXTERNAL_ENDPOINT: "http://localhost:9001",

        // better-auth
        BETTER_AUTH_SECRET: "a7081891386aea621b1c766c07f2186b573fbe5f8497c5243801565683d039d9",
        BETTER_AUTH_URL: "http://localhost:10001",
      });
    });

    it("should accept valid configuration with only required fields", () => {
      const minimalConfig = {
        // required fields (no defaults)
        POSTGRES_PASSWORD: "pgpass",
        AGE_PASSWORD: "agepass",
        PGVECTOR_PASSWORD: "pgvectorpass",
        REDIS_PASSWORD: "redispass",
        STORAGE_ACCESS_KEY: "accesskey",
        STORAGE_SECRET_KEY: "secretkey",
        STORAGE_PUBLIC_BUCKET_NAME: "public",
        STORAGE_PRIVATE_BUCKET_NAME: "private",
        STORAGE_INTERNAL_ENDPOINT: "http://localhost:9000",
        STORAGE_EXTERNAL_ENDPOINT: "http://localhost:9001",
        BETTER_AUTH_SECRET: "secret-key",
        BETTER_AUTH_URL: "http://localhost:3000",
      };
      const result = ConfigInitSchema.parse(minimalConfig);

      // required fields
      expect(result.POSTGRES_PASSWORD).toBe(minimalConfig.POSTGRES_PASSWORD);
      expect(result.AGE_PASSWORD).toBe(minimalConfig.AGE_PASSWORD);
      expect(result.PGVECTOR_PASSWORD).toBe(minimalConfig.PGVECTOR_PASSWORD);
      expect(result.REDIS_PASSWORD).toBe(minimalConfig.REDIS_PASSWORD);
      expect(result.STORAGE_ACCESS_KEY).toBe(minimalConfig.STORAGE_ACCESS_KEY);
      expect(result.STORAGE_SECRET_KEY).toBe(minimalConfig.STORAGE_SECRET_KEY);
      expect(result.STORAGE_PUBLIC_BUCKET_NAME).toBe(minimalConfig.STORAGE_PUBLIC_BUCKET_NAME);
      expect(result.STORAGE_PRIVATE_BUCKET_NAME).toBe(minimalConfig.STORAGE_PRIVATE_BUCKET_NAME);
      expect(result.STORAGE_INTERNAL_ENDPOINT).toBe(minimalConfig.STORAGE_INTERNAL_ENDPOINT);
      expect(result.STORAGE_EXTERNAL_ENDPOINT).toBe(minimalConfig.STORAGE_EXTERNAL_ENDPOINT);
      expect(result.BETTER_AUTH_SECRET).toBe(minimalConfig.BETTER_AUTH_SECRET);
      expect(result.BETTER_AUTH_URL).toBe(minimalConfig.BETTER_AUTH_URL);

      // defaults
      expect(result.PORT).toBe(10001);
      expect(result.LOCALE).toBe("zh-CN");
      expect(result.TZ).toBe("Asia/Shanghai");
      expect(result.CORS_ALLOWED_ORIGINS).toEqual([]);
      expect(result.POSTGRES_PORT).toBe(5432);
      expect(result.POSTGRES_HOST).toBe("localhost");
      expect(result.POSTGRES_DB).toBe("yokg");
      expect(result.POSTGRES_USER).toBe("postgres");
      expect(result.GRAPH_DB_VENDOR).toBe("age");
      expect(result.AGE_PORT).toBe(5455);
      expect(result.AGE_HOST).toBe("localhost");
      expect(result.AGE_DB).toBe("graph");
      expect(result.AGE_USER).toBe("postgres");
      expect(result.AGE_POOL_MAX_CONNECTIONS).toBe(10);
      expect(result.AGE_POOL_IDLE_TIMEOUT_MS).toBe(30000);
      expect(result.AGE_POOL_MAX_LIFETIME_SECONDS).toBe(36000);
      expect(result.VECTOR_DB_VENDOR).toBe("pgvector");
      expect(result.PGVECTOR_PORT).toBe(5487);
      expect(result.PGVECTOR_HOST).toBe("localhost");
      expect(result.PGVECTOR_DB).toBe("vector");
      expect(result.PGVECTOR_USER).toBe("postgres");
      expect(result.PGVECTOR_POOL_MAX_CONNECTIONS).toBe(10);
      expect(result.PGVECTOR_POOL_IDLE_TIMEOUT_MS).toBe(30000);
      expect(result.PGVECTOR_POOL_MAX_LIFETIME_SECONDS).toBe(36000);
      expect(result.REDIS_PORT).toBe(6379);
      expect(result.REDIS_HOST).toBe("localhost");
      expect(result.REDIS_DB).toBe(0);
      expect(result.STORAGE_VENDOR).toBe("rustfs");
      expect(result.STORAGE_FORCE_PATH_STYLE).toBe(false);
      expect(result.STORAGE_REGION).toBe("us-east-1");
    });
  });
});
