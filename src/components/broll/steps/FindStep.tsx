import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  formatTimecode,
  getActiveQuery,
  getChunkOptions,
} from "@/lib/broll/chunker";
import { downloadClip } from "@/lib/broll/download";
import { useBrollStore } from "@/lib/broll/store";
import { cn } from "@/lib/utils";
import type { StockClip } from "@/lib/broll/types";
import {
  Check,
  Download,
  ExternalLink,
  Film,
  Image as ImageIcon,
  KeyRound,
  Loader2,
  Search,
  Youtube,
} from "lucide-react";

function hasUsableMedia(c: StockClip): boolean {
  if (c.provider === "youtube" || c.linkOnly) {
    return Boolean(c.pageUrl && (c.thumbUrl || c.previewUrl));
  }
  return Boolean(c.thumbUrl || c.previewUrl || c.downloadUrl);
}

export function FindStep({ onOpenSettings }: { onOpenSettings: () => void }) {
  const chunks = useBrollStore((s) => s.chunks);
  const selectedChunkId = useBrollStore((s) => s.selectedChunkId);
  const setSelectedChunkId = useBrollStore((s) => s.setSelectedChunkId);
  const selectClip = useBrollStore((s) => s.selectClip);
  const searchChunk = useBrollStore((s) => s.searchChunk);
  const searchAllChunks = useBrollStore((s) => s.searchAllChunks);
  const updateChunk = useBrollStore((s) => s.updateChunk);
  const searchingAll = useBrollStore((s) => s.searchingAll);
  const setStep = useBrollStore((s) => s.setStep);
  const keys = useBrollStore((s) => s.keys);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "video" | "photo" | "youtube">(
    "all",
  );

  const selected =
    chunks.find((c) => c.id === selectedChunkId) ?? chunks[0] ?? null;
  const hasKey = Boolean(keys.pexels || keys.pixabay || keys.youtube);
  const picked = chunks.filter((c) => c.selectedId).length;
  const ready = chunks.filter((c) => c.status === "ready").length;

  if (!chunks.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-fg-muted">
          Import or chop a script first.
          <div className="mt-4">
            <Button variant="outline" onClick={() => setStep("script")}>
              Input
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  async function onDownload(clip: StockClip, chunkIndex: number) {
    if (clip.linkOnly || clip.provider === "youtube") {
      window.open(clip.pageUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setDownloading(clip.id);
    try {
      await downloadClip(clip, chunkIndex);
      toast.success("Download started");
    } catch (e) {
      toast.error(String((e as Error)?.message || "Download failed"));
    } finally {
      setDownloading(null);
    }
  }

  const usable = selected?.results.filter(hasUsableMedia) ?? [];
  const videoResults = usable.filter(
    (r) => r.kind === "video" && r.provider !== "youtube",
  );
  const photoResults = usable.filter((r) => r.kind === "photo");
  const ytResults = usable.filter((r) => r.provider === "youtube");
  const visibleResults =
    filter === "video"
      ? videoResults
      : filter === "photo"
        ? photoResults
        : filter === "youtube"
          ? ytResults
          : usable;

  const optionChips = selected
    ? getChunkOptions(selected)
        .map((q, i) => ({ q: q.trim(), i }))
        .filter((x) => x.q)
        .filter(
          (x, idx, arr) =>
            arr.findIndex((y) => y.q.toLowerCase() === x.q.toLowerCase()) ===
            idx,
        )
    : [];

  const activeQ = selected ? getActiveQuery(selected) : "";
  const isSearching = selected?.status === "searching";

  return (
    <div className="space-y-4">
      {!hasKey && (
        <Card className="border-warning/40">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <KeyRound className="mt-0.5 h-4 w-4 text-warning" />
              <div>
                <p className="text-sm font-medium">
                  Need at least one free API key
                </p>
                <p className="text-xs text-fg-muted">
                  Pexels / Pixabay = downloadable clips + stills (vertical first).
                  YouTube = search links.
                </p>
              </div>
            </div>
            <Button size="sm" onClick={onOpenSettings}>
              Add keys
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-fg-muted">
          <span className="font-mono tabular text-fg">{ready}</span>/
          {chunks.length} searched ·{" "}
          <span className="font-mono tabular text-fg">{picked}</span> selected
          <span className="ml-2 text-[11px] text-fg-subtle">
            · one query at a time · vertical first
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={searchingAll || !hasKey}
            onClick={() => void searchAllChunks()}
          >
            {searchingAll ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Search all
          </Button>
          <Button
            size="sm"
            disabled={picked === 0}
            onClick={() => setStep("timeline")}
          >
            Open timeline ({picked})
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <Card className="h-fit lg:sticky lg:top-20">
          <CardContent className="max-h-[65vh] space-y-1 overflow-y-auto scrollbar-thin p-2">
            {chunks.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSelectedChunkId(c.id);
                  setFilter("all");
                }}
                className={cn(
                  "flex w-full items-start gap-2 rounded-[var(--radius-md)] border px-2.5 py-2 text-left text-xs transition-colors",
                  selected?.id === c.id
                    ? "border-border-strong bg-bg-subtle"
                    : "border-transparent hover:bg-bg-subtle",
                )}
              >
                <StatusDot status={c.status} selected={Boolean(c.selectedId)} />
                <span className="min-w-0">
                  <span className="font-mono text-[10px] text-fg-subtle">
                    #{c.index + 1} · {formatTimecode(c.startSec)}
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-fg-muted">
                    {getActiveQuery(c) || c.visualIdea}
                  </span>
                </span>
              </button>
            ))}
          </CardContent>
        </Card>

        {selected && (
          <div className="space-y-4" key={selected.id}>
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default">Section {selected.index + 1}</Badge>
                  <span className="font-mono text-xs text-fg-subtle">
                    {formatTimecode(selected.startSec)}–
                    {formatTimecode(selected.endSec)}
                  </span>
                </div>
                <CardTitle className="text-base leading-snug text-pretty">
                  {selected.text}
                </CardTitle>
                <CardDescription>
                  Each search uses only the active query. Tap a chip to search
                  that option — old results clear first.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-fg-muted">
                    Active search query
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      value={activeQ}
                      onChange={(e) => {
                        updateChunk(selected.id, {
                          activeQuery: e.target.value,
                        });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && activeQ.trim() && hasKey) {
                          e.preventDefault();
                          void searchChunk(selected.id, activeQ.trim());
                        }
                      }}
                      placeholder="Type a search phrase…"
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      className="shrink-0"
                      disabled={isSearching || !hasKey || !activeQ.trim()}
                      onClick={() =>
                        void searchChunk(selected.id, activeQ.trim())
                      }
                    >
                      {isSearching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                      Search
                    </Button>
                  </div>
                  {optionChips.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {optionChips.map(({ q, i }) => {
                        const active =
                          activeQ.trim().toLowerCase() === q.toLowerCase();
                        return (
                          <button
                            key={`${selected.id}-opt-${i}`}
                            type="button"
                            disabled={isSearching}
                            onClick={() => void searchChunk(selected.id, q)}
                            className={cn(
                              "rounded-full border px-2.5 py-0.5 text-[11px] transition-colors disabled:opacity-50",
                              active
                                ? "border-primary bg-primary/15 text-fg"
                                : "border-border text-fg-muted hover:text-fg",
                            )}
                          >
                            <span className="mr-1 font-mono text-[10px] text-fg-subtle">
                              {i + 1}
                            </span>
                            {q.length > 40 ? `${q.slice(0, 38)}…` : q}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {selected.error && selected.status !== "ready" && (
                  <p className="rounded-[var(--radius-sm)] border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
                    {selected.error}
                  </p>
                )}

                {isSearching && (
                  <div className="flex items-center gap-2 py-10 text-sm text-fg-muted">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching “{activeQ.trim() || "…"}” — clearing old results…
                  </div>
                )}

                {!isSearching && usable.length > 0 && (
                  <>
                    <div className="flex flex-wrap gap-1.5">
                      {(
                        [
                          ["all", `All (${usable.length})`],
                          ["video", `Video (${videoResults.length})`],
                          ["photo", `Stills (${photoResults.length})`],
                          ["youtube", `YouTube (${ytResults.length})`],
                        ] as const
                      ).map(([id, label]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setFilter(id)}
                          className={cn(
                            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                            filter === id
                              ? "border-primary bg-primary text-primary-fg"
                              : "border-border bg-bg-subtle text-fg-muted hover:text-fg",
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {visibleResults.map((clip) => (
                        <ClipCard
                          key={clip.id}
                          clip={clip}
                          selected={selected.selectedId === clip.id}
                          downloading={downloading === clip.id}
                          onSelect={() => selectClip(selected.id, clip.id)}
                          onDownload={() =>
                            void onDownload(clip, selected.index)
                          }
                        />
                      ))}
                    </div>

                    {visibleResults.length === 0 && (
                      <p className="py-6 text-center text-sm text-fg-muted">
                        No results in this filter — try All or another chip.
                      </p>
                    )}
                  </>
                )}

                {!isSearching &&
                  selected.status === "empty" &&
                  usable.length === 0 && (
                    <p className="py-8 text-center text-sm text-fg-muted">
                      Nothing usable came back. Shorten the query or try another
                      option chip.
                    </p>
                  )}

                {!isSearching && selected.status === "idle" && hasKey && (
                  <div className="py-6 text-center text-sm text-fg-muted">
                    <Button
                      onClick={() =>
                        void searchChunk(selected.id, activeQ.trim())
                      }
                    >
                      Search for this section
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between gap-3">
              <Button variant="ghost" onClick={() => setStep("chunks")}>
                Back to options
              </Button>
              <Button
                disabled={picked === 0}
                onClick={() => setStep("timeline")}
              >
                Review timeline
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusDot({
  status,
  selected,
}: {
  status: string;
  selected: boolean;
}) {
  const color = selected
    ? "bg-success"
    : status === "ready"
      ? "bg-fg-muted"
      : status === "searching"
        ? "bg-warning animate-pulse"
        : status === "error" || status === "empty"
          ? "bg-danger"
          : "bg-border-strong";
  return <span className={cn("mt-1 h-2 w-2 shrink-0 rounded-full", color)} />;
}

function ClipCard({
  clip,
  selected,
  downloading,
  onSelect,
  onDownload,
}: {
  clip: StockClip;
  selected: boolean;
  downloading: boolean;
  onSelect: () => void;
  onDownload: () => void;
}) {
  const isYt = clip.provider === "youtube" || clip.linkOnly;
  const isVert =
    clip.width > 0 && clip.height > 0 ? clip.height > clip.width : null;
  const mediaSrc = clip.thumbUrl || clip.previewUrl;

  if (!mediaSrc && !clip.pageUrl) return null;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--radius-md)] border bg-bg-elevated transition-colors",
        selected ? "border-primary ring-1 ring-primary/40" : "border-border",
      )}
    >
      <button type="button" onClick={onSelect} className="block w-full text-left">
        <div
          className={cn(
            "relative bg-bg-subtle",
            isVert === true ? "aspect-[9/16] max-h-64 mx-auto" : "aspect-video",
          )}
        >
          {!isYt && clip.kind === "video" && clip.previewUrl ? (
            <video
              src={clip.previewUrl}
              poster={clip.thumbUrl || undefined}
              muted
              playsInline
              loop
              preload="metadata"
              className="h-full w-full object-cover"
              onMouseEnter={(e) => {
                void e.currentTarget.play().catch(() => {});
              }}
              onMouseLeave={(e) => {
                e.currentTarget.pause();
                e.currentTarget.currentTime = 0;
              }}
            />
          ) : mediaSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mediaSrc}
              alt=""
              className="h-full w-full object-cover"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-fg-subtle">
              No preview
            </div>
          )}
          <div className="absolute left-1.5 top-1.5 flex flex-wrap gap-1">
            <span className="inline-flex items-center gap-1 rounded bg-black/55 px-1.5 py-0.5 text-[10px] text-fg">
              {isYt ? (
                <Youtube className="h-3 w-3" />
              ) : clip.kind === "video" ? (
                <Film className="h-3 w-3" />
              ) : (
                <ImageIcon className="h-3 w-3" />
              )}
              {isYt ? "youtube" : clip.kind === "photo" ? "still" : "video"}
            </span>
            {isVert !== null && (
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 text-[10px] font-medium uppercase",
                  isVert
                    ? "bg-success/90 text-fg"
                    : "bg-black/55 text-fg-muted",
                )}
              >
                {isVert ? "9:16" : "16:9"}
              </span>
            )}
            <span className="rounded bg-black/55 px-1.5 py-0.5 text-[10px] uppercase text-fg-muted">
              {clip.provider}
            </span>
          </div>
          {selected && (
            <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-fg">
              <Check className="h-3 w-3" />
            </span>
          )}
          {clip.durationSec != null && (
            <span className="absolute bottom-1.5 right-1.5 rounded bg-black/55 px-1.5 py-0.5 font-mono text-[10px] text-fg">
              {clip.durationSec}s
            </span>
          )}
        </div>
      </button>
      <div className="space-y-2 p-2.5">
        <p className="line-clamp-1 text-xs font-medium">{clip.title}</p>
        <p className="truncate text-[11px] text-fg-subtle">
          {clip.photographer}
          {!isYt && clip.width > 0 ? ` · ${clip.width}×${clip.height}` : ""}
        </p>
        <div className="flex gap-1.5">
          <Button
            size="sm"
            variant={selected ? "default" : "secondary"}
            className="flex-1"
            onClick={onSelect}
          >
            {selected ? "Selected" : "Use this"}
          </Button>
          {isYt ? (
            <Button size="sm" variant="outline" asChild>
              <a
                href={clip.pageUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Open on YouTube"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                disabled={downloading || !clip.downloadUrl}
                onClick={onDownload}
                aria-label="Download"
              >
                {downloading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Download className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button size="sm" variant="ghost" asChild>
                <a
                  href={clip.pageUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open source"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
