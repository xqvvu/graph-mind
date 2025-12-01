# Change: Implement Graph Visualization Components

## Why

Currently, the application has placeholder routes for graph visualization (`/graph` and `/graph/$id`) but lacks the actual visualization capability. Users need an intuitive, interactive way to visualize and explore knowledge graphs. Starting with the frontend visualization provides a concrete, visual understanding of what knowledge graphs are before building complex backend infrastructure.

This change enables users to:
- See knowledge graph structure visually (nodes and relationships)
- Interact with graph data (zoom, pan, drag nodes, hover for details)
- Understand knowledge graph concepts through direct manipulation

## What Changes

- **Add D3.js dependencies** for force-directed graph layout and rendering
- **Create reusable graph visualization components** in `apps/web/src/components/graph/`
  - Force-directed layout canvas component
  - Interactive controls (zoom, pan, reset view)
  - Node detail panel/tooltip
  - Custom hooks for D3 simulation management
- **Implement mock data layer** with realistic graph data for development
- **Update existing graph routes** to use new visualization components
- **Add graph data types and schemas** in shared package

No breaking changes.

## Impact

- **Affected specs**: `graph-visualization` (new capability)
- **Affected code**:
  - `apps/web/src/routes/graph/` - Update placeholder routes
  - `apps/web/src/components/graph/` - New visualization components
  - `apps/web/package.json` - Add D3.js dependencies (`d3`, `@types/d3`)
  - `packages/shared/validate/` - Add graph data schemas (optional for mock data)
- **User-facing changes**: Users can now view and interact with knowledge graphs in the browser
- **Dependencies added**: `d3` (^7.9.0), `@types/d3` (^7.4.3)
