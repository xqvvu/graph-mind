## Context
The infra layer uses capability directories, but public exports, logger categories, and config keys still use technology names (age, pgvector, redis). This causes inconsistency and makes future vendor swaps noisy. We want short, capability-first naming and a minimal adapter structure that can evolve without over-abstracting early.

## Goals / Non-Goals
- Goals:
  - Short, capability-based directory names and imports.
  - Stable capability-level APIs with minimal CRUD/query surface.
  - Adapter-based implementations for technology-specific code.
  - Vendor-specific configuration under a unified capability config shape.
- Non-Goals:
  - Introduce new database vendors beyond current AGE/pgvector/Redis.
  - Build a heavy abstraction layer or advanced feature set.
  - Maintain backward compatibility with old import paths.

## Decisions
- Use short capability names: `rel-db`, `graph-db`, `vector-db`, `cache`, `queue`, `storage`, `logger`.
- Capability modules expose technology-agnostic APIs; adapters live under `adapters/`.
- Configuration uses `{ vendor, options }` per capability; options are validated with vendor-specific schemas.
- Technology names appear only inside adapters and configuration mapping.
- Keep `rel-db` as a single-vendor capability (PostgreSQL) without adapters for now.

## Risks / Trade-offs
- Breaking imports and local configuration during the rename.
- Extra files and boilerplate for adapters.

## Migration Plan
1. Rename infra directories and update imports/exports.
2. Introduce adapter folders and move existing implementations into adapter files.
3. Update config schema and mapping to capability-level vendor/options.
4. Update logger categories and helper names.
5. Run lint/tests and update docs.

## Open Questions
- Confirm minimal CRUD/query interface signatures for graph-db and vector-db.
- Decide whether cache/queue need adapters now or later.
