import type { IGraphEdge } from "@graph-mind/shared/validate/graph";
import React from "react";
import type { SimulationNode } from "@/components/graph/use-force-simulation";

interface GraphEdgeProps {
  edge: IGraphEdge;
  sourceNode: SimulationNode;
  targetNode: SimulationNode;
}

/**
 * Renders a single edge (relationship) between two nodes in the graph.
 *
 * Edges are rendered as SVG lines connecting source and target nodes.
 * The line style varies based on the relationship type.
 */
function GraphEdgeComponent({ edge, sourceNode, targetNode }: GraphEdgeProps) {
  // Edge styling based on relationship type
  const getEdgeStyle = (type: IGraphEdge["type"]) => {
    switch (type) {
      case "wrote":
        return { stroke: "#94a3b8", strokeWidth: 2, strokeDasharray: "none" }; // slate-400, solid
      case "references":
        return { stroke: "#cbd5e1", strokeWidth: 1.5, strokeDasharray: "4,2" }; // slate-300, dashed
      case "related_to":
        return { stroke: "#e2e8f0", strokeWidth: 1, strokeDasharray: "none" }; // slate-200, thin solid
      case "belongs_to":
        return { stroke: "#94a3b8", strokeWidth: 1.5, strokeDasharray: "2,2" }; // slate-400, dotted
      default:
        return { stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "none" };
    }
  };

  const style = getEdgeStyle(edge.type);

  // Guard: only render if both nodes have positions
  if (
    sourceNode.x === undefined ||
    sourceNode.y === undefined ||
    targetNode.x === undefined ||
    targetNode.y === undefined
  ) {
    return null;
  }

  return (
    <line
      opacity={0.6}
      stroke={style.stroke}
      strokeDasharray={style.strokeDasharray}
      strokeWidth={style.strokeWidth}
      x1={sourceNode.x}
      x2={targetNode.x}
      y1={sourceNode.y}
      y2={targetNode.y}
    >
      <title>{`${edge.type}: ${sourceNode.label} → ${targetNode.label}`}</title>
    </line>
  );
}

export const GraphEdge = React.memo(GraphEdgeComponent);
