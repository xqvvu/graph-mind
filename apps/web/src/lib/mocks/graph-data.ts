import type { IGraphData } from "@graph-mind/shared/validate/graph";
import { GraphDataSchema } from "@graph-mind/shared/validate/graph";

/**
 * Mock knowledge graph data for development and testing.
 *
 * This represents an academic knowledge graph scenario with:
 * - Researchers (person nodes)
 * - Research papers (document nodes)
 * - Academic concepts (concept nodes)
 * - Research topics (topic nodes)
 * - Various relationships between them
 */
export const mockGraphData: IGraphData = {
  nodes: [
    // Researchers (person nodes)
    {
      id: "person-1",
      type: "person",
      label: "Dr. Alice Zhang",
      properties: {
        affiliation: "MIT",
        field: "Machine Learning",
      },
    },
    {
      id: "person-2",
      type: "person",
      label: "Prof. Bob Chen",
      properties: {
        affiliation: "Stanford",
        field: "Computer Vision",
      },
    },
    {
      id: "person-3",
      type: "person",
      label: "Dr. Carol Liu",
      properties: {
        affiliation: "Berkeley",
        field: "Natural Language Processing",
      },
    },
    {
      id: "person-4",
      type: "person",
      label: "Dr. David Wang",
      properties: {
        affiliation: "CMU",
        field: "Robotics",
      },
    },
    {
      id: "person-5",
      type: "person",
      label: "Prof. Eva Martinez",
      properties: {
        affiliation: "Oxford",
        field: "Knowledge Graphs",
      },
    },

    // Research papers (document nodes)
    {
      id: "doc-1",
      type: "document",
      label: "Deep Learning Fundamentals",
      properties: {
        year: 2022,
        citations: 245,
      },
    },
    {
      id: "doc-2",
      type: "document",
      label: "Attention Mechanisms in Transformers",
      properties: {
        year: 2023,
        citations: 189,
      },
    },
    {
      id: "doc-3",
      type: "document",
      label: "Graph Neural Networks: A Survey",
      properties: {
        year: 2023,
        citations: 312,
      },
    },
    {
      id: "doc-4",
      type: "document",
      label: "Computer Vision for Robotics",
      properties: {
        year: 2022,
        citations: 156,
      },
    },
    {
      id: "doc-5",
      type: "document",
      label: "Knowledge Graph Embeddings",
      properties: {
        year: 2024,
        citations: 87,
      },
    },
    {
      id: "doc-6",
      type: "document",
      label: "NLP in Low-Resource Languages",
      properties: {
        year: 2023,
        citations: 134,
      },
    },
    {
      id: "doc-7",
      type: "document",
      label: "Vision-Language Models",
      properties: {
        year: 2024,
        citations: 203,
      },
    },
    {
      id: "doc-8",
      type: "document",
      label: "Semantic Search Systems",
      properties: {
        year: 2023,
        citations: 178,
      },
    },

    // Academic concepts (concept nodes)
    {
      id: "concept-1",
      type: "concept",
      label: "Neural Networks",
      properties: {
        category: "Machine Learning",
      },
    },
    {
      id: "concept-2",
      type: "concept",
      label: "Transformer Architecture",
      properties: {
        category: "Deep Learning",
      },
    },
    {
      id: "concept-3",
      type: "concept",
      label: "Graph Theory",
      properties: {
        category: "Mathematics",
      },
    },
    {
      id: "concept-4",
      type: "concept",
      label: "Computer Vision",
      properties: {
        category: "Artificial Intelligence",
      },
    },
    {
      id: "concept-5",
      type: "concept",
      label: "Natural Language Processing",
      properties: {
        category: "Artificial Intelligence",
      },
    },
    {
      id: "concept-6",
      type: "concept",
      label: "Knowledge Representation",
      properties: {
        category: "Artificial Intelligence",
      },
    },
    {
      id: "concept-7",
      type: "concept",
      label: "Semantic Web",
      properties: {
        category: "Web Technologies",
      },
    },

    // Research topics (topic nodes)
    {
      id: "topic-1",
      type: "topic",
      label: "Machine Learning",
      properties: {
        popularity: "high",
      },
    },
    {
      id: "topic-2",
      type: "topic",
      label: "Artificial Intelligence",
      properties: {
        popularity: "high",
      },
    },
    {
      id: "topic-3",
      type: "topic",
      label: "Robotics",
      properties: {
        popularity: "medium",
      },
    },
    {
      id: "topic-4",
      type: "topic",
      label: "Information Retrieval",
      properties: {
        popularity: "medium",
      },
    },
  ],

  edges: [
    // Author relationships (person -wrote-> document)
    {
      id: "edge-1",
      source: "person-1",
      target: "doc-1",
      type: "wrote",
      properties: {},
    },
    {
      id: "edge-2",
      source: "person-1",
      target: "doc-2",
      type: "wrote",
      properties: {},
    },
    {
      id: "edge-3",
      source: "person-2",
      target: "doc-4",
      type: "wrote",
      properties: {},
    },
    {
      id: "edge-4",
      source: "person-2",
      target: "doc-7",
      type: "wrote",
      properties: {},
    },
    {
      id: "edge-5",
      source: "person-3",
      target: "doc-6",
      type: "wrote",
      properties: {},
    },
    {
      id: "edge-6",
      source: "person-4",
      target: "doc-4",
      type: "wrote",
      properties: { role: "co-author" },
    },
    {
      id: "edge-7",
      source: "person-5",
      target: "doc-3",
      type: "wrote",
      properties: {},
    },
    {
      id: "edge-8",
      source: "person-5",
      target: "doc-5",
      type: "wrote",
      properties: {},
    },

    // Citation relationships (document -references-> document)
    {
      id: "edge-9",
      source: "doc-2",
      target: "doc-1",
      type: "references",
      properties: {},
    },
    {
      id: "edge-10",
      source: "doc-3",
      target: "doc-1",
      type: "references",
      properties: {},
    },
    {
      id: "edge-11",
      source: "doc-5",
      target: "doc-3",
      type: "references",
      properties: {},
    },
    {
      id: "edge-12",
      source: "doc-7",
      target: "doc-2",
      type: "references",
      properties: {},
    },
    {
      id: "edge-13",
      source: "doc-7",
      target: "doc-4",
      type: "references",
      properties: {},
    },
    {
      id: "edge-14",
      source: "doc-8",
      target: "doc-5",
      type: "references",
      properties: {},
    },

    // Concept relationships (document -related_to-> concept)
    {
      id: "edge-15",
      source: "doc-1",
      target: "concept-1",
      type: "related_to",
      properties: {},
    },
    {
      id: "edge-16",
      source: "doc-2",
      target: "concept-2",
      type: "related_to",
      properties: {},
    },
    {
      id: "edge-17",
      source: "doc-3",
      target: "concept-3",
      type: "related_to",
      properties: {},
    },
    {
      id: "edge-18",
      source: "doc-3",
      target: "concept-1",
      type: "related_to",
      properties: {},
    },
    {
      id: "edge-19",
      source: "doc-4",
      target: "concept-4",
      type: "related_to",
      properties: {},
    },
    {
      id: "edge-20",
      source: "doc-5",
      target: "concept-6",
      type: "related_to",
      properties: {},
    },
    {
      id: "edge-21",
      source: "doc-5",
      target: "concept-7",
      type: "related_to",
      properties: {},
    },
    {
      id: "edge-22",
      source: "doc-6",
      target: "concept-5",
      type: "related_to",
      properties: {},
    },
    {
      id: "edge-23",
      source: "doc-7",
      target: "concept-4",
      type: "related_to",
      properties: {},
    },
    {
      id: "edge-24",
      source: "doc-7",
      target: "concept-5",
      type: "related_to",
      properties: {},
    },
    {
      id: "edge-25",
      source: "doc-8",
      target: "concept-6",
      type: "related_to",
      properties: {},
    },

    // Topic relationships (concept -belongs_to-> topic)
    {
      id: "edge-26",
      source: "concept-1",
      target: "topic-1",
      type: "belongs_to",
      properties: {},
    },
    {
      id: "edge-27",
      source: "concept-2",
      target: "topic-1",
      type: "belongs_to",
      properties: {},
    },
    {
      id: "edge-28",
      source: "concept-4",
      target: "topic-2",
      type: "belongs_to",
      properties: {},
    },
    {
      id: "edge-29",
      source: "concept-5",
      target: "topic-2",
      type: "belongs_to",
      properties: {},
    },
    {
      id: "edge-30",
      source: "concept-6",
      target: "topic-2",
      type: "belongs_to",
      properties: {},
    },
    {
      id: "edge-31",
      source: "concept-7",
      target: "topic-4",
      type: "belongs_to",
      properties: {},
    },

    // Cross-domain relationships
    {
      id: "edge-32",
      source: "concept-4",
      target: "topic-3",
      type: "belongs_to",
      properties: {},
    },
    {
      id: "edge-33",
      source: "doc-4",
      target: "topic-3",
      type: "belongs_to",
      properties: {},
    },
    {
      id: "edge-34",
      source: "person-1",
      target: "topic-1",
      type: "belongs_to",
      properties: { expertise: "high" },
    },
    {
      id: "edge-35",
      source: "person-2",
      target: "topic-2",
      type: "belongs_to",
      properties: { expertise: "high" },
    },
    {
      id: "edge-36",
      source: "person-3",
      target: "topic-2",
      type: "belongs_to",
      properties: { expertise: "medium" },
    },
    {
      id: "edge-37",
      source: "person-5",
      target: "topic-4",
      type: "belongs_to",
      properties: { expertise: "high" },
    },

    // Additional conceptual connections
    {
      id: "edge-38",
      source: "concept-2",
      target: "concept-1",
      type: "related_to",
      properties: {},
    },
    {
      id: "edge-39",
      source: "concept-6",
      target: "concept-3",
      type: "related_to",
      properties: {},
    },
    {
      id: "edge-40",
      source: "concept-7",
      target: "concept-6",
      type: "related_to",
      properties: {},
    },
  ],
};

// Validate mock data at runtime (will throw if invalid)
GraphDataSchema.parse(mockGraphData);
