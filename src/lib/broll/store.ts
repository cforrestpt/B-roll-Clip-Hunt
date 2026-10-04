import { chunkScript } from "./chunker";
import {
  applyColumnMap,
  extractTableGrid,
  guessColumnRoles,
  rowsToChunks,
  SAMPLE_NOTION_TABLE,
  type ColRole,
  type TableGrid,
} from "./import-table";
import { SAMPLE_PODCAST, SAMPLE_STORY, SAMPLE_TUTORIAL } from "./samples";
import { searchStock } from "./stock-api";
import type {
  ApiKeys,
  Chunk,
  InputMode,
  ProjectSettings,
  StepId,
  StockClip,
} from "./types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface BrollState {
  step: StepId;
  inputMode: InputMode;
  script: string;
  tableText: string;
  importError: string | null;
  importWarnings: string[];
  tableGrid: TableGrid | null;
  columnRoles: ColRole[];
  mapping: boolean;
  chunks: Chunk[];
  selectedChunkId: string | null;
  keys: ApiKeys;
  keysLocked: boolean;
  settings: ProjectSettings;
  searchingAll: boolean;
  _hydrated: boolean;

  setHydrated: () => void;
  setStep: (s: StepId) => void;
  setInputMode: (m: InputMode) => void;
  setScript: (s: string) => void;
  setTableText: (s: string) => void;
  loadSample: (kind: "podcast" | "tutorial" | "story") => void;
  loadTableSample: () => void;
  setKeys: (patch: Partial<ApiKeys>) => void;
  setKeysLocked: (locked: boolean) => void;
  setSettings: (patch: Partial<ProjectSettings>) => void;
  setSelectedChunkId: (id: string | null) => void;
  setColumnRole: (index: number, role: ColRole) => void;

  buildChunks: () => void;
  startTableMapping: () => void;
  cancelMapping: () => void;
  confirmMappedImport: () => void;
  updateChunk: (id: string, patch: Partial<Chunk>) => void;
  setChunkOptions: (
    id: string,
    option1: string,
    option2: string,
    option3: string,
  ) => void;
  deleteChunk: (id: string) => void;
  /** Optional queryOverride: use this phrase and set it as activeQuery */
  searchChunk: (id: string, queryOverride?: string) => Promise<void>;
  searchAllChunks: () => Promise<void>;
  selectClip: (chunkId: string, clipId: string | null) => void;
  reset: () => void;
}

const defaultSettings: ProjectSettings = {
  chunkSeconds: 8,
  speakingWpm: 150,
  preferVideo: true,
  includePhotos: true,
  resultsPerQuery: 15,
};

const defaultKeys: ApiKeys = { pexels: "", pixabay: "", youtube: "" };

/** Ignore out-of-order search responses (user double-clicks / switches query). */
const searchSeq = new Map<string, number>();

function reindex(chunks: Chunk[]): Chunk[] {
  return chunks.map((c, i) => ({ ...c, index: i }));
}

function normalizeChunk(c: Chunk): Chunk {
  return {
    ...c,
    activeQuery: c.activeQuery ?? c.searchQuery ?? "",
    altQueries: c.altQueries ?? [],
    results: c.results ?? [],
  };
}

function isVerticalClip(c: StockClip): boolean {
  return Boolean(c.width && c.height && c.height > c.width);
}

function hasUsableMedia(c: StockClip): boolean {
  if (c.provider === "youtube" || c.linkOnly) {
    return Boolean(c.pageUrl && (c.thumbUrl || c.previewUrl));
  }
  return Boolean(c.thumbUrl || c.previewUrl || c.downloadUrl);
}

function rankClip(c: StockClip): number {
  const vert = isVerticalClip(c);
  if (c.provider === "youtube") return 40;
  if (c.kind === "video" && vert) return 0;
  if (c.kind === "video") return 10;
  if (c.kind === "photo" && vert) return 20;
  return 30;
}

