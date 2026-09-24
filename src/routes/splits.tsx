import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/splits")({ component: SplitsLayout });

function SplitsLayout() {
  return <Outlet />;
}
