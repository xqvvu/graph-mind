# Project Context

## Purpose
A RAG (Retrieval-Augmented Generation) enhanced Knowledge Graph system that combines structured data (Knowledge Graph) with unstructured data (LLM/RAG) for intelligent information retrieval and reasoning.

### Core Objectives
- **Knowledge Graph Management**: Create, visualize, and query interconnected entities and relationships
- **RAG-Enhanced Discovery**: Leverage LLM capabilities to augment knowledge discovery through semantic search and contextual reasoning
- **Hybrid Search**: Combine vector search (semantic) with graph traversal (structural) for comprehensive information retrieval

## Tech Stack

### Core
- **Languages:** TypeScript (strict mode) for apps; Python planned for compute
- **Runtime:** Node.js ^24
- **Package Manager:** pnpm ^10.26
- **Monorepo Management:** pnpm workspaces + Turborepo
- **Tooling:** Biome, Vitest, Lefthook, Just/Make

### Backend (`apps/backend`)
- **Framework:** Hono (Node.js adapter)
- **Build:** tsdown
- **Database (Relational):** PostgreSQL + Drizzle ORM
- **Database (Graph):** Apache AGE (Postgres extension)
- **Database (Vector):** pgvector (separate Postgres instance)
- **Database (Cache/KV):** Redis
- **Queue:** BullMQ (Redis)
- **Object Storage:** S3-compatible (RustFS/MinIO/AWS S3 adapters)
- **AI/RAG:** Vercel AI SDK (`ai`, `@ai-sdk/*`)
- **Auth:** Better Auth
- **Validation:** Zod + drizzle-zod
- **Logging:** Logtape
- **Testing:** Vitest (unit + integration)
- **Rate Limiting:** hono-rate-limiter

### Frontend (`apps/web`)
- **Framework:** TanStack Start (React 19)
- **Build Tool:** Vite 7 (Nitro SSR adapter)
- **Routing:** TanStack Router (file-based)
- **Data Fetching:** TanStack Query
- **Forms:** React Hook Form + @hookform/resolvers
- **UI Components:** Base UI primitives + custom shadcn-style components
- **Styling:** Tailwind CSS v4 + class-variance-authority (cva) + tailwind-merge
- **Icons:** Phosphor Icons
- **Theming:** next-themes
- **Graph Visualization:** D3.js (d3-force for force-directed layouts)
- **Testing:** Vitest, React Testing Library

### Compute (`apps/compute`, planned)
- **Framework:** Litestar (Python)
- **RAG/Chunking:** LightRAG, Chonkie, RAG-Anything

### Shared Packages (`packages/`)
- `@yokg/shared`: Zod schemas, Drizzle tables, types, utilities

## Project Conventions

### Code Style
- **Linter/Formatter:** Biome (`biome.json`). All code must pass `pnpm check`.
- **Formatting Defaults:** Double quotes, semicolons, 100-char line width.
- **Pre-commit:** Lefthook runs Biome on staged files.
- **Type Safety:** Strict TypeScript configuration. No `any` unless absolutely necessary.
- **Path Aliases:** `@/` for `src/` (apps), `@yokg/shared/*` and `#test/*` in backend.
- **Naming Conventions:**
  - **Files:** `kebab-case` with role suffixes (e.g., `users.service.ts`, `auth.route.ts`)
  - **Classes:** `PascalCase` (e.g., `UserService`, `UserRepository`)
  - **Variables/Functions:** `camelCase`
  - **Constants:** `UPPER_SNAKE_CASE`
  - **Zod Schemas:** `PascalCase` + `Schema` suffix (e.g., `SelectUserSchema`, `ConfigInitSchema`)
  - **Types from Zod:** `PascalCase` with `I` prefix for interfaces (e.g., `IUser`) or descriptive suffix (e.g., `ConfigInit`)
  - **Repository Interfaces:** `I` + `EntityName` + `Repository` (e.g., `IUserRepository`)
  - **Route Handlers:** Named function with `Handler` suffix (e.g., `selectAllUsersHandler`)

### Backend Architecture

