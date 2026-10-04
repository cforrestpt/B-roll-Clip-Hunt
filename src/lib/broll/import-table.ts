import type { Chunk, ProjectSettings } from "./types";

export type ImportRow = {
  text: string;
  startSec?: number;
  endSec?: number;
  durationSec?: number;
  option1: string;
  option2: string;
  option3: string;
};

export type ColRole =
  | "text"
  | "start"
  | "end"
  | "duration"
  | "timeRange"
  | "opt1"
  | "opt2"
  | "opt3"
  | "ignore";

export const COL_ROLE_LABELS: { value: ColRole; label: string }[] = [
  { value: "text", label: "Spoken / transcript" },
  { value: "timeRange", label: "Time range" },
  { value: "start", label: "Start time" },
  { value: "end", label: "End time" },
  { value: "duration", label: "Duration" },
  { value: "opt1", label: "B-roll option 1" },
  { value: "opt2", label: "B-roll option 2" },
  { value: "opt3", label: "B-roll option 3" },
  { value: "ignore", label: "Ignore" },
];

export type TableGrid = {
  headers: string[];
  rows: string[][];
};

export type ParseResult = {
  rows: ImportRow[];
  error?: string;
  warnings: string[];
};

function uid(): string {
  return `c_${Math.random().toString(36).slice(2, 9)}`;
}

export function parseTimeToken(raw: string): number | undefined {
  let s = raw.trim().toLowerCase();
  s = s.replace(/sec(onds?)?\.?$/i, "").trim();
  if (!s) return undefined;
  if (/^\d+(\.\d+)?$/.test(s)) return Number(s);
  const m = s.match(/^(\d+):(\d{1,2})(?:\.(\d+))?$/);
  if (m) {
    const min = Number(m[1]);
    const sec = Number(m[2]);
    const frac = m[3] ? Number(`0.${m[3]}`) : 0;
    return min * 60 + sec + frac;
  }
  return undefined;
}

export function splitLine(line: string): string[] {
  if (line.trim().startsWith("|")) {
    return line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((c) => c.trim());
  }
  if (line.includes("\t")) {
    return line.split("\t").map((c) => c.trim());
  }
  if (/\s{2,}/.test(line) && !line.includes(",")) {
    return line
      .split(/\s{2,}/)
      .map((c) => c.trim())
      .filter(Boolean);
  }
  if (line.includes(",") && (line.match(/,/g) || []).length >= 2) {
    const cells: string[] = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]!;
      if (ch === '"') {
        if (inQ && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQ = !inQ;
      } else if (ch === "," && !inQ) {
        cells.push(cur.trim());
        cur = "";
      } else cur += ch;
    }
    cells.push(cur.trim());
    return cells;
  }
  return [line.trim()];
}

function isSeparatorRow(cells: string[]): boolean {
  return cells.every((c) => /^[-:]+$/.test(c.replace(/\s/g, "")) || c === "");
}

