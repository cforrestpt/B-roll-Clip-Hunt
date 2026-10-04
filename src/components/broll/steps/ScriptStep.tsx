import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  COL_ROLE_LABELS,
  type ColRole,
} from "@/lib/broll/import-table";
import { useBrollStore } from "@/lib/broll/store";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  KeyRound,
  Mic2,
  Table2,
  FileText,
  Video,
  Lock,
} from "lucide-react";

export function ScriptStep({ onOpenSettings }: { onOpenSettings: () => void }) {
  const inputMode = useBrollStore((s) => s.inputMode);
  const setInputMode = useBrollStore((s) => s.setInputMode);
  const script = useBrollStore((s) => s.script);
  const setScript = useBrollStore((s) => s.setScript);
  const tableText = useBrollStore((s) => s.tableText);
  const setTableText = useBrollStore((s) => s.setTableText);
  const loadSample = useBrollStore((s) => s.loadSample);
  const loadTableSample = useBrollStore((s) => s.loadTableSample);
  const buildChunks = useBrollStore((s) => s.buildChunks);
  const startTableMapping = useBrollStore((s) => s.startTableMapping);
  const confirmMappedImport = useBrollStore((s) => s.confirmMappedImport);
  const cancelMapping = useBrollStore((s) => s.cancelMapping);
  const mapping = useBrollStore((s) => s.mapping);
  const tableGrid = useBrollStore((s) => s.tableGrid);
  const columnRoles = useBrollStore((s) => s.columnRoles);
  const setColumnRole = useBrollStore((s) => s.setColumnRole);
  const importError = useBrollStore((s) => s.importError);
  const keys = useBrollStore((s) => s.keys);
  const keysLocked = useBrollStore((s) => s.keysLocked);
  const settings = useBrollStore((s) => s.settings);

  const words = script.trim().split(/\s+/).filter(Boolean).length;
  const estSec = Math.round((words / settings.speakingWpm) * 60);
  const hasKey = Boolean(keys.pexels || keys.pixabay || keys.youtube);
  const tableLines = tableText.trim().split(/\n/).filter(Boolean).length;

  if (mapping && tableGrid) {
    return (
      <MappingUI
        headers={tableGrid.headers}
        sampleRows={tableGrid.rows.slice(0, 3)}
        roles={columnRoles}
        onRoleChange={setColumnRole}
        onConfirm={confirmMappedImport}
        onCancel={cancelMapping}
        error={importError}
        rowCount={tableGrid.rows.length}
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <ModeTab
            active={inputMode === "table"}
            onClick={() => setInputMode("table")}
            icon={<Table2 className="h-3.5 w-3.5" />}
            label="Notion / table"
          />
          <ModeTab
            active={inputMode === "script"}
            onClick={() => setInputMode("script")}
            icon={<FileText className="h-3.5 w-3.5" />}
            label="Raw script"
          />
        </div>

        {inputMode === "table" ? (
          <Card>
            <CardHeader>
              <CardTitle>Paste your b-roll table</CardTitle>
              <CardDescription>
                Copy from Notion (or CSV). Next step: map columns so Spoken and
                B-roll 1–3 land correctly — even with Scene, Feeling, Overlays,
                etc.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={tableText}
                onChange={(e) => setTableText(e.target.value)}
                placeholder={`Scene\tTimestamp\tTranscript Quote\tB-roll 1\tB-roll 2\tB-roll 3\n1\t0-6 sec\tYour spoken line…\tshot idea one\tshot idea two\tshot idea three`}
                className="min-h-[300px] font-mono text-xs leading-relaxed sm:text-[13px]"
              />
              {importError && (
                <p className="rounded-[var(--radius-sm)] border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
                  {importError}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-xs tabular text-fg-subtle">
                  {tableLines ? `${tableLines} lines pasted` : "No table yet"}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={loadTableSample}>
                    Load sample table
                  </Button>
                  <Button disabled={tableLines < 2} onClick={startTableMapping}>
                    Map columns
                  </Button>
                </div>
              </div>
              <div className="rounded-[var(--radius-md)] border border-dashed border-border bg-bg-subtle/50 p-3 text-[11px] leading-relaxed text-fg-muted">
                <p className="mb-1 font-medium text-fg">Tip</p>
                <p>
                  Your nutrition-style tables work: Scene, Timestamp (0-6 sec),
                  Transcript Quote, B-roll 1–3, Feeling, Overlays. Map the ones
                  you need; set the rest to Ignore.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Your talking-head script</CardTitle>
              <CardDescription>
                Paste dialogue. We chop into ~{settings.chunkSeconds}s chunks
                and invent 3 search options per beat. Prefer the table tab if
                you already planned visuals in Notion.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Paste your script…"
                className="min-h-[280px] leading-relaxed"
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-xs tabular text-fg-subtle">
                  {words} words · ~{Math.floor(estSec / 60)}:
                  {String(estSec % 60).padStart(2, "0")} spoken
                </p>
                <Button disabled={words < 8} onClick={buildChunks}>
                  Chop into chunks
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-fg-muted">
          {inputMode === "table" ? "Table help" : "Samples"}
        </p>
        {inputMode === "script" && (
          <>
            <SampleBtn
              icon={<Mic2 className="h-4 w-4" />}
              title="Habits / podcast"
              onClick={() => loadSample("podcast")}
            />
            <SampleBtn
              icon={<Video className="h-4 w-4" />}
              title="Studio tutorial"
              onClick={() => loadSample("tutorial")}
            />
            <SampleBtn
              icon={<BookOpen className="h-4 w-4" />}
              title="Story / burn-out"
              onClick={() => loadSample("story")}
            />
          </>
        )}
        {inputMode === "table" && (
          <SampleBtn
            icon={<Table2 className="h-4 w-4" />}
            title="Load sample Notion table"
            onClick={loadTableSample}
          />
        )}

        <Card className={hasKey ? "border-border" : "border-warning/40"}>
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-fg-muted" />
              <p className="text-sm font-medium">
                {hasKey
                  ? keysLocked
                    ? "API keys locked"
                    : "API keys saved"
                  : "Add free API keys"}
              </p>
              {keysLocked && <Lock className="h-3.5 w-3.5 text-fg-subtle" />}
            </div>
            <p className="text-xs leading-relaxed text-fg-muted text-pretty">
              {hasKey
                ? keysLocked
                  ? "Keys stay in this browser until you unlock them."
                  : "Keys persist in this browser. Lock them so they can’t be edited by accident."
                : "Pexels/Pixabay = downloads. YouTube = search links. Lock after saving."}
            </p>
            <Button
              size="sm"
              variant={hasKey ? "outline" : "default"}
              className="w-full"
              onClick={onOpenSettings}
            >
              {hasKey ? "Manage keys" : "Add API keys"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="space-y-2 p-4 text-xs text-fg-muted">
            <p className="font-medium text-fg">Flow</p>
            <ol className="list-inside list-decimal space-y-1">
              <li>Paste table → map columns</li>
              <li>Edit / delete sections on Options</li>
              <li>Search stock + YouTube</li>
              <li>Tweak query & re-search if needed</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MappingUI({
  headers,
  sampleRows,
  roles,
  onRoleChange,
  onConfirm,
  onCancel,
  error,
  rowCount,
}: {
  headers: string[];
  sampleRows: string[][];
  roles: ColRole[];
  onRoleChange: (i: number, role: ColRole) => void;
  onConfirm: () => void;
  onCancel: () => void;
  error: string | null;
  rowCount: number;
}) {
  const hasText = roles.includes("text");
  const hasOpt = roles.some(
    (r) => r === "opt1" || r === "opt2" || r === "opt3",
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Map columns</CardTitle>
        <CardDescription>
          Tell us what each column is. Sample cells shown below. {rowCount} data
          rows ready.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {headers.map((h, i) => (
            <div
              key={i}
              className="grid gap-2 rounded-[var(--radius-md)] border border-border bg-bg-subtle/40 p-3 sm:grid-cols-[1fr_200px]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-fg">
                  {h || `Column ${i + 1}`}
                </p>
                <p className="mt-1 line-clamp-2 text-[11px] text-fg-subtle">
                  {sampleRows
                    .map((r) => r[i] || "—")
                    .filter(Boolean)
                    .slice(0, 2)
                    .join(" · ") || "empty"}
                </p>
              </div>
              <select
                className="h-10 w-full rounded-[var(--radius-sm)] border border-border bg-bg px-2 text-sm text-fg"
                value={roles[i] || "ignore"}
                onChange={(e) =>
                  onRoleChange(i, e.target.value as ColRole)
                }
              >
                {COL_ROLE_LABELS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {error && (
          <p className="rounded-[var(--radius-sm)] border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
            {error}
          </p>
        )}
        {!hasText && (
          <p className="text-xs text-warning">
            Tip: map one column to Spoken / transcript.
          </p>
        )}
        {!hasOpt && (
          <p className="text-xs text-warning">
            Tip: map at least B-roll option 1 (or we fall back to the spoken
            text).
          </p>
        )}

        <div className="flex flex-wrap justify-between gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Back to paste
          </Button>
          <Button onClick={onConfirm}>Import {rowCount} sections</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ModeTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-fg"
          : "border-border bg-bg-elevated text-fg-muted hover:text-fg",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function SampleBtn({
  icon,
  title,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[var(--radius-md)] border border-border bg-bg-elevated px-3 py-2.5 text-left text-sm transition-colors hover:border-border-strong hover:bg-bg-subtle"
    >
      <span className="text-fg-muted">{icon}</span>
      <span className="font-medium">{title}</span>
    </button>
  );
}
