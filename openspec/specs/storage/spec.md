# storage Specification

## Purpose
TBD - created by archiving change update-storage-interfaces. Update Purpose after archive.
## Requirements
### Requirement: Storage results identify targets
Storage operation results SHALL include the bucket name and the relevant object key or keys that were acted on.

#### Scenario: Single-object operation
- **WHEN** a single-object operation completes (upload, download, delete, metadata lookup)
- **THEN** the result SHALL include the bucket name and the object key

#### Scenario: Multi-object operation
- **WHEN** a multi-object operation completes (batch delete, prefix delete, existence checks)
- **THEN** the result SHALL include the bucket name and the object keys affected

### Requirement: Public bucket policy helper
The extended S3 adapter SHALL provide a helper to ensure a public-read bucket policy is applied when required.

#### Scenario: Public policy applied
- **WHEN** the public policy helper is invoked
- **THEN** the bucket SHALL allow unauthenticated read access to objects

### Requirement: Non-paginated list semantics
The storage list operation SHALL be explicitly named to indicate it returns all matching keys without pagination.

#### Scenario: Listing object keys
- **WHEN** listing object keys with an optional prefix
- **THEN** the method name SHALL reflect non-paginated key listing semantics
- **AND** the result SHALL include the bucket name, the prefix used, and the list of keys

### Requirement: Bucket ensure semantics for base AWS adapter
The base AWS S3 adapter SHALL only verify bucket existence and SHALL NOT create buckets.

#### Scenario: Bucket exists
- **WHEN** the base adapter ensures a bucket
- **THEN** it SHALL return existed=true and created=false

#### Scenario: Bucket missing
- **WHEN** the base adapter ensures a bucket that does not exist
- **THEN** it SHALL report the missing bucket without creating it

### Requirement: Bucket creation for extended adapter
The extended S3 adapter SHALL create the bucket if it does not exist.

#### Scenario: Bucket missing
- **WHEN** the extended adapter ensures a bucket that does not exist
- **THEN** it SHALL create the bucket and return created=true

