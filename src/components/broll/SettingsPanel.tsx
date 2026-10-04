import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useBrollStore } from "@/lib/broll/store";
import { ExternalLink, Lock, Unlock, X } from "lucide-react";

export function SettingsPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const keys = useBrollStore((s) => s.keys);
  const setKeys = useBrollStore((s) => s.setKeys);
  const keysLocked = useBrollStore((s) => s.keysLocked);
  const setKeysLocked = useBrollStore((s) => s.setKeysLocked);
  const settings = useBrollStore((s) => s.settings);
  const setSettings = useBrollStore((s) => s.setSettings);

  if (!open) return null;

  const hasAny = Boolean(keys.pexels || keys.pixabay || keys.youtube);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-bg/80 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div className="w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-[var(--radius-xl)] border border-border bg-bg-elevated shadow-[var(--shadow-md)]">
        <div className="flex items-start justify-between gap-3 border-b border-border p-5">
          <div>
            <h2
              id="settings-title"
              className="text-base font-semibold tracking-tight"
            >
              API keys
            </h2>
            <p className="mt-1 text-sm text-fg-muted text-pretty">
              Saved in this browser only. Lock them so you don't re-enter
              every session.
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-5 p-5">
          {keysLocked ? (
            <div className="rounded-[var(--radius-md)] border border-success/30 bg-success/10 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-success" />
                <p className="text-sm font-medium">Keys locked & saved</p>
              </div>
              <ul className="space-y-1 text-xs text-fg-muted">
                <li>
                  Pexels:{" "}
                  {keys.pexels ? maskKey(keys.pexels) : "— not set —"}
                </li>
                <li>
                  Pixabay:{" "}
                  {keys.pixabay ? maskKey(keys.pixabay) : "— not set —"}
                </li>
                <li>
                  YouTube:{" "}
                  {keys.youtube ? maskKey(keys.youtube) : "— not set —"}
                </li>
              </ul>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setKeysLocked(false)}
              >
                <Unlock className="h-3.5 w-3.5" />
                Unlock to edit
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="pexels-key">Pexels API key</Label>
                  <a
                    href="https://www.pexels.com/api/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-fg-subtle hover:text-fg"
                  >
                    Get free key <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <Input
                  id="pexels-key"
                  type="password"
                  autoComplete="off"
                  placeholder="Paste Pexels key"
                  value={keys.pexels}
                  onChange={(e) => setKeys({ pexels: e.target.value.trim() })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="pixabay-key">Pixabay API key</Label>
                  <a
                    href="https://pixabay.com/api/docs/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-fg-subtle hover:text-fg"
                  >
                    Get free key <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <Input
                  id="pixabay-key"
                  type="password"
                  autoComplete="off"
                  placeholder="Paste Pixabay key"
                  value={keys.pixabay}
                  onChange={(e) => setKeys({ pixabay: e.target.value.trim() })}
                />
              </div>

              <div className="space-y-2 rounded-[var(--radius-md)] border border-border bg-bg p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="youtube-key">YouTube Data API key</Label>
                  <a
                    href="https://console.cloud.google.com/apis/library/youtube.googleapis.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-fg-subtle hover:text-fg"
                  >
                    Enable free API <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <Input
                  id="youtube-key"
                  type="password"
                  autoComplete="off"
                  placeholder="Paste YouTube Data API key"
                  value={keys.youtube ?? ""}
                  onChange={(e) => setKeys({ youtube: e.target.value.trim() })}
                />
                <p className="text-[11px] text-fg-subtle">
                  Search + open links only. Works alone without Pexels/Pixabay.
                </p>
              </div>

              <Button
                className="w-full"
                disabled={!hasAny}
                onClick={() => {
                  setKeysLocked(true);
                  onClose();
                }}
              >
                <Lock className="h-3.5 w-3.5" />
                Save & lock keys
              </Button>
              <Button className="w-full" variant="outline" onClick={onClose}>
                Save without locking
              </Button>
            </>
          )}

          <div className="rounded-[var(--radius-md)] border border-border bg-bg p-3.5 space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-fg-muted">
              Search preferences
            </p>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-fg">Prefer video</p>
                <p className="text-xs text-fg-subtle">Search video before photos</p>
              </div>
              <Switch
                checked={settings.preferVideo}
                onCheckedChange={(v) => setSettings({ preferVideo: v })}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-fg">Include still images</p>
                <p className="text-xs text-fg-subtle">
                  Always pull stills as a backup when stuck
                </p>
              </div>
              <Switch
                checked={settings.includePhotos}
                onCheckedChange={(v) => setSettings({ includePhotos: v })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="results-n">
                Results per source: {settings.resultsPerQuery}
              </Label>
              <input
                id="results-n"
                type="range"
                min={8}
                max={24}
                step={1}
                value={settings.resultsPerQuery}
                onChange={(e) =>
                  setSettings({ resultsPerQuery: Number(e.target.value) })
                }
                className="w-full accent-fg"
              />
              <p className="text-[11px] text-fg-subtle">
                Higher = more Pexels/Pixabay options per section (default 15).
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="chunk-sec">
                Target chunk length: {settings.chunkSeconds}s
              </Label>
              <input
                id="chunk-sec"
                type="range"
                min={5}
                max={10}
                step={1}
                value={settings.chunkSeconds}
                onChange={(e) =>
                  setSettings({ chunkSeconds: Number(e.target.value) })
                }
                className="w-full accent-fg"
              />
            </div>
          </div>

          {keysLocked && (
            <Button className="w-full" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function maskKey(k: string): string {
  if (k.length <= 8) return "••••••••";
  return `${k.slice(0, 4)}…${k.slice(-4)}`;
}