export const useBrollStore = create<BrollState>()(
  persist(
    (set, get) => ({
      step: "script",
      inputMode: "table",
      script: SAMPLE_PODCAST,
      tableText: "",
      importError: null,
      importWarnings: [],
      tableGrid: null,
      columnRoles: [],
      mapping: false,
      chunks: [],
      selectedChunkId: null,
      keys: defaultKeys,
      keysLocked: false,
      settings: defaultSettings,
      searchingAll: false,
      _hydrated: false,

      setHydrated: () => set({ _hydrated: true }),
      setStep: (step) => set({ step }),
      setInputMode: (inputMode) =>
        set({ inputMode, importError: null, mapping: false, tableGrid: null }),
      setScript: (script) => set({ script }),
      setTableText: (tableText) =>
        set({ tableText, importError: null, mapping: false, tableGrid: null }),
      loadSample: (kind) => {
        const map = {
          podcast: SAMPLE_PODCAST,
          tutorial: SAMPLE_TUTORIAL,
          story: SAMPLE_STORY,
        } as const;
        set({
          script: map[kind],
          chunks: [],
          selectedChunkId: null,
          step: "script",
          inputMode: "script",
          importError: null,
          mapping: false,
          tableGrid: null,
        });
      },
      loadTableSample: () => {
        set({
          tableText: SAMPLE_NOTION_TABLE.trim(),
          inputMode: "table",
          chunks: [],
          selectedChunkId: null,
          step: "script",
          importError: null,
          mapping: false,
          tableGrid: null,
        });
      },
      setKeys: (patch) => {
        if (get().keysLocked) return;
        set({ keys: { ...get().keys, ...patch } });
      },
      setKeysLocked: (keysLocked) => set({ keysLocked }),
      setSettings: (patch) =>
        set({ settings: { ...get().settings, ...patch } }),
      setSelectedChunkId: (selectedChunkId) => set({ selectedChunkId }),
      setColumnRole: (index, role) => {
        const columnRoles = [...get().columnRoles];
        columnRoles[index] = role;
        set({ columnRoles });
      },

      buildChunks: () => {
        const chunks = chunkScript(get().script, get().settings);
        set({
          chunks,
          selectedChunkId: chunks[0]?.id ?? null,
          step: "chunks",
          importError: null,
          importWarnings: [],
          mapping: false,
          tableGrid: null,
        });
      },

      startTableMapping: () => {
        const extracted = extractTableGrid(get().tableText);
        if (extracted.error || !extracted.grid) {
          set({ importError: extracted.error || "Could not parse table" });
          return;
        }
        const roles = guessColumnRoles(extracted.grid.headers);
        set({
          tableGrid: extracted.grid,
          columnRoles: roles,
          mapping: true,
          importError: null,
          importWarnings: [],
        });
      },

      cancelMapping: () =>
        set({ mapping: false, tableGrid: null, columnRoles: [] }),

      confirmMappedImport: () => {
        const { tableGrid, columnRoles, settings } = get();
        if (!tableGrid) {
          set({ importError: "No table to import" });
          return;
        }
        const parsed = applyColumnMap(tableGrid, columnRoles);
        if (parsed.error || !parsed.rows.length) {
          set({
            importError: parsed.error || "No rows found",
            importWarnings: parsed.warnings,
          });
          return;
        }
        const chunks = rowsToChunks(parsed.rows, settings);
        set({
          chunks,
          selectedChunkId: chunks[0]?.id ?? null,
          step: "chunks",
          importError: null,
          importWarnings: parsed.warnings,
          script: chunks.map((c) => c.text).join("\n\n"),
          mapping: false,
          tableGrid: null,
        });
      },

      updateChunk: (id, patch) =>
        set({
          chunks: get().chunks.map((c) =>
            c.id === id ? { ...normalizeChunk(c), ...patch } : c,
          ),
        }),

      setChunkOptions: (id, option1, option2, option3) => {
        set({
          chunks: get().chunks.map((c) =>
            c.id === id
              ? {
                  ...normalizeChunk(c),
                  searchQuery: option1,
                  altQueries: [option2, option3],
                  visualIdea: option1 || c.visualIdea,
                  activeQuery: option1 || c.activeQuery,
                }
              : c,
          ),
        });
      },

      deleteChunk: (id) => {
        searchSeq.delete(id);
        const next = reindex(
          get().chunks.filter((c) => c.id !== id).map(normalizeChunk),
        );
        const selected =
          get().selectedChunkId === id
            ? (next[0]?.id ?? null)
            : get().selectedChunkId;
        set({ chunks: next, selectedChunkId: selected });
      },

      /**
       * Search ONLY one query for this section.
       * queryOverride: set activeQuery + search that phrase (for option chips).
       */
      searchChunk: async (id, queryOverride) => {
        const found = get().chunks.find((c) => c.id === id);
        if (!found) return;
        const chunk = normalizeChunk(found);
        const { keys, settings } = get();

        const seq = (searchSeq.get(id) ?? 0) + 1;
        searchSeq.set(id, seq);

        const query = (
          queryOverride !== undefined && queryOverride !== null
            ? queryOverride
            : chunk.activeQuery || chunk.searchQuery || ""
        ).trim();

        // Clear previous results immediately — no stale cards while loading
        set({
          chunks: get().chunks.map((c) =>
            c.id === id
              ? {
                  ...normalizeChunk(c),
                  activeQuery: query || c.activeQuery,
                  status: "searching",
                  error: undefined,
                  results: [],
                  selectedId: null,
                }
              : c,
          ),
        });

        if (!query) {
          set({
            chunks: get().chunks.map((c) =>
              c.id === id
                ? {
                    ...normalizeChunk(c),
                    status: "error",
                    error: "Add a search query for this section first.",
                    results: [],
                  }
                : c,
            ),
          });
          return;
        }

        try {
          const result = await searchStock({
            data: {
              query,
              pexelsKey: keys.pexels,
              pixabayKey: keys.pixabay,
              youtubeKey: keys.youtube,
              preferVideo: settings.preferVideo,
              includePhotos: settings.includePhotos,
              perPage: settings.resultsPerQuery,
              nonce: `${id}-${seq}-${Date.now()}`,
            },
          });

          if (searchSeq.get(id) !== seq) return;

          if (!result.hadKeys) {
            set({
              chunks: get().chunks.map((c) =>
                c.id === id
                  ? {
                      ...normalizeChunk(c),
                      results: [],
                      status: "error",
                      error:
                        "Add a free Pexels, Pixabay, and/or YouTube API key in Settings to search.",
                    }
                  : c,
              ),
            });
            return;
          }

          const all = (result.clips ?? [])
            .filter(hasUsableMedia)
            .map((clip) => ({
              ...clip,
              matchNote: clip.matchNote.includes(query)
                ? clip.matchNote
                : `${clip.matchNote} · “${query}”`,
            }))
            .sort((a, b) => rankClip(a) - rankClip(b));

          const queryUsed =
            (result as { queryUsed?: string }).queryUsed || query;

          set({
            chunks: get().chunks.map((c) =>
              c.id === id
                ? {
                    ...normalizeChunk(c),
                    activeQuery: query,
                    results: all,
                    status: all.length ? "ready" : "empty",
                    error:
                      all.length === 0
                        ? result.errors?.[0] ||
                          `No usable clips for “${queryUsed}”. Try a shorter phrase.`
                        : result.errors?.length
                          ? result.errors[0]
                          : undefined,
                    selectedId:
                      all.find(
                        (x) =>
                          x.kind === "video" &&
                          x.provider !== "youtube" &&
                          isVerticalClip(x),
                      )?.id ??
                      all.find(
                        (x) =>
                          x.kind === "video" && x.provider !== "youtube",
                      )?.id ??
                      all[0]?.id ??
                      null,
                  }
                : c,
            ),
          });
        } catch (e) {
          if (searchSeq.get(id) !== seq) return;
          set({
            chunks: get().chunks.map((c) =>
              c.id === id
                ? {
                    ...normalizeChunk(c),
                    status: "error",
                    results: [],
                    error: String((e as Error)?.message || e),
                  }
                : c,
            ),
          });
        }
      },

      searchAllChunks: async () => {
        set({ searchingAll: true, step: "find" });
        set({
          chunks: get().chunks.map((c) => {
            const n = normalizeChunk(c);
            return {
              ...n,
              activeQuery: (n.activeQuery || n.searchQuery || "").trim(),
            };
          }),
        });
        const ids = get().chunks.map((c) => c.id);
        for (const id of ids) {
          await get().searchChunk(id);
        }
        set({ searchingAll: false });
      },

      selectClip: (chunkId, clipId) =>
        set({
          chunks: get().chunks.map((c) =>
            c.id === chunkId
              ? { ...normalizeChunk(c), selectedId: clipId }
              : c,
          ),
        }),

      reset: () => {
        searchSeq.clear();
        set({
          step: "script",
          script: SAMPLE_PODCAST,
          tableText: "",
          chunks: [],
          selectedChunkId: null,
          searchingAll: false,
          importError: null,
          importWarnings: [],
          mapping: false,
          tableGrid: null,
          columnRoles: [],
        });
      },
    }),
    {
      name: "broll-finder-v7",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            },
      ),
      partialize: (s) => ({
        keys: s.keys,
        keysLocked: s.keysLocked,
        settings: s.settings,
        script: s.script,
        tableText: s.tableText,
        inputMode: s.inputMode,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<BrollState>;
        return {
          ...current,
          ...p,
          keys: {
            ...defaultKeys,
            ...(p.keys ?? {}),
          },
          keysLocked: Boolean(p.keysLocked),
          settings: {
            ...defaultSettings,
            ...(p.settings ?? {}),
            resultsPerQuery: Math.max(
              12,
              p.settings?.resultsPerQuery ?? defaultSettings.resultsPerQuery,
            ),
          },
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
