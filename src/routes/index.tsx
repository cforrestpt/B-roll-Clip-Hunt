import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/broll/AppShell";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

export function IndexPage() {
  return <AppShell />;
}
