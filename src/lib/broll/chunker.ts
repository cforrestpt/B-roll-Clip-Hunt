import type { Chunk, ProjectSettings } from "./types";

function uid(): string {
  return `c_${Math.random().toString(36).slice(2, 9)}`;
}

/** Split script into ~target-second spoken chunks (default 5–10s). */
export function chunkScript(
  transcript: string,
  settings: ProjectSettings,
): Chunk[] {
  const cleaned = transcript.replace(/\r\n/g, "\n").trim();
  if (!cleaned) return [];

  const sentences = cleaned
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter((s) => s.length > 3);

  const wordsPerSec = settings.speakingWpm / 60;
  const target = Math.min(10, Math.max(5, settings.chunkSeconds));
  const maxWords = Math.round(target * wordsPerSec);
  const minWords = Math.max(6, Math.round(5 * wordsPerSec));

  const groups: string[] = [];
  let buf: string[] = [];
  let count = 0;

  for (const sentence of sentences) {
    const wc = sentence.split(/\s+/).filter(Boolean).length;
    if (count > 0 && count + wc > maxWords && count >= minWords) {
      groups.push(buf.join(" "));
      buf = [sentence];
      count = wc;
    } else {
      buf.push(sentence);
      count += wc;
    }
  }
  if (buf.length) groups.push(buf.join(" "));

  const flat: string[] = [];
  for (const g of groups) {
    const words = g.split(/\s+/).filter(Boolean);
    if (words.length <= maxWords + 4) {
      flat.push(g);
      continue;
    }
    for (let i = 0; i < words.length; i += maxWords) {
      flat.push(words.slice(i, i + maxWords).join(" "));
    }
  }

  let t = 0;
  return flat.map((text, index) => {
    const words = text.split(/\s+/).filter(Boolean).length;
    const durationSec = Math.min(
      12,
      Math.max(4.5, words / wordsPerSec),
    );
    const startSec = t;
    const endSec = t + durationSec;
    t = endSec;
    const idea = inventVisualIdea(text);
    return {
      id: uid(),
      index,
      text,
      startSec: +startSec.toFixed(2),
      endSec: +endSec.toFixed(2),
      durationSec: +durationSec.toFixed(2),
      visualIdea: idea.idea,
      searchQuery: idea.primary,
      altQueries: idea.alts,
      activeQuery: idea.primary,
      results: [],
      selectedId: null,
      mediaPreference: "video" as const,
      status: "idle" as const,
      source: "auto" as const,
    };
  });
}

export function formatTimecode(sec: number): string {
  const s = Math.max(0, sec);
  const m = Math.floor(s / 60);
  const r = s - m * 60;
  const whole = Math.floor(r);
  const tenth = Math.round((r - whole) * 10);
  if (tenth === 10) {
    return `${m}:${String(whole + 1).padStart(2, "0")}.0`;
  }
  return `${m}:${String(whole).padStart(2, "0")}.${tenth}`;
}

/** Rule-based visual ideas (not live AI). Returns primary + up to 2 alts. */
export function inventVisualIdea(text: string): {
  idea: string;
  primary: string;
  alts: string[];
} {
  const lower = text.toLowerCase();
  const rules: [RegExp, string[]][] = [
    [
      /typ(e|ing|ed)|keyboard|laptop|computer|screen|email|code|deep work/,
      [
        "hands typing on laptop keyboard close up",
        "person working focused at desk morning light",
        "laptop screen glowing in quiet room",
      ],
    ],
    [
      /phone|scroll|notification|mobile|distract/,
      [
        "person putting phone face down on desk",
        "smartphone notifications close up",
        "hands locking phone and walking away",
      ],
    ],
    [
      /habit|routine|morning|system|compound/,
      [
        "calm morning coffee and notebook routine",
        "person stretching at sunrise window",
        "habit tracker checklist close up",
      ],
    ],
    [
      /burn|exhaust|stress|overwhelm|force|grind|late night/,
      [
        "person exhausted at laptop late night",
        "rubbing eyes under desk lamp",
        "messy desk with empty coffee cups",
      ],
    ],
    [
      /rest|recover|sleep|coast|trip|walk/,
      [
        "person walking peaceful coastal path",
        "slow waves on empty beach",
        "someone sleeping peacefully morning light",
      ],
    ],
    [
      /studio|light|mic|frame|camera|export|youtube/,
      [
        "home studio talking head setup soft light",
        "ring light and microphone on desk",
        "creator adjusting camera frame",
      ],
    ],
    [
      /family|kids|child|parent|dad/,
      [
        "parent and child calm morning at home",
        "father walking with kids outdoors",
        "family breakfast table natural light",
      ],
    ],
    [
      /flow|easy|align|wiring|neuro/,
      [
        "smooth river flow aerial cinematic",
        "person jogging peacefully in park",
        "slow motion leaves in wind sunlight",
      ],
    ],
  ];

  for (const [re, visuals] of rules) {
    if (re.test(lower)) {
      return {
        idea: visuals[0]!,
        primary: visuals[0]!,
        alts: visuals.slice(1, 3),
      };
    }
  }

  const words = lower
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP.has(w))
    .slice(0, 4);
  const key = words.join(" ") || "lifestyle";
  const primary = `${key} cinematic b-roll footage`;
  return {
    idea: primary,
    primary,
    alts: [`person ${key}`, "abstract motion background cinematic"],
  };
}

const STOP = new Set([
  "that",
  "this",
  "with",
  "from",
  "have",
  "been",
  "were",
  "they",
  "them",
  "their",
  "what",
  "when",
  "where",
  "which",
  "while",
  "about",
  "would",
  "could",
  "should",
  "there",
  "these",
  "those",
  "then",
  "than",
  "into",
  "just",
  "like",
  "some",
  "more",
  "also",
  "very",
  "really",
  "actually",
  "because",
  "people",
  "every",
  "after",
  "before",
  "through",
]);

/** Stable option 1/2/3 for chips (never includes free-typed active query). */
export function getChunkOptions(chunk: Chunk): [string, string, string] {
  return [
    chunk.searchQuery || "",
    chunk.altQueries[0] || "",
    chunk.altQueries[1] || "",
  ];
}

export function getActiveQuery(chunk: Chunk): string {
  return (chunk.activeQuery ?? chunk.searchQuery ?? "").toString();
}
