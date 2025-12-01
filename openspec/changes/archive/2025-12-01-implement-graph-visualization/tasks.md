# Implementation Tasks

## 1. Setup Dependencies

- [x] 1.1 Add `d3` dependency to `apps/web/package.json` (version ^7.9.0)
- [x] 1.2 Add `@types/d3` dev dependency to `apps/web/package.json` (version ^7.4.3)
- [x] 1.3 Run `pnpm install` to install new dependencies
- [x] 1.4 Verify D3 imports work with a simple test import

## 2. Define Data Types and Mock Data

- [x] 2.1 Create `packages/shared/validate/graph.ts` with Zod schemas for:
  - `GraphNodeSchema` (id, type, label, properties)
  - `GraphEdgeSchema` (id, source, target, type, properties)
  - `GraphDataSchema` (nodes array, edges array)
- [x] 2.2 Export TypeScript types from schemas (`IGraphNode`, `IGraphEdge`, `IGraphData`)
- [x] 2.3 Create `apps/web/src/lib/mocks/graph-data.ts` with realistic mock data
  - At least 20-30 nodes of mixed types (person, document, concept, topic)
  - At least 30-40 edges with various relationship types
  - Include comments explaining the scenario (e.g., "Academic knowledge graph")
- [x] 2.4 Validate mock data against Zod schemas in the mock file

## 3. Create Core Hooks

- [x] 3.1 Create `apps/web/src/components/graph/use-force-simulation.ts`
  - Accept graph data as input (nodes, edges)
  - Initialize D3 force simulation with appropriate forces:
    - `forceLink()` for edges
    - `forceManyBody()` for repulsion
    - `forceCenter()` for centering
    - `forceCollide()` to prevent overlap
  - Update node positions on each tick
  - Return: current nodes with positions, simulation control functions
- [x] 3.2 Create `apps/web/src/components/graph/use-graph-zoom.ts`
  - Accept SVG ref as input
  - Setup D3 zoom behavior with scale limits (0.1 to 10)
  - Handle zoom events and update transform state
  - Provide functions: `zoomIn()`, `zoomOut()`, `resetZoom()`
  - Return: current transform, zoom control functions

## 4. Build Visualization Components

- [x] 4.1 Create `apps/web/src/components/graph/graph-edge.tsx`
  - Props: source node, target node, edge type, properties
  - Render SVG `<line>` element connecting source to target
  - Apply styling based on edge type (color or stroke style)
  - Use `React.memo` for performance optimization
- [x] 4.2 Create `apps/web/src/components/graph/graph-node.tsx`
  - Props: node data (id, type, label, x, y, properties), event handlers
  - Render SVG `<g>` containing:
    - `<circle>` with type-based color
    - `<text>` for label
  - Support hover state (highlight effect)
  - Support selection state (visual indicator)
  - Handle drag events (onMouseDown, onMouseMove, onMouseUp)
  - Use `React.memo` for performance optimization
- [x] 4.3 Create `apps/web/src/components/graph/graph-canvas.tsx`
  - Use `useForceSimulation` hook with mock data
  - Use `useGraphZoom` hook with SVG ref
  - Render SVG container with proper dimensions (width, height from parent)
  - Render all edges using `GraphEdge` component
  - Render all nodes using `GraphNode` component
  - Handle node click for selection
  - Handle canvas click for deselection
  - Handle node drag to update simulation
  - Export `GraphCanvas` as main component

## 5. Build UI Controls

- [x] 5.1 Create `apps/web/src/components/graph/graph-controls.tsx`
  - Accept zoom control functions as props (zoomIn, zoomOut, resetZoom)
  - Render control panel with buttons:
    - Zoom In button (with lucide-react `ZoomIn` icon)
    - Zoom Out button (with lucide-react `ZoomOut` icon)
    - Reset View button (with lucide-react `Maximize` icon)
  - Style with Tailwind CSS matching app design system
  - Position as floating controls (e.g., top-right or bottom-right)
- [x] 5.2 Create `apps/web/src/components/graph/node-detail-panel.tsx`
  - Props: selected node data (or null if none selected)
  - Render side panel (or modal) displaying:
    - Node label as heading
    - Node type as badge
    - Properties as key-value list
    - Connected nodes/edges section (list relationship types)
  - Conditional rendering: only show when node is selected
  - Include close button to deselect
  - Style with Tailwind CSS and shadcn/ui primitives if needed

## 6. Integrate into Routes

- [x] 6.1 Update `apps/web/src/routes/graph/index.tsx`
  - Import `GraphCanvas`, `GraphControls`, `NodeDetailPanel`
  - Replace placeholder "Hello" div with graph components
  - Setup layout: main canvas area + controls + detail panel
  - Manage selected node state
  - Pass zoom controls to `GraphControls`
  - Pass selected node to `NodeDetailPanel`
- [x] 6.2 Update `apps/web/src/routes/graph/$id.tsx` (optional for this change)
  - Can keep as placeholder for now
  - Add TODO comment: "Load specific graph by ID when backend ready"

## 7. Styling and Polish

- [x] 7.1 Add global styles for graph visualization in appropriate CSS/Tailwind config
  - SVG cursor styles (grab, grabbing, pointer)
  - Transition/animation timing
- [x] 7.2 Add node tooltips on hover using native `<title>` SVG element or custom tooltip component
- [x] 7.3 Ensure responsive layout: graph canvas fills parent container
- [x] 7.4 Add loading state skeleton (for future async data loading)

## 8. Testing and Validation

- [x] 8.1 Manual testing: Navigate to `/graph` and verify:
  - Graph renders with mock data
  - Force layout positions nodes correctly
  - Nodes are draggable
  - Zoom in/out works (mouse wheel + buttons)
  - Pan works (drag empty space)
  - Node selection shows detail panel
  - All node types have correct colors
- [x] 8.2 Write unit tests for hooks (optional but recommended):
  - `use-force-simulation.ts` - test simulation initialization
  - `use-graph-zoom.ts` - test zoom control functions
- [x] 8.3 Write component tests (optional but recommended):
  - `graph-node.tsx` - test rendering with different props
  - `graph-edge.tsx` - test line positioning
- [x] 8.4 Performance testing: Load graph with 100+ nodes and verify smooth rendering

## 9. Documentation

- [x] 9.1 Add JSDoc comments to all exported functions and components
- [x] 9.2 Add inline code comments explaining D3 force configuration choices
- [x] 9.3 Update project README (if needed) with screenshot or description of graph feature
- [x] 9.4 Add developer notes in code about future improvements (e.g., "TODO: Add Canvas renderer for large graphs")

## Notes

- **Dependencies**: Task 2 must complete before Task 3 and 4 (types needed)
- **Parallel work**: Tasks 3, 4, 5 can be done in parallel after Task 2
- **Validation**: Test each component in isolation before integration (Task 6)
- **Incremental delivery**: After Task 6, the feature is minimally functional
- **Polish**: Tasks 7-9 can be done incrementally or in parallel
