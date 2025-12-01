import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/graph/$id")({
  component: Graph,
});

function Graph() {
  const { id } = Route.useParams();

  // TODO: Load specific graph by ID when backend API is ready
  // For now, this route is a placeholder
  return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Graph: {id}
        </h1>
        <p className="text-slate-600">
          This route will load a specific graph by ID when the backend API is
          implemented.
        </p>
      </div>
    </div>
  );
}
