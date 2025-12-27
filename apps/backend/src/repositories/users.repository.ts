import { users } from "@yokg/shared/schemas";
import type { nil } from "@yokg/shared/types/utils";
import type { IUser } from "@yokg/shared/validate/users";
import { eq } from "drizzle-orm";
import { isNil, isNotNil } from "es-toolkit";
import { getCache, getCacheLogger } from "@/infra/cache";
import { CacheKeyFactory } from "@/infra/cache/keys";
import { CacheTTLCalculator } from "@/infra/cache/ttl";
import { getRelDb, getRelDbLogger } from "@/infra/rel-db";
import type { IUserRepository } from "./users.repository.interface";

export class UserRepository implements IUserRepository {
  constructor(
    protected readonly db = getRelDb(),
    protected readonly cache = getCache(),
  ) {}

  async findById(id: string): Promise<IUser | null> {
    const factory = new CacheKeyFactory();
    const dbLogger = getRelDbLogger();
    const cacheLogger = getCacheLogger();

    const key = factory.users.byId(id);

    const cache = (await this.cache.json.get(key)) as IUser | nil;
    if (isNotNil(cache)) {
      cacheLogger.debug(`Cache hit for user ${id}`);
      return cache;
    }

    cacheLogger.debug(`Cache miss for user ${id}`);

    dbLogger.debug(`Query user by id ${id}`);
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (isNotNil(user)) {
      cacheLogger.debug(`Cache user ${id}`);
      const ttl = new CacheTTLCalculator();
      this.cache
        .multi()
        .json.set(key, "$", user)
        .expire(key, ttl.$1_hour)
        .exec()
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : "unknown error";
          cacheLogger.warn(`Cache write failed for user ${id}: ${message}`);
        });
    }

    return isNotNil(user) ? user : null;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const dbLogger = getRelDbLogger();

    dbLogger.debug("Query user by email");
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });

    return user || null;
  }

  async findMany(): Promise<IUser[]> {
    getRelDbLogger().debug("Query all users");
    return await this.db.query.users.findMany();
  }

  async delete(id: string): Promise<void> {
    getRelDbLogger().info(`Delete user ${id}`);
    await this.db.delete(users).where(eq(users.id, id));

    const factory = new CacheKeyFactory();
    getCacheLogger().debug(`Invalidate cache for user ${id}`);
    await this.cache.del(factory.users.byId(id));
  }
}

let userRepository: IUserRepository | null = null;
export function getUserRepository(): IUserRepository {
  if (isNil(userRepository)) {
    userRepository = new UserRepository();
  }
  return userRepository;
}

export function destroyUserRepository() {
  if (isNotNil(userRepository)) {
    userRepository = null;
  }
}
