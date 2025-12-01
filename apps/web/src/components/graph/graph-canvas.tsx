import type { IGraphData } from "@graph-mind/shared/validate/graph";
import type { RefObject } from "react";
import { useImperativeHandle, useRef, useState } from "react";
import { GraphEdge } from "@/components/graph/graph-edge";
import { GraphNode } from "@/components/graph/graph-node";
import { useForceSimulation } from "@/components/graph/use-force-simulation";
import { useGraphZoom } from "@/components/graph/use-graph-zoom";

interface GraphCanvasProps {
  data: IGraphData;
  width?: number;
  height?: number;
  onNodeSelect?: (nodeId: string | null) => void;
  ref?: RefObject<GraphCanvasHandle | null>;
}

/**
 * Zoom control methods exposed through the component ref
 */
export interface GraphCanvasHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

/**
 * Main graph visualization canvas component.
 *
 * This component:
 * - Renders the complete graph using force-directed layout
 * - Manages zoom and pan interactions
 * - Handles node selection and drag events
 * - Coordinates between D3 simulation and React rendering
 */
export const GraphCanvas = ({
  data,
  width = 1200,
  height = 800,
  onNodeSelect,
  ref,
}: GraphCanvasProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<{
    nodeId: string;
    startX: number;
    startY: number;
  } | null>(null);

  // Initialize force simulation
  const { nodes, edges, updateNodePosition } = useForceSimulation(
    data,
    width,
    height,
  );

  // Initialize zoom behavior
  const { transform, zoomIn, zoomOut, resetZoom } = useGraphZoom(
    svgRef,
    width,
    height,
  );

  // Expose zoom controls through ref
  useImperativeHandle(ref, () => ({
    zoomIn,
    zoomOut,
    resetZoom,
  }));

  // Node selection handler
  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    onNodeSelect?.(nodeId);
  };

  // Canvas click handler (deselect node)
  const handleCanvasClick = () => {
    setSelectedNodeId(null);
    onNodeSelect?.(null);
  };

  // Drag event handlers
  const handleDragStart = (
    nodeId: string,
    clientX: number,
    clientY: number,
  ) => {
    setDragState({ nodeId, startX: clientX, startY: clientY });
  };

  const handleDrag = (nodeId: string, clientX: number, clientY: number) => {
    if (!dragState || !svgRef.current) return;

    // Convert client coordinates to SVG coordinates accounting for zoom/pan
    const svg = svgRef.current;
    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;

    const ctm = svg.getScreenCTM();
    if (ctm) {
      const svgPoint = point.matrixTransform(ctm.inverse());
      updateNodePosition(nodeId, svgPoint.x, svgPoint.y, false);
    }
  };

  const handleDragEnd = (nodeId: string) => {
    setDragState(null);
    // Release node from fixed position after drag
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      node.fx = undefined;
      node.fy = undefined;
    }
  };

  // Create a map for quick node lookup by ID
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  return (
    <div className="relative w-full h-full">
      <svg
        aria-label="Knowledge graph visualization"
        className="border border-slate-200 rounded-lg bg-white"
        height={height}
        onClick={handleCanvasClick}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            handleCanvasClick();
          }
        }}
        ref={svgRef}
        role="img"
        width={width}
      >
        <title>Interactive knowledge graph with nodes and relationships</title>
        {/* Zoom/pan transform group */}
        <g
          transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}
        >
          {/* Render edges first (behind nodes) */}
          <g className="edges">
            {edges.map((edge) => {
              const sourceNode = nodeMap.get(
                typeof edge.source === "string" ? edge.source : edge.source.id,
              );
              const targetNode = nodeMap.get(
                typeof edge.target === "string" ? edge.target : edge.target.id,
              );

              if (!sourceNode || !targetNode) return null;

              return (
                <GraphEdge
                  edge={{
                    id: edge.id,
                    source:
                      typeof edge.source === "string"
                        ? edge.source
                        : edge.source.id,
                    target:
                      typeof edge.target === "string"
                        ? edge.target
                        : edge.target.id,
                    type: edge.type,
                    properties: edge.properties,
                  }}
                  key={edge.id}
                  sourceNode={sourceNode}
                  targetNode={targetNode}
                />
              );
            })}
          </g>

          {/* Render nodes */}
          <g className="nodes">
            {nodes.map((node) => (
              <GraphNode
                isSelected={node.id === selectedNodeId}
                key={node.id}
                node={node}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
                onSelect={handleNodeSelect}
              />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
};

GraphCanvas.displayName = "GraphCanvas";
