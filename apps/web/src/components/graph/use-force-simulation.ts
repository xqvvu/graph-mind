import type {
  IGraphData,
  IGraphEdge,
  IGraphNode,
} from "@graph-mind/shared/validate/graph";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

/**
 * Node type extended with D3 force simulation properties.
 * D3 adds x, y, vx, vy, fx, fy properties during simulation.
 */
export interface SimulationNode extends IGraphNode {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

/**
 * Edge type compatible with D3 force simulation.
 * D3 expects source and target to be either node objects or IDs.
 */
export interface SimulationEdge extends Omit<IGraphEdge, "source" | "target"> {
  source: string | SimulationNode;
  target: string | SimulationNode;
}

/**
 * Custom hook for managing D3 force-directed graph simulation.
 *
 * This hook:
 * - Initializes a D3 force simulation with appropriate forces
 * - Updates node positions on each simulation tick
 * - Provides control functions to manipulate the simulation
 *
 * @param graphData - The graph data containing nodes and edges
 * @param width - Canvas width for centering the graph
 * @param height - Canvas height for centering the graph
 * @returns Object containing nodes with positions and simulation controls
 */
export function useForceSimulation(
  graphData: IGraphData,
  width: number,
  height: number,
) {
  const [nodes, setNodes] = useState<SimulationNode[]>([]);
  const [edges, setEdges] = useState<SimulationEdge[]>([]);
  const simulationRef = useRef<d3.Simulation<
    SimulationNode,
    SimulationEdge
  > | null>(null);

  useEffect(() => {
    // Create copies of data to avoid mutating props
    const nodesCopy: SimulationNode[] = graphData.nodes.map((node) => ({
      ...node,
    }));
    const edgesCopy: SimulationEdge[] = graphData.edges.map((edge) => ({
      ...edge,
    }));

    setNodes(nodesCopy);
    setEdges(edgesCopy);

    // Initialize D3 force simulation
    const simulation = d3
      .forceSimulation<SimulationNode>(nodesCopy)
      // Link force: pulls connected nodes together
      .force(
        "link",
        d3
          .forceLink<SimulationNode, SimulationEdge>(edgesCopy)
          .id((d) => d.id)
          .distance(100), // Desired distance between connected nodes
      )
      // Charge force: nodes repel each other (negative value = repulsion)
      .force("charge", d3.forceManyBody().strength(-300))
      // Center force: pulls nodes toward the center of the canvas
      .force("center", d3.forceCenter(width / 2, height / 2))
      // Collision force: prevents nodes from overlapping
      .force("collide", d3.forceCollide().radius(30))
      // On each tick, update node positions in React state
      .on("tick", () => {
        setNodes([...nodesCopy]);
        setEdges([...edgesCopy]);
      });

    simulationRef.current = simulation;

    // Cleanup: stop simulation when component unmounts
    return () => {
      simulation.stop();
    };
  }, [graphData, width, height]);

  /**
   * Restart the simulation with a specific alpha value.
   * Higher alpha = more initial energy.
   */
  const restartSimulation = (alpha = 0.3) => {
    simulationRef.current?.alpha(alpha).restart();
  };

  /**
   * Stop the simulation completely.
   */
  const stopSimulation = () => {
    simulationRef.current?.stop();
  };

  /**
   * Update a specific node's position and optionally fix it in place.
   * Useful for drag interactions.
   */
  const updateNodePosition = (
    nodeId: string,
    x: number,
    y: number,
    fixed = false,
  ) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      node.x = x;
      node.y = y;
      if (fixed) {
        // Fix node in place by setting fx, fy
        node.fx = x;
        node.fy = y;
      } else {
        // Release fixed position
        node.fx = undefined;
        node.fy = undefined;
      }
      restartSimulation(0.1);
    }
  };

  return {
    nodes,
    edges,
    restartSimulation,
    stopSimulation,
    updateNodePosition,
  };
}
