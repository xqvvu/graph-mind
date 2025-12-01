import type { IGraphNode } from "@graph-mind/shared/validate/graph";
import React, { useState } from "react";
import type { SimulationNode } from "@/components/graph/use-force-simulation";

interface GraphNodeProps {
  node: SimulationNode;
  isSelected: boolean;
  onSelect: (nodeId: string) => void;
  onDragStart: (nodeId: string, x: number, y: number) => void;
  onDrag: (nodeId: string, x: number, y: number) => void;
  onDragEnd: (nodeId: string) => void;
}

/**
 * Node color palette based on node type.
 * Colors are from Tailwind CSS color scale.
 */
const NODE_COLORS: Record<IGraphNode["type"], string> = {
  person: "#3b82f6", // blue-500
  document: "#10b981", // green-500
  concept: "#8b5cf6", // violet-500
  topic: "#f59e0b", // amber-500
};

/**
 * Renders a single node in the graph visualization.
 *
 * Nodes are rendered as circles with:
 * - Type-specific colors
 * - Labels below the circle
 * - Hover effects
 * - Selection state
 * - Drag interactions
 */
function GraphNodeComponent({
  node,
  isSelected,
  onSelect,
  onDragStart,
  onDrag,
  onDragEnd,
}: GraphNodeProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Guard: only render if node has position
  if (node.x === undefined || node.y === undefined) {
    return null;
  }

  const baseRadius = 10;
  const radius = isSelected
    ? baseRadius + 4
    : isHovered
      ? baseRadius + 2
      : baseRadius;
  const color = NODE_COLORS[node.type];

  const handleMouseDown = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDragging(true);
    onDragStart(node.id, event.clientX, event.clientY);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDragging) {
      onDrag(node.id, event.clientX, event.clientY);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onDragEnd(node.id);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (isDragging) {
      setIsDragging(false);
      onDragEnd(node.id);
    }
  };

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onSelect(node.id);
  };

  return (
    <g
      aria-label={`${node.label} (${node.type})`}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(node.id);
        }
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      role="button"
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
      tabIndex={0}
      transform={`translate(${node.x}, ${node.y})`}
    >
      {/* Node circle */}
      <circle
        fill={color}
        opacity={isHovered || isSelected ? 1 : 0.9}
        r={radius}
        stroke={isSelected ? "#ffffff" : color}
        strokeWidth={isSelected ? 3 : 0}
      >
        <title>{`${node.label} (${node.type})`}</title>
      </circle>

      {/* Node label */}
      <text
        fill="#1f2937"
        fontSize="12"
        fontWeight={isSelected ? "600" : "400"}
        pointerEvents="none"
        textAnchor="middle"
        y={radius + 15}
      >
        {node.label}
      </text>

      {/* Selection ring (visual indicator) */}
      {isSelected && (
        <circle
          fill="none"
          opacity={0.4}
          pointerEvents="none"
          r={radius + 8}
          stroke="#3b82f6"
          strokeWidth={2}
        />
      )}
    </g>
  );
}

export const GraphNode = React.memo(GraphNodeComponent);
