import { Maximize, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GraphControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

/**
 * Floating control panel for graph zoom and pan operations.
 *
 * Provides three buttons:
 * - Zoom In: Increase zoom level
 * - Zoom Out: Decrease zoom level
 * - Reset View: Return to default zoom and center
 */
export function GraphControls({
  onZoomIn,
  onZoomOut,
  onResetZoom,
}: GraphControlsProps) {
  return (
    <div className="flex flex-col gap-2 p-2 bg-white border border-slate-200 rounded-lg shadow-md">
      <Button
        className="w-10 h-10"
        onClick={onZoomIn}
        size="icon"
        title="Zoom In"
        type="button"
        variant="outline"
      >
        <ZoomIn className="w-4 h-4" />
      </Button>

      <Button
        className="w-10 h-10"
        onClick={onZoomOut}
        size="icon"
        title="Zoom Out"
        type="button"
        variant="outline"
      >
        <ZoomOut className="w-4 h-4" />
      </Button>

      <Button
        className="w-10 h-10"
        onClick={onResetZoom}
        size="icon"
        title="Reset View"
        type="button"
        variant="outline"
      >
        <Maximize className="w-4 h-4" />
      </Button>
    </div>
  );
}
