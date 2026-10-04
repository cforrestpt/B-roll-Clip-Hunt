export type MediaKind = "video" | "photo";
export type StockProvider = "pexels" | "pixabay" | "youtube";

export type StepId = "script" | "chunks" | "find" | "timeline";

export const STEPS: { id: StepId; label: string; short: string }[] = [
  { id: "script", label: "Input", short: "1" },
  { id: "chunks", label: "Options", short: "2" },
  { id: "find", label: "Find clips", short: "3" },
  { id: "timeline", label: "Timeline", short: "4" },
];

export interface Chunk {
  id: string;
  index: number;
  text: string;
  startSec: number;
  endSec: number;
  durationSec: number;
  /** Visual story this shot should tell under the talking head */
  visualIdea: string;
  /** Primary stock search option (option 1) — stable chip */
  searchQuery: string;
  /** Option 2 + 3 — stable chips */
  altQueries: string[];
  /**
   * What Find step actually searches right now.
   * Independent of option chips so typing/re-search doesn't stack chips.
   */
  activeQuery: string;
  results: StockClip[];
  selectedId: string | null;
  /** Prefer video; fall back to photo when empty */
  mediaPreference: "video" | "either";
  status: "idle" | "searching" | "ready" | "empty" | "error";
  error?: string;
  /** auto = generated from script; import = Notion/table */
  source?: "auto" | "import";
}

export interface StockClip {
  id: string;
  provider: StockProvider;
  kind: MediaKind;
  title: string;
  photographer: string;
  pageUrl: string;
  /** Preview thumbnail */
  thumbUrl: string;
  /** Streamable preview (video) or full image */
  previewUrl: string;
  /** Best download URL — empty for YouTube (link-only) */
  downloadUrl: string;
  width: number;
  height: number;
  durationSec?: number;
  /** Why this matched the idea */
  matchNote: string;
  /** True for YouTube — open link, no direct download */
  linkOnly?: boolean;
}

export interface ApiKeys {
  pexels: string;
  pixabay: string;
  youtube: string;
}

export interface ProjectSettings {
  chunkSeconds: number; // target 5–10
  speakingWpm: number;
  preferVideo: boolean;
  includePhotos: boolean;
  resultsPerQuery: number;
}

export type InputMode = "script" | "table";
