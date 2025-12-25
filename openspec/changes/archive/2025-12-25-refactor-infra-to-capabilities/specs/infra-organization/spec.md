# Capability: Infrastructure Organization

## ADDED Requirements

### Requirement: Capability-Based Infrastructure Directory Structure
The infrastructure directory SHALL be organized by functional capabilities rather than technology implementations to improve maintainability and implementation flexibility.

#### Scenario: Infrastructure directory organization
- **WHEN** examining the `apps/backend/src/infra/` directory
- **THEN** subdirectories SHALL be named after capabilities (cache, queue, relational-database, vector-database, graph-database, object-storage, storage)
- **AND** subdirectories SHALL NOT be named after specific technologies (redis, bullmq, pgvector, postgres, minio, etc.)

#### Scenario: Capability directory contents
- **WHEN** a capability directory exists (e.g., `cache/`)
- **THEN** it SHALL contain implementation files using the chosen technology (e.g., Redis)
- **AND** the directory name SHALL remain unchanged if the underlying technology is swapped
- **AND** the directory SHALL export a consistent interface regardless of implementation

### Requirement: Infrastructure Module Structure
Each infrastructure capability directory SHALL follow a consistent module structure with standardized exports and initialization patterns.

#### Scenario: Required module files
- **WHEN** an infrastructure capability is implemented
- **THEN** the directory SHALL contain a `client.ts` file for client initialization
- **AND** SHALL contain an `index.ts` file for public exports
- **AND** MAY contain a `helpers.ts` file for utility functions
- **AND** MAY contain additional files specific to the capability (e.g., `keys.ts`, `ttl.ts`, `queues/`, `workers/`)

#### Scenario: Module initialization pattern
- **WHEN** an infrastructure module provides a client
- **THEN** `client.ts` SHALL export initialization and cleanup functions
- **AND** `index.ts` SHALL re-export the client and related utilities
- **AND** SHALL follow singleton pattern where appropriate for connection management

### Requirement: Import Path Convention
Import paths for infrastructure modules SHALL reference capability names to maintain consistency and enable future technology swaps.

#### Scenario: Importing infrastructure modules
- **WHEN** code imports an infrastructure module
- **THEN** import paths SHALL use `@/infra/{capability}` format (e.g., `@/infra/cache`, `@/infra/queue`)
- **AND** SHALL NOT reference technology names in import paths (e.g., NOT `@/infra/redis`, `@/infra/bullmq`)

#### Scenario: Internal module imports
- **WHEN** infrastructure module files import from sibling files
- **THEN** they SHALL use relative imports within the capability directory
- **AND** SHALL NOT use absolute paths for internal module references

### Requirement: Infrastructure Capability Mapping
The system SHALL maintain a clear mapping between infrastructure capabilities and their implementation technologies for documentation and onboarding purposes.

#### Scenario: Technology to capability mapping
- **WHEN** developers need to locate infrastructure code
- **THEN** the following mappings SHALL be understood:
  - Cache capability: implemented via Redis
  - Queue capability: implemented via BullMQ
  - Relational-database capability: implemented via PostgreSQL + Drizzle ORM
  - Vector-database capability: implemented via pgvector extension
  - Graph-database capability: implemented via Apache AGE (PostgreSQL extension)
  - Object-storage capability: planned for multi-provider (S3, MinIO, etc.)
  - Storage capability: multi-provider object storage interface

#### Scenario: Documentation references
- **WHEN** infrastructure is documented in project.md or other docs
- **THEN** documentation SHALL reference both capability names and their implementations
- **AND** SHALL clarify that capability names are stable while implementations may change
