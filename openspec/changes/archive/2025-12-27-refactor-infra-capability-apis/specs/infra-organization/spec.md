## MODIFIED Requirements

### Requirement: Capability-Based Infrastructure Directory Structure
The infrastructure directory SHALL be organized by functional capabilities using short, stable names to improve maintainability and implementation flexibility.

#### Scenario: Infrastructure directory organization
- **WHEN** examining the `apps/backend/src/infra/` directory
- **THEN** subdirectories SHALL be named after capabilities using short names (e.g., `cache`, `queue`, `rel-db`, `graph-db`, `vector-db`, `storage`)
- **AND** subdirectories SHALL NOT be named after specific technologies (redis, bullmq, age, pgvector, postgres, rustfs, etc.)

#### Scenario: Capability directory contents
- **WHEN** a capability directory exists (e.g., `cache/`)
- **THEN** it SHALL contain implementation files using the chosen technology
- **AND** the directory name SHALL remain unchanged if the underlying technology is swapped
- **AND** the directory SHALL export a consistent interface regardless of implementation

### Requirement: Infrastructure Module Structure
Each infrastructure capability directory SHALL follow a consistent module structure with standardized exports and initialization patterns.

#### Scenario: Required module files
- **WHEN** an infrastructure capability is implemented
- **THEN** the directory SHALL contain a `client.ts` file for capability initialization
- **AND** SHALL contain an `index.ts` file for public exports
- **AND** SHALL contain an `adapters/` directory for implementation-specific code when multiple vendors are supported
- **AND** MAY contain a `helpers.ts` file for utility functions
- **AND** MAY contain additional files specific to the capability (e.g., `keys.ts`, `ttl.ts`, `queues/`, `workers/`)

#### Scenario: Adapter layout
- **WHEN** a capability supports multiple technologies (e.g., `graph-db`, `vector-db`, `storage`)
- **THEN** each implementation SHALL live in `adapters/<vendor>.ts`
- **AND** adapters SHALL implement the capability interface

#### Scenario: Module initialization pattern
- **WHEN** an infrastructure module provides a client
- **THEN** `client.ts` SHALL export initialization and cleanup functions
- **AND** `index.ts` SHALL re-export the client and related utilities
- **AND** SHALL follow singleton pattern where appropriate for connection management

### Requirement: Import Path Convention
Import paths for infrastructure modules SHALL reference capability names to maintain consistency and enable future technology swaps.

#### Scenario: Importing infrastructure modules
- **WHEN** code imports an infrastructure module
- **THEN** import paths SHALL use `@/infra/{capability}` with short names (e.g., `@/infra/graph-db`, `@/infra/vector-db`)
- **AND** SHALL NOT reference technology names in import paths (e.g., NOT `@/infra/redis`, `@/infra/pgvector`)

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
  - Relational database capability (`rel-db`): implemented via PostgreSQL + Drizzle ORM
  - Vector database capability (`vector-db`): implemented via pgvector extension
  - Graph database capability (`graph-db`): implemented via Apache AGE (PostgreSQL extension)
  - Storage capability (`storage`): implemented via S3-compatible adapters (RustFS, MinIO, AWS S3)

#### Scenario: Documentation references
- **WHEN** infrastructure is documented in project.md or other docs
- **THEN** documentation SHALL reference both capability names and their implementations
- **AND** SHALL clarify that capability names are stable while implementations may change

## ADDED Requirements

### Requirement: Capability API Naming
Public exports in infrastructure modules SHALL use capability-based names and avoid technology identifiers.

#### Scenario: Public exports naming
- **WHEN** importing from a capability module (e.g., `@/infra/graph-db`)
- **THEN** exported symbols SHALL use capability-based names (e.g., `getGraphDbPool`, `getGraphDbLogger`)
- **AND** technology names SHALL appear only inside adapter modules

### Requirement: Adapter-Aware Configuration
Infrastructure capability configuration SHALL use a `{ vendor, options }` shape with vendor-specific validation.

#### Scenario: Vendor-specific options
- **WHEN** configuring a capability (e.g., `graph-db`)
- **THEN** config SHALL include a `vendor` value and `options` payload
- **AND** `options` SHALL be validated against the selected vendor schema
- **AND** switching vendor SHALL only require configuration changes

#### Scenario: Environment mapping
- **WHEN** environment variables are loaded
- **THEN** capability config SHALL be derived from vendor-specific env values
- **AND** the public config shape SHALL remain stable across vendors