export function classifyHeader(h: string): ColRole {
  const n = h
    .toLowerCase()
    .replace(/[_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!n) return "ignore";

  if (
    /^(script|spoken|text|section|dialogue|line|beat|copy|narration|voiceover|vo|quote|transcript)$/.test(
      n,
    ) ||
    /spoken text|script text|what you say|talking head|section text|transcript quote|transcript/.test(
      n,
    )
  )
    return "text";

  if (/^scene$|^#|number|no\.?$|index$/.test(n)) return "ignore";
  if (/feeling|story to show|overlay|optional text|notes?|editor/.test(n))
    return "ignore";

  if (/^start( time|s| sec)?$|^in$|^from$/.test(n)) return "start";
  if (/^end( time|s| sec)?$|^out$|^to$/.test(n)) return "end";
  if (/^duration|length|secs?$|seconds$/.test(n)) return "duration";
  if (/^time$|timestamp|timecode|time range|range|tc$/.test(n))
    return "timeRange";

  if (
    /^(b-?roll|broll|option|visual|query|search|idea|shot)(\s*(option)?)?\s*1$/.test(
      n,
    ) ||
    /^(b-?roll|broll|visual|query|search)$/.test(n)
  )
    return "opt1";
  if (
    /^(b-?roll|broll|option|visual|query|search|idea|shot|alt|alternate)(\s*(option)?)?\s*2$/.test(
      n,
    ) ||
    /^(alt|alternate)\s*1$/.test(n)
  )
    return "opt2";
  if (
    /^(b-?roll|broll|option|visual|query|search|idea|shot|alt|alternate)(\s*(option)?)?\s*3$/.test(
      n,
    ) ||
    /^(alt|alternate)\s*2$/.test(n)
  )
    return "opt3";

  if (/b-?roll|visual idea|search query|stock/.test(n)) return "opt1";
  return "ignore";
}

export function parseTimeRange(raw: string): { start?: number; end?: number } {
  const s = raw.trim();
  if (!s) return {};

  const secRange = s.match(
    /^(\d+(?:\.\d+)?)\s*[-–—to]+\s*(\d+(?:\.\d+)?)\s*(sec(onds?)?)?$/i,
  );
  if (secRange) {
    return {
      start: Number(secRange[1]),
      end: Number(secRange[2]),
    };
  }

  const m = s.match(
    /^(\d+:\d{1,2}(?:\.\d+)?|\d+(?:\.\d+)?)\s*[-–—to]+\s*(\d+:\d{1,2}(?:\.\d+)?|\d+(?:\.\d+)?)(?:\s*sec(?:onds?)?)?$/i,
  );
  if (m) {
    return {
      start: parseTimeToken(m[1]!),
      end: parseTimeToken(m[2]!),
    };
  }
  const single = parseTimeToken(s);
  return single != null ? { start: single } : {};
}

export function extractTableGrid(raw: string): {
  grid?: TableGrid;
  error?: string;
} {
  const text = raw.replace(/^\uFEFF/, "").trim();
  if (!text) return { error: "Paste a table first." };

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trimEnd())
    .filter((l) => l.trim().length > 0);

  if (lines.length < 2) {
    return { error: "Need a header row plus at least one data row." };
  }

  let headers = splitLine(lines[0]!);
  let dataStart = 1;
  if (lines[1] && isSeparatorRow(splitLine(lines[1]!))) {
    dataStart = 2;
  }

  const guessed = headers.map(classifyHeader);
  const anyKnown = guessed.some((r) => r !== "ignore");
  const firstLooksLikeData =
    !anyKnown &&
    headers.some((c) => c.length > 24 || /[.!?]/.test(c) || /^\d+$/.test(c));

  if (firstLooksLikeData) {
    dataStart = 0;
    const width = Math.max(
      ...lines.map((l) => splitLine(l).length),
      headers.length,
    );
    headers = Array.from({ length: width }, (_, i) => `Column ${i + 1}`);
  }

  const rows: string[][] = [];
  for (let li = dataStart; li < lines.length; li++) {
    const cells = splitLine(lines[li]!);
    if (isSeparatorRow(cells)) continue;
    if (cells.every((c) => !c.trim())) continue;
    const padded = [...cells];
    while (padded.length < headers.length) padded.push("");
    rows.push(padded.slice(0, Math.max(headers.length, cells.length)));
  }

  const maxW = Math.max(headers.length, ...rows.map((r) => r.length));
  while (headers.length < maxW) {
    headers.push(`Column ${headers.length + 1}`);
  }
  for (const r of rows) {
    while (r.length < maxW) r.push("");
  }

  if (!rows.length) return { error: "No data rows found." };
  return { grid: { headers, rows } };
}

export function guessColumnRoles(headers: string[]): ColRole[] {
  const roles = headers.map(classifyHeader);
  const hasText = roles.includes("text");
  const hasOpt = roles.some(
    (r) => r === "opt1" || r === "opt2" || r === "opt3",
  );
  if (hasText && hasOpt) return roles;

  const out = headers.map(() => "ignore" as ColRole);
  let oi = 0;
  const optSlots: ColRole[] = ["opt1", "opt2", "opt3"];
  for (let i = 0; i < headers.length; i++) {
    const h = headers[i]!.toLowerCase();
    if (
      /transcript|spoken|script|quote|dialogue|text/.test(h) &&
      !roles.includes("text")
    ) {
      out[i] = "text";
      continue;
    }
    if (/timestamp|time|duration|start|end/.test(h)) {
      out[i] = /start/.test(h)
        ? "start"
        : /end/.test(h)
          ? "end"
          : /duration/.test(h)
            ? "duration"
            : "timeRange";
      continue;
    }
    if (/b-?roll|option|visual|query|shot/.test(h) || roles[i] === "opt1") {
      if (oi < 3) out[i] = optSlots[oi++]!;
      continue;
    }
    if (!out.includes("text") && i === 0 && !/^scene|#|no/.test(h)) {
      out[i] = "text";
      continue;
    }
  }

  if (!out.includes("text")) {
    for (let i = 0; i < headers.length; i++) {
      if (out[i] === "ignore" && !/^scene|^#|column 1$/i.test(headers[i]!)) {
        if (i === 0 && headers.length > 2) continue;
        out[i] = "text";
        break;
      }
    }
    if (!out.includes("text") && headers.length > 0) out[0] = "text";
  }

  for (let i = 0; i < headers.length && oi < 3; i++) {
    if (out[i] === "ignore") {
      const h = headers[i]!.toLowerCase();
      if (/feeling|overlay|story|note|editor|scene/.test(h)) continue;
      out[i] = optSlots[oi++]!;
    }
  }

  return out;
}

export function applyColumnMap(
  grid: TableGrid,
  roles: ColRole[],
): ParseResult {
  const warnings: string[] = [];
  if (!roles.includes("text") && !roles.some((r) => r.startsWith("opt"))) {
    return {
      rows: [],
      error: "Map at least Spoken/transcript or a B-roll option.",
      warnings,
    };
  }

  const rows: ImportRow[] = [];
  for (const cells of grid.rows) {
    const get = (role: ColRole) => {
      const idx = roles.indexOf(role);
      return idx >= 0 ? (cells[idx] ?? "").trim() : "";
    };

    const optValues: string[] = [];
    for (let i = 0; i < roles.length; i++) {
      if (
        (roles[i] === "opt1" ||
          roles[i] === "opt2" ||
          roles[i] === "opt3") &&
        cells[i]?.trim()
      ) {
        optValues.push(cells[i]!.trim());
      }
    }

    const textVal = get("text");
    const option1 = optValues[0] ?? "";
    const option2 = optValues[1] ?? "";
    const option3 = optValues[2] ?? "";

    if (!textVal && !option1) continue;

    let startSec = parseTimeToken(get("start"));
    let endSec = parseTimeToken(get("end"));
    let durationSec = parseTimeToken(get("duration"));
    const range = parseTimeRange(get("timeRange"));
    if (startSec == null && range.start != null) startSec = range.start;
    if (endSec == null && range.end != null) endSec = range.end;
    if (
      durationSec == null &&
      startSec != null &&
      endSec != null &&
      endSec > startSec
    ) {
      durationSec = endSec - startSec;
    }

    rows.push({
      text: textVal || option1,
      startSec,
      endSec,
      durationSec,
      option1: option1 || option2 || option3,
      option2: option1 ? option2 : option3,
      option3: option1 && option2 ? option3 : "",
    });
  }

  if (!rows.length) {
    return {
      rows: [],
      error: "No data rows after mapping. Check column roles.",
      warnings,
    };
  }
  return { rows, warnings };
}

export function parseBrollTable(raw: string): ParseResult {
  const extracted = extractTableGrid(raw);
  if (extracted.error || !extracted.grid) {
    return { rows: [], error: extracted.error, warnings: [] };
  }
  const roles = guessColumnRoles(extracted.grid.headers);
  return applyColumnMap(extracted.grid, roles);
}

export function rowsToChunks(
  rows: ImportRow[],
  settings: ProjectSettings,
): Chunk[] {
  const wordsPerSec = settings.speakingWpm / 60;
  let cursor = 0;

  return rows.map((row, index) => {
    const words = row.text.split(/\s+/).filter(Boolean).length;
    let durationSec =
      row.durationSec ??
      (row.startSec != null && row.endSec != null
        ? Math.max(1, row.endSec - row.startSec)
        : Math.min(
            12,
            Math.max(5, words / wordsPerSec || settings.chunkSeconds),
          ));

    let startSec = row.startSec ?? cursor;
    let endSec = row.endSec ?? startSec + durationSec;
    if (row.endSec == null && row.startSec != null) {
      endSec = startSec + durationSec;
    }
    durationSec = Math.max(1, endSec - startSec);
    cursor = endSec;

    const opts = [row.option1, row.option2, row.option3]
      .map((o) => o.trim())
      .filter(Boolean);
    const primary = opts[0] || inventFallbackQuery(row.text);
    const alts = opts.slice(1);

    return {
      id: uid(),
      index,
      text: row.text,
      startSec: +startSec.toFixed(2),
      endSec: +endSec.toFixed(2),
      durationSec: +durationSec.toFixed(2),
      visualIdea: primary,
      searchQuery: primary,
      altQueries: alts,
      activeQuery: primary,
      results: [],
      selectedId: null,
      mediaPreference: "video" as const,
      status: "idle" as const,
      source: "import" as const,
    };
  });
}

function inventFallbackQuery(text: string): string {
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 4);
  return words.length
    ? `${words.join(" ")} cinematic footage`
    : "cinematic lifestyle b-roll";
}

