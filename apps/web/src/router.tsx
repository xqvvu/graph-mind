import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import * as TanStackQueryProvider from "@/providers/tanstack-query";
import { routeTree } from "@/route-tree.gen";
import { NotFound } from "@/routes/-components/not-found";

import "@/style.css";

export function getRouter() {
  const TanStackQueryProviderContext = TanStackQueryProvider.getContext();

  const router = createRouter({
    routeTree,
    context: {
      ...TanStackQueryProviderContext,
    },
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: NotFound,
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient: TanStackQueryProviderContext.queryClient,
  });

  return router;
}
