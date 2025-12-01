# Graph Visualization Specification

## ADDED Requirements

### Requirement: Force-Directed Graph Layout

The system SHALL render knowledge graphs using a force-directed layout algorithm that automatically positions nodes to minimize edge crossings and maximize readability.

#### Scenario: Initial graph load

- **WHEN** user navigates to `/graph` route
- **THEN** the graph visualization renders with nodes arranged using D3.js force simulation
- **AND** nodes are positioned such that connected nodes are closer together
- **AND** simulation runs until the layout stabilizes (alpha < 0.01)

#### Scenario: Dynamic repositioning

- **WHEN** the force simulation is running
- **THEN** nodes SHALL animate smoothly to their calculated positions at 60fps
- **AND** the simulation SHALL gradually slow down (alpha decay) to conserve CPU
- **AND** the simulation SHALL stop automatically when layout is stable

### Requirement: Node Visualization

The system SHALL display graph nodes as visual elements with type-specific styling and labels.

#### Scenario: Node rendering with type differentiation

- **WHEN** graph data contains nodes of different types (person, document, concept, topic)
- **THEN** each node SHALL be rendered as a circle with a color corresponding to its type:
  - Person nodes: blue (#3b82f6)
  - Document nodes: green (#10b981)
  - Concept nodes: violet (#8b5cf6)
  - Topic nodes: amber (#f59e0b)
- **AND** each node SHALL display its label below the circle

#### Scenario: Node interactivity

- **WHEN** user hovers over a node
- **THEN** the node SHALL display a highlight effect (e.g., increased size, glow)
- **AND** a tooltip SHALL appear showing the node's label and type

#### Scenario: Node dragging

- **WHEN** user clicks and drags a node
- **THEN** the node SHALL follow the cursor position
- **AND** the force simulation SHALL adjust connected nodes accordingly
- **AND** releasing the node SHALL allow the simulation to resume natural positioning

### Requirement: Edge Visualization

The system SHALL display relationships between nodes as visual lines connecting them.

#### Scenario: Edge rendering

- **WHEN** graph data contains edges between nodes
- **THEN** each edge SHALL be rendered as a line connecting the source and target nodes
- **AND** the line SHALL update its position automatically as nodes move

#### Scenario: Edge styling by type

- **WHEN** edges have different relationship types (wrote, references, related_to, belongs_to)
- **THEN** edges SHALL have visual differentiation (e.g., line style, color, or arrow direction)

### Requirement: Zoom and Pan Controls

The system SHALL provide interactive zoom and pan capabilities for exploring large graphs.

#### Scenario: Mouse wheel zoom

- **WHEN** user scrolls the mouse wheel over the graph
- **THEN** the graph SHALL zoom in (scroll up) or zoom out (scroll down)
- **AND** the zoom SHALL be centered on the cursor position
- **AND** zoom level SHALL be constrained to a reasonable range (e.g., 0.1x to 10x)

#### Scenario: Pan by dragging

- **WHEN** user clicks and drags on empty space (not on a node)
- **THEN** the entire graph viewport SHALL pan in the direction of the drag
- **AND** node positions relative to each other SHALL remain unchanged

#### Scenario: UI zoom controls

- **WHEN** user interacts with the graph controls component
- **THEN** the following buttons SHALL be available:
  - Zoom In: Increase zoom level by a fixed step (e.g., 1.2x)
  - Zoom Out: Decrease zoom level by a fixed step (e.g., 0.8x)
  - Reset View: Return to default zoom (1x) and center on graph
- **AND** clicking these buttons SHALL smoothly animate to the new zoom level

### Requirement: Node Detail Display

The system SHALL provide a way to view detailed information about selected nodes.

#### Scenario: Node selection

- **WHEN** user clicks on a node
- **THEN** the node SHALL be marked as selected (visual indicator)
- **AND** a detail panel SHALL appear showing:
  - Node label
  - Node type
  - Node properties (all key-value pairs)
  - List of connected nodes (relationships)

#### Scenario: Deselection

- **WHEN** a node is selected and user clicks on empty space
- **THEN** the node SHALL be deselected
- **AND** the detail panel SHALL close or hide

### Requirement: Mock Data Support

The system SHALL use mock graph data for development and testing until backend API integration is implemented.

#### Scenario: Mock data structure

- **WHEN** the graph visualization component initializes
- **THEN** it SHALL load mock data from a typed data source (e.g., `lib/mocks/graph-data.ts`)
- **AND** the mock data SHALL match the expected API response shape:
  ```typescript
  {
    nodes: Array<{ id: string; type: string; label: string; properties: object }>,
    edges: Array<{ id: string; source: string; target: string; type: string; properties: object }>
  }
  ```

#### Scenario: Realistic example data

- **WHEN** mock data is provided
- **THEN** it SHALL include a realistic knowledge graph scenario, such as:
  - Academic authors, papers, and topics
  - Or: Concepts, documents, and their relationships
- **AND** the data SHALL have at least 20 nodes and 30 edges to demonstrate layout

### Requirement: Performance Optimization

The system SHALL maintain acceptable rendering performance for typical graph sizes (100-500 nodes).

#### Scenario: Smooth animation

- **WHEN** rendering a graph with up to 500 nodes
- **THEN** the force simulation SHALL maintain at least 30fps during animation
- **AND** React component re-renders SHALL be optimized with memoization

#### Scenario: Simulation throttling

- **WHEN** the force simulation updates node positions
- **THEN** React re-renders SHALL be throttled to maximum 60fps (every ~16ms)
- **AND** simulation SHALL stop when alpha < 0.01 to save CPU

### Requirement: Responsive Layout

The system SHALL adapt the graph visualization to different screen sizes.

#### Scenario: Container-based sizing

- **WHEN** the graph is rendered in a viewport of any size
- **THEN** the SVG canvas SHALL fill the available container dimensions
- **AND** the graph SHALL be centered initially within the viewport

#### Scenario: Window resize

- **WHEN** the browser window is resized
- **THEN** the graph canvas SHALL adjust its dimensions accordingly
- **AND** the current zoom and pan state SHALL be preserved

### Requirement: Component Reusability

The system SHALL provide modular, reusable components that can be composed for different graph views.

#### Scenario: Composable architecture

- **WHEN** implementing graph visualization
- **THEN** the following components SHALL be independently reusable:
  - `GraphCanvas`: Main container with simulation
  - `GraphNode`: Individual node rendering
  - `GraphEdge`: Individual edge rendering
  - `GraphControls`: Zoom/pan control UI
  - `NodeDetailPanel`: Node information display

#### Scenario: Hook-based logic

- **WHEN** implementing graph behavior
- **THEN** the following hooks SHALL encapsulate reusable logic:
  - `useForceSimulation`: D3 force simulation management
  - `useGraphZoom`: D3 zoom behavior setup
- **AND** these hooks SHALL be usable in other graph-related components
