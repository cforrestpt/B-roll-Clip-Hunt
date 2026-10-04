import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { Button } from "../ui/button";
import { ScriptStep } from "./steps/ScriptStep";
import { ChunksStep } from "./steps/ChunksStep";
import { FindStep } from "./steps/FindStep";
import { TimelineStep } from "./steps/TimelineStep";
import { SettingsPanel } from "./SettingsPanel";
import { StepNav } from "./StepNav";
import { useBrollStore } from "../../lib/broll/store";
import { Clapperboard, Settings2 } from "lucide-react";

export function AppShell() {
  const step = useBrollStore((s) => s.step);
  const hydrated = useBrollStore((s) => s._hydrated);
  const setHydrated = useBrollStore((s) => s.setHydrated);
  const keysLocked = useBrollStore((s) => s.keysLocked);
  const keys = useBrollStore((s) => s.keys);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const result = useBrollStore.persist.rehydrate();
    void Promise.resolve(result).finally(() => setHydrated());
  }, [setHydrated]);

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg text-fg-muted">
        <p className="text-sm">Loading…</p>
      </div>
    );
  }

  const hasKey = Boolean(keys.pexels || keys.pixabay || keys.youtube);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-bg-elevated">
                <Clapperboard className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-sm font-semibold tracking-tight sm:text-base">
                  B-Roll Finder
                </h1>
                <p className="truncate text-[11px] text-fg-subtle sm:text-xs">
                  Map table → options → stock + YouTube
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {hasKey && keysLocked ? "Keys locked" : "API keys"}
              </span>
            </Button>
          </div>
          <StepNav />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {step === "script" && (
          <ScriptStep onOpenSettings={() => setSettingsOpen(true)} />
        )}
        {step === "chunks" && <ChunksStep />}
        {step === "find" && (
          <FindStep onOpenSettings={() => setSettingsOpen(true)} />
        )}
        {step === "timeline" && <TimelineStep />}
      </main>

      <footer className="border-t border-border py-5 text-center text-[11px] text-fg-subtle">
        Map columns · delete sections · re-search · locked API keys
      </footer>

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          className: "border border-border bg-bg-elevated text-fg",
        }}
      />
    </div>
  );
}
