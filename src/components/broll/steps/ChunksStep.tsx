import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatTimecode, getChunkOptions } from "@/lib/broll/chunker";
import { useBrollStore } from "@/lib/broll/store";
import { cn } from "@/lib/utils";
import { Search, Trash2 } from "lucide-react";

export function ChunksStep() {
  const chunks = useBrollStore((s) => s.chunks);
  const selectedChunkId = useBrollStore((s) => s.selectedChunkId);
  const setSelectedChunkId = useBrollStore((s) => s.setSelectedChunkId);
  const updateChunk = useBrollStore((s) => s.updateChunk);
  const setChunkOptions = useBrollStore((s) => s.setChunkOptions);
  const deleteChunk = useBrollStore((s) => s.deleteChunk);
  const setStep = useBrollStore((s) => s.setStep);
  const searchAllChunks = useBrollStore((s) => s.searchAllChunks);
  const keys = useBrollStore((s) => s.keys);

  const selected =
    chunks.find((c) => c.id === selectedChunkId) ?? chunks[0] ?? null;
  const totalDur = chunks.reduce((s, c) => s + c.durationSec, 0);
  const hasKey = Boolean(keys.pexels || keys.pixabay || keys.youtube);
  const fromImport = chunks.some((c) => c.source === "import");

  if (!chunks.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-fg-muted">
          No sections yet.
          <div className="mt-4">
            <Button variant="outline" onClick={() => setStep("script")}>
              Back to input
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const [opt1, opt2, opt3] = selected
    ? getChunkOptions(selected)
    : (["", "", ""] as const);

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <Card className="h-fit lg:sticky lg:top-20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Sections</CardTitle>
          <CardDescription>
            {chunks.length} · ~{formatTimecode(totalDur)} total
            {fromImport ? " · from table" : " · auto-chunked"}
          </CardDescription>
        </CardHeader>
        <CardContent className="max-h-[60vh] space-y-1 overflow-y-auto scrollbar-thin p-2">
          {chunks.map((c) => {
            const opts = [c.searchQuery, ...c.altQueries]
              .map((q) => q.trim())
              .filter(Boolean);
            return (
              <div
                key={c.id}
                className={cn(
                  "group flex items-stretch gap-1 rounded-[var(--radius-md)] border",
                  selected?.id === c.id
                    ? "border-border-strong bg-bg-subtle"
                    : "border-transparent hover:bg-bg-subtle",
                )}
              >
                <button
                  type="button"
                  onClick={() => setSelectedChunkId(c.id)}
                  className="min-w-0 flex-1 px-3 py-2.5 text-left"
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] tabular text-fg-subtle">
                      #{c.index + 1} · {formatTimecode(c.startSec)}–
                      {formatTimecode(c.endSec)}
                    </span>
                    <span className="font-mono text-[10px] text-fg-subtle">
                      {opts.length} opt
                    </span>
                  </div>
                  <p className="line-clamp-2 text-xs text-fg-muted">{c.text}</p>
                </button>
                <button
                  type="button"
                  title="Delete section"
                  aria-label={`Delete section ${c.index + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      chunks.length > 1 &&
                      window.confirm(
                        `Delete section #${c.index + 1}? It won’t be searched.`,
                      )
                    ) {
                      deleteChunk(c.id);
                    } else if (chunks.length <= 1) {
                      window.alert("Keep at least one section.");
                    }
                  }}
                  className="shrink-0 px-2 text-fg-subtle opacity-60 transition-opacity hover:text-danger hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {selected && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base">
                    Section #{selected.index + 1}
                  </CardTitle>
                  <CardDescription className="font-mono text-xs">
                    {formatTimecode(selected.startSec)} →{" "}
                    {formatTimecode(selected.endSec)} · under talking head
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 text-danger hover:bg-danger/10"
                  onClick={() => {
                    if (chunks.length <= 1) {
                      window.alert("Keep at least one section.");
                      return;
                    }
                    if (
                      window.confirm(
                        `Delete section #${selected.index + 1}? It won’t be searched.`,
                      )
                    ) {
                      deleteChunk(selected.id);
                    }
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-fg-muted">
                  Spoken
                </p>
                <Textarea
                  value={selected.text}
                  onChange={(e) =>
                    updateChunk(selected.id, { text: e.target.value })
                  }
                  className="min-h-[88px] text-sm leading-relaxed"
                />
              </div>

              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-wide text-fg-muted">
                  B-roll search options
                </p>
                <p className="text-[11px] text-fg-subtle">
                  We try option 1 first, then 2, then 3 until we have enough
                  stock video. Spaces and full phrases work.
                </p>
                {([1, 2, 3] as const).map((n) => {
                  const val = n === 1 ? opt1 : n === 2 ? opt2 : opt3;
                  return (
                    <div key={n} className="space-y-1.5">
                      <label className="text-xs font-medium text-fg">
                        Option {n}
                        {n === 1 ? (
                          <span className="ml-1 font-normal text-fg-subtle">
                            (primary)
                          </span>
                        ) : null}
                      </label>
                      <Input
                        value={val}
                        placeholder={
                          n === 1
                            ? "e.g. person exhausted at laptop late night"
                            : n === 2
                              ? "e.g. clock ticking close up"
                              : "e.g. coffee cups stacked on desk"
                        }
                        onChange={(e) => {
                          const v = e.target.value;
                          if (n === 1)
                            setChunkOptions(selected.id, v, opt2, opt3);
                          else if (n === 2)
                            setChunkOptions(selected.id, opt1, v, opt3);
                          else setChunkOptions(selected.id, opt1, opt2, v);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button variant="ghost" onClick={() => setStep("script")}>
              Back
            </Button>
            <div className="flex flex-wrap items-center gap-2">
              {!hasKey && (
                <span className="text-xs text-warning">
                  Add Pexels, Pixabay, or YouTube key to search
                </span>
              )}
              <Button
                data-testid="find-all-clips"
                onClick={() => {
                  setStep("find");
                  void searchAllChunks();
                }}
              >
                <Search className="h-4 w-4" />
                Find clips for all sections
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
