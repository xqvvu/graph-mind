import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import TanStackQueryDevtools from "@/__devtools/tanstack-query";
import TanStackRouterDevtools from "@/__devtools/tanstack-router";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/env";
import styles from "@/style.css?url";

type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: env.VITE_APP_NAME,
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: styles,
      },
    ],
  }),

  shellComponent: Root,
});

function Root() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>

      <body>
        <Outlet />

        <Toaster />
        <TanStackDevtools plugins={[TanStackRouterDevtools, TanStackQueryDevtools]} />

        <Scripts />
      </body>
    </html>
  );
}
