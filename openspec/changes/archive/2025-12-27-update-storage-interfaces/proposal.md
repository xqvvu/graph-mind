# Change: Update storage interfaces and S3 bucket semantics

## Why
Storage operations should return consistent identifiers and avoid implicit behaviors like creating buckets in the base AWS adapter.

## What Changes
- **BREAKING** Rename the non-paginated listing method to reflect key-only semantics.
- **BREAKING** Adjust several storage return shapes to always include bucket and object keys, and provide richer key results where helpful.
- Change AWS S3 adapter `ensureBucket` to only check existence (no creation).
- Implement extended S3 adapter to create bucket when missing and to ensure a public-read bucket policy.

## Impact
- Affected specs: storage (new capability spec)
- Affected code: `apps/backend/src/infra/storage/interface.ts`, `apps/backend/src/infra/storage/types.ts`, S3 adapters under `apps/backend/src/infra/storage/adapters/`.
