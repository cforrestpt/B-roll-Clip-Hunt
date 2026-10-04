import { STEPS, type StepId } from "@/lib/broll/types";
import { useBrollStore } from "@/lib/broll/store";
import { cn } from "@/lib/utils";

const ORDER: StepId[] = STEPS.map((s) => s.id);

export function StepNav() {
  const step = useBrollStore((s) => s.step);
  const setStep = useBrollStore((s) => s.setStep);
  const chunks = useBrollStore((s) => s.chunks);
  const current = ORDER.indexOf(step);

  return (
    <nav
      aria-label="Workflow"
      className="flex w-full items-center gap-1 overflow-x-auto scrollbar-thin pb-1"
    >
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = s.id === step;
        const locked =
          (s.id === "chunks" || s.id === "find" || s.id === "timeline") &&
          chunks.length === 0 &&
          !active &&
          !done;

        return (
          <button
            key={s.id}
            type="button"
            disabled={locked}
            onClick={() => {
              if (!locked && (done || active || i <= current + 1)) setStep(s.id);
            }}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors duration-150",
              active && "border-primary bg-primary text-primary-fg",
              done && !active && "border-border-strong bg-bg-subtle text-fg",
              !active && !done && "border-border bg-transparent text-fg-subtle",
              locked && "opacity-40",
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full font-mono text-[10px]",
                active ? "bg-primary-fg/15" : "bg-bg-hover",
              )}
            >
              {s.short}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
