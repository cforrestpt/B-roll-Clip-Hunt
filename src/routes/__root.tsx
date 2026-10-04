import type { ReactNode } from "react";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import appCss from "@/styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: "B-Roll Finder — stock under your talking head",
      },
      {
        name: "description",
        content:
          "Paste a script, chop it into 5–10s chunks, find Pexels & Pixabay video, and download clips for your timeline.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="antialiased dark">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh bg-bg text-fg">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
