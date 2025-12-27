# Change: Refactor Infra Capability APIs and Naming

## Why
The infra layer already uses capability directories, but its exported APIs, logger categories, and configuration still use technology-specific names. This creates inconsistency and makes future technology swaps harder. We need short, capability-based names with a simple adapter structure so implementations can change without rewriting call sites.

## What Changes
- **BREAKING**: Rename infra capability directories to short names (e.g., `graph-db`, `vector-db`, `rel-db`)
- **BREAKING**: Rename public exports to capability-based APIs (no technology names)
- Introduce adapter-based implementations with minimal CRUD/query interfaces
- Standardize capability configuration shape as `{ vendor, options }`
- Update logger categories and documentation to match capability naming

## Impact
- Affected specs: `infra-organization`
- Affected code:
  - `apps/backend/src/infra/*` (directories, exports, adapters)
  - `apps/backend/src/lib/config.ts` and shared config schemas
  - All imports referencing infra modules
  - `openspec/project.md` and related docs