#### Directory Structure
```
apps/backend/src/
├── @types/           # Type declarations (hono.d.ts, process-env.d.ts)
├── app.ts            # Hono app wiring
├── main.ts           # Entrypoint
├── errors/           # Error types and helpers
├── infra/            # Infrastructure (rel-db, graph-db, vector-db, cache, storage, queue, logger)
├── lib/              # Utilities and helpers
├── middlewares/      # Hono middlewares
├── modules/          # Domain modules (auth/, users/)
│   └── [module]/
│       ├── [module].route.ts    # Route definitions
│       └── [module].service.ts  # Business logic
└── repositories/     # Data access layer
```

#### Layered Architecture
- **Route → Service → Repository** pattern
- Routes handle HTTP concerns, validation, response formatting
- Services contain business logic, orchestration
- Repositories handle data access (DB + Cache)

#### Infra Configuration
- Capability names are short and stable (`rel-db`, `graph-db`, `vector-db`, `cache`, `queue`, `storage`)
- Adapter-based capabilities use `{ vendor, options }` configuration (graph-db, vector-db, storage)
- Single-vendor capabilities stay direct (rel-db, cache, queue)

#### Dependency Management (Singleton Pattern)
```typescript
// Service singleton
let userService: UserService | null = null;
export function getUserService(): UserService {
  if (isNil(userService)) {
    userService = new UserService(getUserRepository());
  }
  return userService;
}
export function destroyUserService() { /* cleanup */ }
```

### API Response Format

#### Unified Response Structure
```typescript
// Success Response
{ ok: true, code: 0, message: "success", data?: T }

// Error Response
{ ok: false, errcode: number, errmsg: string }
```

#### Response Helpers (`@/lib/http`)
```typescript
R.ok(c, data)    // Success response
R.fail(c, { errcode, errmsg })  // Error response
```

### Error Code System

#### Format: 5-digit `[Module 2-digit][Category 3-digit]`
- Module 10: AUTH (101xx-107xx)
- Module 20: USER (201xx)
- Module 30: GRAPH (301xx-303xx)
- Reserved: 0 (success), -1 to -4 (generic errors)

#### Usage
```typescript
import { ErrorCode } from "@yokg/shared/lib/error-codes";

throw new BusinessException(404, {
  errcode: ErrorCode.USER.NOT_FOUND,  // 20101
  message: "User not found",
});
```

### Frontend Architecture

#### Directory Structure
```
apps/web/src/
├── __devtools/       # Dev-only tooling
├── components/
│   ├── ui/           # Base UI + cva components
│   └── [feature]/    # Feature-specific components
├── providers/        # App-wide providers (theme, query, etc.)
├── lib/              # Utilities
└── routes/           # TanStack Start file-based routes
    ├── -components/  # Route-scoped UI
    ├── -layouts/     # Shared layouts
    └── _layout/      # Route layout segments
```

#### UI Components
- Components use `cva` for variant definitions
- Export both component and variants (e.g., `Button`, `buttonVariants`)
- Use `data-slot` attribute for styling hooks
- Prefer Base UI primitives for accessibility

### Shared Package Conventions

#### Zod Schema Definitions (`@yokg/shared/validate/`)
```typescript
// From Drizzle table
export const SelectUserSchema = createSelectSchema(users);
export type IUser = z.infer<typeof SelectUserSchema>;

// Manual definition
export const ConfigInitSchema = z.object({ ... });
export type ConfigInit = z.output<typeof ConfigInitSchema>;
```

### Testing Strategy
- **Unit Tests:** Vitest for logic/services with mock repositories
- **Integration Tests:** Vitest for API endpoints and database interactions
- **Fixtures:** Use factories/fixtures in `test/fixtures/`
- **Mocks:** Repository mocks in `test/mocks/`

### Git Workflow
- **Commits:** Conventional Commits (e.g., `feat:`, `fix:`, `chore:`)
- **Branches:** Feature branching off `main`

## Domain Context

