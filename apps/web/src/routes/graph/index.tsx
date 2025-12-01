import { createFileRoute } from "@tanstack/react-router";
import { isNotNil } from "es-toolkit";
import { useRef, useState } from "react";
import type { GraphCanvasHandle } from "@/components/graph/graph-canvas";
import { GraphCanvas } from "@/components/graph/graph-canvas";
import { GraphControls } from "@/components/graph/graph-controls";
import { NodeDetailPanel } from "@/components/graph/node-detail-panel";
import { mockGraphData } from "@/lib/mocks/graph-data";

export const Route = createFileRoute("/graph/")({
  component: Graph,
});

function Graph() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const graphCanvasRef = useRef<GraphCanvasHandle>(null);

  // Get the selected node object
  const selectedNode = selectedNodeId
    ? (mockGraphData.nodes.find((n) => n.id === selectedNodeId) ?? null)
    : null;

  const handleNodeSelect = (nodeId: string | null) => {
    setSelectedNodeId(nodeId);
  };

  const handleClosePanel = () => {
    setSelectedNodeId(null);
  };

  return (
    <div className="flex w-full h-screen bg-slate-50">
      {/* Main graph area */}
      <div className="flex-1 relative">
        <GraphCanvas
          data={mockGraphData}
          height={800}
          onNodeSelect={handleNodeSelect}
          ref={graphCanvasRef}
          width={1200}
        />

        {/* Floating zoom controls */}
        <div className="absolute top-4 right-4 z-10">
          <GraphControls
            onResetZoom={() => graphCanvasRef.current?.resetZoom()}
            onZoomIn={() => graphCanvasRef.current?.zoomIn()}
            onZoomOut={() => graphCanvasRef.current?.zoomOut()}
          />
        </div>
      </div>

      {/* Node detail panel (right sidebar) */}
      {isNotNil(selectedNode) && (
        <NodeDetailPanel
          graphData={mockGraphData}
          node={selectedNode}
          onClose={handleClosePanel}
        />
      )}
    </div>
  );
}