export const SAMPLE_NOTION_TABLE = `Scene	Timestamp	Transcript Quote	B-roll 1	B-roll 2	B-roll 3	Feeling / Story to show	Optional text overlays
1	0-6 sec	"When it comes to staying on top of nutrition, I don't just wing it."	Desk with nutrition textbooks and printed research stacked neatly.	Calendar with seminar dates circled.	Bold text hook: "I don't wing it."	Setup: credibility, not casualness.	Not guesswork
2	6-13 sec	"I went and got extra training - the functional nutrition and metabolic specialist course."	Laptop open to a course portal/certificate page.	Close-up of course completion certificate.	Notes page with metabolic specialist course headings.	Investment in real education.	Extra training. Real credentials.
3	13-20 sec	"We also have a clinical nutritionist on staff."	Two practitioners in consultation, reviewing a chart.	Clinical nutritionist typing notes at a desk.	Staff meeting around a table with files.	Team depth, not a solo operation.	A clinical nutritionist on staff
4	20-27 sec	"The whole team attends seminars together to stay current on new programming."	Seminar room with practitioners taking notes.	Conference badge/lanyard close-up.	Group discussion around a whiteboard.	Ongoing, collective learning.	The whole team stays current
5	27-34 sec	"Beyond that, I'm tied into research colleges - Johns Hopkins, USC, Penn State, Stanford."	Stack of research papers with university letterheads.	Generic university campus/library exterior shot.	Text card listing the four institutions.	Elite research network.	Johns Hopkins. USC. Penn State. Stanford.
`;
