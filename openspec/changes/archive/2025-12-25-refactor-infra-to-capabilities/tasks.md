# Implementation Tasks

## 1. Migration Preparation
- [x] 1.1 Verify all target directories exist (cache, queue, relational-database, vector-database, graph-database, object-storage)
- [x] 1.2 Document current import patterns with grep analysis for all migration sources
- [x] 1.3 Create import path mapping reference

## 2. Migrate Redis to Cache
- [x] 2.1 Move `infra/redis/client.ts` → `infra/cache/client.ts`
- [x] 2.2 Move `infra/redis/helpers.ts` → `infra/cache/helpers.ts`
- [x] 2.3 Move `infra/redis/index.ts` → `infra/cache/index.ts`
- [x] 2.4 Move `infra/redis/keys.ts` → `infra/cache/keys.ts`
- [x] 2.5 Move `infra/redis/ttl.ts` → `infra/cache/ttl.ts`
- [x] 2.6 Update imports in `infra/cache/index.ts` (internal imports)
- [x] 2.7 Remove empty `infra/redis/` directory

## 3. Migrate BullMQ to Queue
- [x] 3.1 Move `infra/bullmq/client.ts` → `infra/queue/client.ts`
- [x] 3.2 Move `infra/bullmq/helpers.ts` → `infra/queue/helpers.ts`
- [x] 3.3 Move `infra/bullmq/index.ts` → `infra/queue/index.ts`
- [x] 3.4 Move `infra/bullmq/queues/` → `infra/queue/queues/`
- [x] 3.5 Move `infra/bullmq/workers/` → `infra/queue/workers/`
- [x] 3.6 Update imports in `infra/queue/index.ts` (internal imports)
- [x] 3.7 Remove empty `infra/bullmq/` directory

## 4. Migrate Database to Relational-Database
- [x] 4.1 Move `infra/database/client.ts` → `infra/relational-database/client.ts`
- [x] 4.2 Move `infra/database/helpers.ts` → `infra/relational-database/helpers.ts`
- [x] 4.3 Move `infra/database/index.ts` → `infra/relational-database/index.ts`
- [x] 4.4 Update imports in `infra/relational-database/index.ts` (internal imports)
- [x] 4.5 Remove empty `infra/database/` directory

## 5. Migrate pgvector to Vector-Database
- [x] 5.1 Move `infra/pgvector/client.ts` → `infra/vector-database/client.ts`
- [x] 5.2 Move `infra/pgvector/helpers.ts` → `infra/vector-database/helpers.ts`
- [x] 5.3 Move `infra/pgvector/index.ts` → `infra/vector-database/index.ts`
- [x] 5.4 Update imports in `infra/vector-database/index.ts` and `infra/vector-database/helpers.ts` (internal imports)
- [x] 5.5 Remove empty `infra/pgvector/` directory

## 6. Migrate AGE to Graph-Database
- [x] 6.1 Move `infra/age/client.ts` → `infra/graph-database/client.ts`
- [x] 6.2 Move `infra/age/helpers.ts` → `infra/graph-database/helpers.ts`
- [x] 6.3 Move `infra/age/index.ts` → `infra/graph-database/index.ts`
- [x] 6.4 Update imports in `infra/graph-database/index.ts` (internal imports)
- [x] 6.5 Remove empty `infra/age/` directory

## 7. Update External Import References
- [x] 7.1 Update imports in `apps/backend/src/lib/auth.ts`
- [x] 7.2 Update imports in `apps/backend/src/repositories/users.repository.ts`
- [x] 7.3 Update imports in `apps/backend/src/main.ts`
- [x] 7.4 Update imports in `apps/backend/test/integration/global-setup.ts`
- [x] 7.5 Search for any additional import references with comprehensive grep
- [x] 7.6 Verified no dynamic imports or string-based references

## 8. Verification and Cleanup
- [x] 8.1 Run type check to identify any remaining import errors (only storage errors remain as expected)
- [x] 8.2 Verify all old directories (redis, bullmq, database, pgvector, age) are removed
- [x] 8.3 Verify new structure matches capability-based naming pattern
- [x] 8.4 Run biome check (passed with only storage-related warnings)
- [x] 8.5 Final structure verification completed

## Implementation Summary

All tasks completed successfully. The infrastructure has been fully migrated from technology-based to capability-based organization:

**Migrations Completed:**
- `redis/` → `cache/` (5 files)
- `bullmq/` → `queue/` (5 files + 2 subdirectories)
- `database/` → `relational-database/` (3 files)
- `pgvector/` → `vector-database/` (3 files)
- `age/` → `graph-database/` (3 files)

**Files Updated:**
- `apps/backend/src/lib/auth.ts`
- `apps/backend/src/repositories/users.repository.ts`
- `apps/backend/src/main.ts`
- `apps/backend/test/integration/global-setup.ts`

**Final Structure:**
- ✅ `cache/` - Redis-based caching
- ✅ `queue/` - BullMQ-based job queue
- ✅ `relational-database/` - PostgreSQL + Drizzle ORM
- ✅ `vector-database/` - pgvector extension
- ✅ `graph-database/` - Apache AGE extension
- ✅ `storage/` - Multi-provider object storage (incomplete, preserved as-is)
- ✅ `logger/` - Logging infrastructure (unchanged)

**Type Check Results:**
- All migration-related type errors resolved
- Remaining type errors are only in the `storage/` directory (expected, incomplete implementation)
- No import path errors outside of storage

## Notes
- Storage directory (`infra/storage/`) is incomplete but remains in place per user request
- All old technology-based directories successfully removed
- Logger directory remained unchanged (already appropriately named)
- Biome linter automatically reformatted imports (alphabetically sorted)
