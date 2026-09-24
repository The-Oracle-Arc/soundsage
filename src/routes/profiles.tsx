import { createFileRoute } from "@tanstack/react-router";
import { PROFILE_DEFINITIONS } from "@/core/profiles";
import { useSage } from "@/store/app-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profiles")({ component: ProfilesPage });

function ProfilesPage() {
  const { profileId, setProfile } = useSage();

  return (
    <main className="flex flex-1 flex-col gap-6">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">Presets</p>
        <h1 className="mt-2 font-display text-4xl leading-none">Profiles</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Profiles are Splits — the same two-sided pairing and the same engine. Smart, Music Focus,
          Mix, and Custom are configurations, not a second mixer.
        </p>
      </header>

      <ul className="flex flex-col gap-3">
        {PROFILE_DEFINITIONS.map((profile) => {
          const active = profile.id === profileId;
          return (
            <li key={profile.id}>
              <button
                type="button"
                onClick={() => void setProfile(profile.id)}
                className={cn(
                  "w-full rounded-xl border p-5 text-left transition-transform duration-150 active:scale-[0.99]",
                  active ? "border-fg bg-surface" : "border-border bg-surface-2",
                )}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-display text-2xl">{profile.name}</h2>
                  {active ? (
                    <span className="text-[11px] uppercase tracking-wide text-primary">Active</span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-fg">{profile.tagline}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{profile.explanation}</p>
              </button>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
