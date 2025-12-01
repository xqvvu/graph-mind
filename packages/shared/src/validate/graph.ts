import { z } from "zod";

/**
 * Schema for a node in the knowledge graph.
 * Nodes represent entities like people, documents, concepts, or topics.
 */
export const GraphNodeSchema = z.object({
  /** Unique identifier for the node */
  id: z.string(),
  /** Type of entity this node represents */
  type: z.enum(["person", "document", "concept", "topic"]),
  /** Display label for the node */
  label: z.string(),
  /** Additional metadata properties */
  properties: z.record(z.string(), z.unknown()).default({}),
});

export type IGraphNode = z.infer<typeof GraphNodeSchema>;

/**
 * Schema for an edge (relationship) in the knowledge graph.
 * Edges connect two nodes and represent their relationship.
 */
export const GraphEdgeSchema = z.object({
  /** Unique identifier for the edge */
  id: z.string(),
  /** ID of the source node */
  source: z.string(),
  /** ID of the target node */
  target: z.string(),
  /** Type of relationship */
  type: z.enum(["wrote", "references", "related_to", "belongs_to"]),
  /** Additional metadata properties */
  properties: z.record(z.string(), z.unknown()).default({}),
});

export type IGraphEdge = z.infer<typeof GraphEdgeSchema>;

/**
 * Schema for complete graph data containing nodes and edges.
 */
export const GraphDataSchema = z.object({
  /** Array of nodes in the graph */
  nodes: z.array(GraphNodeSchema),
  /** Array of edges connecting nodes */
  edges: z.array(GraphEdgeSchema),
});

export type IGraphData = z.infer<typeof GraphDataSchema>;
