# Change: Refactor Infrastructure to Capability-Based Organization

## Why
The current infrastructure directory is organized by technology names (redis, database, bullmq, pgvector), which couples the directory structure to specific implementation choices. This makes it harder to swap implementations and doesn't clearly communicate the functional purpose of each component. We need to reorganize by capability (cache, queue, relational-database, vector-database) to better express what each infrastructure component does rather than how it's implemented.

## What Changes
- **BREAKING**: Restructure `apps/backend/src/infra/` from technology-based to capability-based directories
- Migrate files from:
  - `redis/` → `cache/` (Redis provides caching capability)
  - `bullmq/` → `queue/` (BullMQ provides queue capability)
  - `database/` → `relational-database/` (PostgreSQL/Drizzle provides relational DB capability)
  - `pgvector/` → `vector-database/` (pgvector provides vector search capability)
  - `age/` → `graph-database/` (Apache AGE provides graph database capability)
- Keep existing capability-based directories:
  - `object-storage/` (already capability-based, empty placeholder)
  - `storage/` (already capability-based, has implementation)
  - `logger/` (already appropriately named)
- Update all import paths across the codebase
- Preserve all functionality and exports
- Note: `storage/` directory implementation is incomplete but will be migrated as-is

## Impact
- Affected specs: infra-organization (new capability documenting infrastructure patterns)
- Affected code:
  - `apps/backend/src/infra/redis/*` → `apps/backend/src/infra/cache/*`
  - `apps/backend/src/infra/bullmq/*` → `apps/backend/src/infra/queue/*`
  - `apps/backend/src/infra/database/*` → `apps/backend/src/infra/relational-database/*`
  - `apps/backend/src/infra/pgvector/*` → `apps/backend/src/infra/vector-database/*`
  - `apps/backend/src/infra/age/*` → `apps/backend/src/infra/graph-database/*`
  - All files importing from these paths (8+ files identified)
- Breaking change: Import paths will change, requiring updates in consuming code
- Migration can be done incrementally with errors temporarily ignored per user request
