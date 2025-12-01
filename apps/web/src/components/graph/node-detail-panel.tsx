import type { IGraphData, IGraphNode } from "@graph-mind/shared/validate/graph";
import { Separator } from "@radix-ui/react-separator";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NodeDetailPanelProps {
  node: IGraphNode | null;
  graphData: IGraphData;
  onClose: () => void;
}

/**
 * Side panel displaying detailed information about a selected node.
 *
 * Shows:
 * - Node label and type
 * - Node properties
 * - Connected nodes and their relationships
 */
export function NodeDetailPanel({
  node,
  graphData,
  onClose,
}: NodeDetailPanelProps) {
  if (!node) return null;

  // Find all edges connected to this node
  const connectedEdges = graphData.edges.filter(
    (edge) => edge.source === node.id || edge.target === node.id,
  );

  // Group connections by relationship type
  const incomingConnections = connectedEdges.filter(
    (edge) => edge.target === node.id,
  );
  const outgoingConnections = connectedEdges.filter(
    (edge) => edge.source === node.id,
  );

  // Get node labels for connections
  const getNodeLabel = (nodeId: string) => {
    return graphData.nodes.find((n) => n.id === nodeId)?.label ?? nodeId;
  };

  // Node type badge color
  const getTypeBadgeColor = (type: IGraphNode["type"]) => {
    switch (type) {
      case "person":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "document":
        return "bg-green-100 text-green-700 border-green-200";
      case "concept":
        return "bg-violet-100 text-violet-700 border-violet-200";
      case "topic":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="w-80 bg-white border-l border-slate-200 p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900">{node.label}</h3>
          <span
            className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-md border ${getTypeBadgeColor(node.type)}`}
          >
            {node.type}
          </span>
        </div>
        <Button
          className="shrink-0"
          onClick={onClose}
          size="icon"
          type="button"
          variant="ghost"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Separator className="my-4" />

      {/* Properties */}
      {Object.keys(node.properties).length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">
            Properties
          </h4>
          <div className="space-y-2">
            {Object.entries(node.properties).map(([key, value]) => (
              <div
                className="flex justify-between text-sm"
                key={key}
              >
                <span className="text-slate-600 font-medium">{key}:</span>
                <span className="text-slate-900">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator className="my-4" />

      {/* Connections */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-3">
          Connections
        </h4>

        {/* Outgoing connections */}
        {outgoingConnections.length > 0 && (
          <div className="mb-4">
            <h5 className="text-xs font-medium text-slate-500 uppercase mb-2">
              Outgoing
            </h5>
            <ul className="space-y-2">
              {outgoingConnections.map((edge) => (
                <li
                  className="text-sm"
                  key={edge.id}
                >
                  <span className="text-slate-600">{edge.type}</span>
                  <span className="text-slate-400 mx-1">→</span>
                  <span className="text-slate-900 font-medium">
                    {getNodeLabel(edge.target)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Incoming connections */}
        {incomingConnections.length > 0 && (
          <div>
            <h5 className="text-xs font-medium text-slate-500 uppercase mb-2">
              Incoming
            </h5>
            <ul className="space-y-2">
              {incomingConnections.map((edge) => (
                <li
                  className="text-sm"
                  key={edge.id}
                >
                  <span className="text-slate-900 font-medium">
                    {getNodeLabel(edge.source)}
                  </span>
                  <span className="text-slate-400 mx-1">→</span>
                  <span className="text-slate-600">{edge.type}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {connectedEdges.length === 0 && (
          <p className="text-sm text-slate-500 italic">No connections</p>
        )}
      </div>
    </div>
  );
}
