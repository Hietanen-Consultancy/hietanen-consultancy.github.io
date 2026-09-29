import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    // GitHub Pages serves projects/fuuga/index.html and 301-redirects the
    // slash-less URL to it, so every link, canonical and sitemap entry carries
    // the slash to begin with.
    trailingSlash: "always",
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
