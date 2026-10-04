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
import { formatTimecode } from "@/lib/broll/chunker";
import { downloadClip } from "@/lib/broll/download";
import { useBrollStore } from "@/lib/broll/store";
import { cn } from "@/lib/utils";
import type { StockClip } from "@/lib/broll/types";
import {
  Download,
  ExternalLink,
  Film,
  Image as ImageIcon,
  Loader2,
  User,
  Youtube,
} from "lucide-react";

export function TimelineStep() {
  const chunks = useBrollStore((s) => s.chunks);
  const setStep = useBrollStore((s) => s.setStep);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  const rows = chunks.map((c) => ({
    chunk: c,
    clip: c.results.find((r) => r.id === c.selectedId) ?? null,
  }));
  const withClips = rows.filter((r) => r.clip);
  const downloadable = withClips.filter(
    (r) => r.clip && r.clip.provider !== "youtube" && !r.clip.linkOnly,
  );
  const total = Math.max(
    1,
    chunks.at(-1)?.endSec ?? chunks.reduce((s, c) => s + c.durationSec, 0),
  );

  async function downloadAll() {
    if (!downloadable.length) {
      toast.message("No downloadable stock clips — YouTube picks open as links.");
      return;
    }
    setBusy(true);
    setProgress(0);
    let ok = 0;
    for (let i = 0; i < downloadable.length; i++) {
      const row = downloadable[i]!;
      try {
        await downloadClip(row.clip!, row.chunk.index);
        ok++;
        await new Promise((r) => setTimeout(r, 350));
      } catch (e) {
        toast.error(
          `Chunk ${row.chunk.index + 1}: ${String((e as Error)?.message || e)}`,
        );
      }
      setProgress(Math.round(((i + 1) / downloadable.length) * 100));
    }
    setBusy(false);
    toast.success(`Downloaded ${ok} of ${downloadable.length} clips`);
  }

  async function downloadOne(clip: StockClip, index: number) {
    if (clip.provider === "youtube" || clip.linkOnly) {
      window.open(clip.pageUrl, "_blank", "noopener,noreferrer");
      return;
    }
    try {
      await downloadClip(clip, index);
      toast.success("Download started");
    } catch (e) {
      toast.error(String((e as Error)?.message || e));
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your b-roll timeline</CardTitle>
          <CardDescription>
            Full-bleed under your talking head. Stock clips download here;
            YouTube picks open so you can grab the section yourself.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-fg-subtle">
              <span className="font-mono">0:00.0</span>
              <span className="font-mono">{formatTimecode(total)}</span>
            </div>
            <div className="relative h-20 overflow-hidden rounded-[var(--radius-md)] border border-border bg-bg">
              <div className="absolute left-2 top-1.5 z-10 inline-flex items-center gap-1 rounded bg-bg-elevated/90 px-1.5 py-0.5 text-[10px] text-fg-muted">
                <User className="h-3 w-3" /> Talking head (your video)
              </div>
              {rows.map(({ chunk, clip }) => {
                const left = (chunk.startSec / total) * 100;
                const width = Math.max(
                  2,
                  (chunk.durationSec / total) * 100,
                );
                const isYt = clip?.provider === "youtube";
                return (
                  <div
                    key={chunk.id}
                    className={cn(
                      "absolute bottom-2 top-7 overflow-hidden rounded-[var(--radius-xs)] border",
                      clip
                        ? "border-border-strong"
                        : "border-dashed border-border bg-bg-subtle/50",
                    )}
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      background: clip
                        ? isYt
                          ? "linear-gradient(135deg, #3a1a1a, #1a1010)"
                          : clip.kind === "video"
                            ? "linear-gradient(135deg, #2a2a32, #16161c)"
                            : "linear-gradient(135deg, #1e2a24, #121814)"
                        : undefined,
                    }}
                    title={`#${chunk.index + 1} ${formatTimecode(chunk.startSec)}`}
                  >
                    {clip?.thumbUrl && (
                      <img
                        src={clip.thumbUrl}
                        alt=""
                        className="h-full w-full object-cover opacity-70"
                        crossOrigin="anonymous"
                      />
                    )}
                    <span className="absolute inset-x-0 bottom-0 truncate bg-black/50 px-1 py-0.5 text-center font-mono text-[9px] text-fg">
                      {chunk.index + 1}
                      {isYt ? " · YT" : ""}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-fg-subtle">
              Lane above is your continuous talking head. Blocks are b-roll
              underneath (red tint = YouTube link).
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => void downloadAll()}
              disabled={busy || downloadable.length === 0}
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {busy
                ? `Downloading… ${progress}%`
                : `Download stock clips (${downloadable.length})`}
            </Button>
            <Button variant="outline" onClick={() => setStep("find")}>
              Change picks
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {rows.map(({ chunk, clip }) => {
          const isYt = clip?.provider === "youtube" || clip?.linkOnly;
          return (
            <Card key={chunk.id}>
              <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
                <div className="relative h-16 w-full shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-bg-subtle sm:w-28">
                  {clip?.thumbUrl ? (
                    <img
                      src={clip.thumbUrl}
                      alt=""
                      className="h-full w-full object-cover"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[11px] text-fg-subtle">
                      No pick
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="default">#{chunk.index + 1}</Badge>
                    <span className="font-mono text-[11px] tabular text-fg-subtle">
                      {formatTimecode(chunk.startSec)} →{" "}
                      {formatTimecode(chunk.endSec)}
                    </span>
                    {clip && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-fg-muted">
                        {isYt ? (
                          <Youtube className="h-3 w-3" />
                        ) : clip.kind === "video" ? (
                          <Film className="h-3 w-3" />
                        ) : (
                          <ImageIcon className="h-3 w-3" />
                        )}
                        {clip.provider}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-sm text-fg">
                    {clip?.title ?? "Nothing selected for this chunk"}
                  </p>
                  <p className="line-clamp-1 text-xs text-fg-muted">
                    {chunk.visualIdea}
                  </p>
                </div>
                {clip &&
                  (isYt ? (
                    <Button size="sm" variant="secondary" asChild>
                      <a
                        href={clip.pageUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Open YouTube
                      </a>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => void downloadOne(clip, chunk.index)}
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </Button>
                  ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="rounded-[var(--radius-lg)] border border-dashed border-border bg-bg-elevated p-4 text-xs leading-relaxed text-fg-muted">
        <p className="mb-1 font-medium text-fg">In your editor</p>
        <ol className="list-inside list-decimal space-y-1">
          <li>Drop your talking-head clip on V1 (full timeline).</li>
          <li>
            Place each downloaded stock b-roll on V2 at the start times above.
          </li>
          <li>
            For YouTube picks: open the link, grab the section you need with
            your usual tools, then place on V2.
          </li>
          <li>Mute stock audio. Crossfade joins if two blocks touch.</li>
        </ol>
      </div>
    </div>
  );
}
