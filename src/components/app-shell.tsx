import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { House, Layers3, SlidersHorizontal, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SETTINGS_PATHS = new Set([
  "/settings",
  "/capabilities",
  "/automation",
  "/diagnostics",
  "/native",
  "/safari",
]);

const nav = [
  { to: "/", label: "Home", icon: House },
  { to: "/splits", label: "Splits", icon: Layers3 },
  { to: "/profiles", label: "Profiles", icon: Sparkles },
  { to: "/settings", label: "Settings", icon: SlidersHorizontal },
];

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  if (to === "/splits") return pathname === "/splits" || pathname.startsWith("/splits/");
  if (to === "/settings") return SETTINGS_PATHS.has(pathname);
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-28 pt-8 sm:max-w-lg">
        {children}
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
        <div className="mx-auto grid max-w-md grid-cols-4 sm:max-w-lg">
          {nav.map((item) => {
            const active = isActive(pathname, item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 text-xs tracking-wide",
                  active ? "text-fg" : "text-muted",
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2.2 : 1.7} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
