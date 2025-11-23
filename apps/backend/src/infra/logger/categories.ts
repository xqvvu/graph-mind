/**
 * LogTape category definitions for hierarchical logging
 *
 * Structure: ["gd", layer, module?, feature?]
 *
 * Layers:
 * - http: HTTP layer (requests, responses, errors)
 * - middleware: Middleware layer (auth, validation, session)
 * - module: Business modules (auth, users, etc.)
 * - infra: Infrastructure layer (database, redis, etc.)
 * - external: External integrations (better-auth, stripe, etc.)
 *
 * Usage:
 * ```ts
 * import { Categories, getLogger } from "@/infra/logger";
 *
 * const logger = getLogger(Categories.Module.Users);
 * logger.info`User {userId} created`;
 * ```
 */

// ========================================
// Root Logger
// ========================================

/**
 * Root application logger
 * Use for application-level events
 */
export const root = ["gd"] as const;

// ========================================
// HTTP Layer
// ========================================

/**
 * HTTP layer loggers
 * Use for HTTP requests, responses, and errors
 */
export const http = {
  request: ["gd", "http", "request"],
  response: ["gd", "http", "response"],
  error: ["gd", "http", "error"],
  warn: ["gd", "http", "warn"],
} as const;

// ========================================
// Middleware Layer
// ========================================

/**
 * Middleware layer loggers
 * Use for middleware operations (auth, validation, session, etc.)
 */
export const middleware = {
  auth: ["gd", "middleware", "auth"],
  validation: ["gd", "middleware", "validation"],
  session: ["gd", "middleware", "session"],
} as const;

// ========================================
// Business Module Layer
// ========================================

/**
 * Business module loggers
 * Add new modules here as your application grows
 *
 * @example
 * ```ts
 * // Add new module
 * export const mod = {
 *   Auth: ["gd", "module", "auth"],
 *   Users: ["gd", "module", "users"],
 *   YourNewModule: ["gd", "module", "your-new-module"],
 * } as const;
 * ```
 */
export const mod = {
  auth: ["gd", "module", "auth"],
  users: ["gd", "module", "users"],
} as const;

// ========================================
// Infrastructure Layer
// ========================================

/**
 * Infrastructure layer loggers
 * Use for database, redis, and other infrastructure operations
 */
export const infra = {
  database: ["gd", "infra", "database"],
  redis: ["gd", "infra", "redis"],
  ai: ["gd", "infra", "ai"],
} as const;

// ========================================
// External Integration Layer
// ========================================

/**
 * External integration loggers
 * Use for third-party services and integrations
 */
export const external = {
  betterAuth: ["gd", "external", "better-auth"],
} as const;

// ========================================
// Type Definitions
// ========================================

/**
 * Union type of all valid log categories
 * Automatically includes all defined categories
 */
export type LogCategory =
  | typeof root
  | (typeof http)[keyof typeof http]
  | (typeof middleware)[keyof typeof middleware]
  | (typeof mod)[keyof typeof mod]
  | (typeof infra)[keyof typeof infra]
  | (typeof external)[keyof typeof external];