### Knowledge Graph
- **Nodes:** Entities representing real-world objects (Person, Concept, Document, Topic, etc.)
- **Edges:** Typed relationships between entities (AUTHOR_OF, RELATED_TO, BELONGS_TO, REFERENCES, etc.)
- **Properties:** Metadata on both nodes and edges (timestamps, weights, attributes)
- **Storage:** Apache AGE graph in Postgres (Cypher)

### RAG (Retrieval-Augmented Generation)
- **Hybrid Search:** Combine vector similarity (semantic) with graph traversal (structural)
- **Embedding Generation:** Convert documents/chunks to vector representations
- **Context Assembly:** Aggregate relevant context from multiple sources for LLM prompts
- **Chunking Strategy:** Split documents for optimal retrieval granularity

### Vector Search with pgvector
- **Tables:** Store embeddings alongside metadata in Postgres
- **Index Types:** HNSW for low-latency queries, IVFFlat for recall/accuracy trade-offs
- **Hybrid Query:** Combine vector similarity with scalar filters (e.g., by user, timestamp)
- **Integration Pattern:**
  ```typescript
  // pgvector query via pg Pool in infra/vector-db/
  const { rows } = await pool.query(
    "SELECT id, content FROM document_chunks WHERE user_id = $1 ORDER BY embedding <-> $2 LIMIT 10",
    [userId, embedding],
  );
  ```

### Graph Visualization with D3.js
- **Force-Directed Layout:** `d3-force` for automatic node positioning
- **Interactivity:** Zoom, pan, drag nodes, click to expand relationships
- **Performance:** Canvas rendering for large graphs (1000+ nodes), SVG for smaller
- **Data Flow:**
  ```
  Apache AGE → Backend API → Frontend → D3.js Renderer
  ```
- **Component Design:**
  ```typescript
  // React + D3 integration pattern
  components/
  └── graph/
      ├── graph-canvas.tsx      // Main D3 canvas component
      ├── graph-controls.tsx    // Zoom, filter controls
      ├── node-tooltip.tsx      // Node detail popover
      └── use-force-simulation.ts  // D3 force simulation hook
  ```

### AI SDK Integration (Vercel AI SDK)
```typescript
import { generateText, streamText, embed } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";

// Text generation
const { text } = await generateText({ model, prompt });

// Streaming
const stream = streamText({ model, prompt });
for await (const chunk of stream.fullStream) { ... }

// Embeddings
const { embedding } = await embed({ model, value });
```

## Important Constraints

### Architecture Constraints
- **Apache AGE Integration:** Keep AGE connections in `infra/graph-db` and load AGE on connect
- **pgvector Integration:** Keep pgvector connections in `infra/vector-db` with dedicated pool
- **Cache Strategy:** Use Redis for expensive graph query results
- **Data Consistency:** Maintain sync between relational Postgres and AGE/pgvector stores when applicable

### Performance Considerations
- Graph traversals can be expensive—use caching and query optimization
- Batch embedding generation for large document sets
- Implement pagination for large result sets

### Security
- LLM API keys stored in environment variables, never committed
- Validate all user inputs before graph queries (prevent injection)

## External Dependencies

### Infrastructure
- **PostgreSQL:** Primary relational data store (users, sessions, metadata)
- **Apache AGE:** Knowledge graph storage (Postgres extension)
- **pgvector:** Vector similarity search (Postgres extension)
- **Redis:** Caching and session management
- **RustFS / S3:** S3-compatible object storage for uploads/assets

### AI/LLM Providers
- **Vercel AI SDK:** Unified interface for multiple providers
- **Supported Providers:** OpenAI, Anthropic (via `@ai-sdk/*`)

## Future Modules (Planned)

### Graph Module (`modules/graph/`)
- CRUD operations for nodes and edges
- Graph query API (Cypher abstraction)
- Graph visualization data endpoints

### Documents Module (`modules/documents/`)
- Document ingestion pipeline
- Chunking and embedding generation
- Document-to-graph entity extraction

### Search Module (`modules/search/`)
- Hybrid search API (vector + graph)
- Query expansion with LLM
- Result ranking and re-ranking
