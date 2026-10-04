import { createServerFn } from "@tanstack/react-start";
import type { MediaKind, StockClip, StockProvider } from "./types";

export type SearchStockInput = {
  query: string;
  pexelsKey?: string;
  pixabayKey?: string;
  youtubeKey?: string;
  preferVideo?: boolean;
  includePhotos?: boolean;
  perPage?: number;
  /** Bust any accidental server/browser caching of search responses */
  nonce?: string;
};

type Orient = "portrait" | "landscape";

function idOf(provider: StockProvider, kind: MediaKind, raw: string | number) {
  return `${provider}_${kind}_${raw}`;
}

function isVertical(w: number, h: number): boolean {
  if (!w || !h) return false;
  return h > w;
}

function orientLabel(o: Orient): string {
  return o === "portrait" ? "vertical" : "landscape";
}

/**
 * Stock APIs rank short keyword queries far better than full sentences.
 * Keep the visual meaning, drop punctuation/quotes and cap length.
 */
export function cleanStockQuery(raw: string): string {
  const cleaned = raw
    .replace(/[“”"'`]/g, "")
    .replace(/[.:;!?()[\]{}]/g, " ")
    .replace(/[–—-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return raw.trim();
  const words = cleaned.split(" ").filter(Boolean);
  // Drop filler words that don't help stock search
  const stop = new Set([
    "a",
    "an",
    "the",
    "with",
    "and",
    "of",
    "to",
    "for",
    "on",
    "in",
    "at",
    "from",
    "into",
    "that",
    "this",
    "is",
    "are",
    "was",
    "were",
    "be",
    "as",
    "it",
    "its",
  ]);
  const meaningful = words.filter((w) => !stop.has(w.toLowerCase()) || w.length > 3);
  const use = (meaningful.length >= 2 ? meaningful : words).slice(0, 10);
  return use.join(" ") || cleaned.slice(0, 80);
}

function hasMedia(c: StockClip): boolean {
  if (c.provider === "youtube" || c.linkOnly) {
    return Boolean(c.pageUrl && (c.thumbUrl || c.previewUrl));
  }
  return Boolean(c.thumbUrl || c.previewUrl || c.downloadUrl);
}

/** Prefer the best file for the requested orientation. */
function pickVideoFile(
  files: Array<{
    quality?: string;
    file_type?: string;
    width: number;
    height: number;
    link: string;
  }>,
  orient: Orient,
) {
  const mp4 = files.filter((f) =>
    (f.file_type ?? "video/mp4").toLowerCase().includes("mp4"),
  );
  const pool = (mp4.length ? mp4 : files).filter((f) => f.link);
  if (!pool.length) return undefined;

  const ranked = [...pool].sort((a, b) => {
    const aVert = a.height > a.width ? 1 : 0;
    const bVert = b.height > b.width ? 1 : 0;
    if (orient === "portrait" && aVert !== bVert) return bVert - aVert;
    if (orient === "landscape" && aVert !== bVert) return aVert - bVert;
    const score = (f: { width: number; height: number }) => {
      const long = Math.max(f.width, f.height);
      if (long >= 1080 && long <= 1920) return 3;
      if (long >= 720) return 2;
      return 1;
    };
    return score(b) - score(a) || b.width * b.height - a.width * a.height;
  });
  return ranked[0];
}

async function searchPexelsVideos(
  key: string,
  query: string,
  perPage: number,
  orient: Orient,
): Promise<StockClip[]> {
  const url = new URL("https://api.pexels.com/videos/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(Math.min(perPage, 80)));
  url.searchParams.set("orientation", orient);

  const res = await fetch(url, {
    headers: { Authorization: key },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Pexels video ${res.status}: ${body.slice(0, 120)}`);
  }
  const data = (await res.json()) as {
    videos?: Array<{
      id: number;
      url: string;
      image: string;
      duration: number;
      width?: number;
      height?: number;
      user?: { name?: string };
      video_files?: Array<{
        id: number;
        quality: string;
        file_type: string;
        width: number;
        height: number;
        link: string;
      }>;
      video_pictures?: Array<{ picture: string }>;
    }>;
  };

  return (data.videos ?? [])
    .map((v) => {
      const files = v.video_files ?? [];
      const download = pickVideoFile(files, orient);
      const preview =
        pickVideoFile(
          files.filter((f) => Math.max(f.width, f.height) <= 1280),
          orient,
        ) ?? download;
      const thumb = v.video_pictures?.[0]?.picture ?? v.image ?? "";
      const w = download?.width ?? v.width ?? 0;
      const h = download?.height ?? v.height ?? 0;

      return {
        id: idOf("pexels", "video", v.id),
        provider: "pexels" as const,
        kind: "video" as const,
        title: `Pexels video #${v.id}`,
        photographer: v.user?.name ?? "Pexels",
        pageUrl: v.url,
        thumbUrl: thumb,
        previewUrl: preview?.link ?? download?.link ?? "",
        downloadUrl: download?.link ?? "",
        width: w,
        height: h,
        durationSec: v.duration,
        matchNote: `Video · ${orientLabel(orient)} · ${query}`,
      };
    })
    .filter(hasMedia);
}

async function searchPexelsPhotos(
  key: string,
  query: string,
  perPage: number,
  orient: Orient,
): Promise<StockClip[]> {
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(Math.min(perPage, 80)));
  url.searchParams.set("orientation", orient);

  const res = await fetch(url, {
    headers: { Authorization: key },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Pexels photos ${res.status}`);
  const data = (await res.json()) as {
    photos?: Array<{
      id: number;
      url: string;
      photographer: string;
      width: number;
      height: number;
      src: {
        large2x?: string;
        large?: string;
        medium?: string;
        original?: string;
      };
      alt?: string;
    }>;
  };

  return (data.photos ?? [])
    .map((p) => ({
      id: idOf("pexels", "photo", p.id),
      provider: "pexels" as const,
      kind: "photo" as const,
      title: p.alt || `Pexels photo #${p.id}`,
      photographer: p.photographer,
      pageUrl: p.url,
      thumbUrl: p.src.medium || p.src.large || "",
      previewUrl: p.src.large2x || p.src.large || p.src.original || "",
      downloadUrl: p.src.original || p.src.large2x || p.src.large || "",
      width: p.width,
      height: p.height,
      matchNote: `Photo · ${orientLabel(orient)} · ${query}`,
    }))
    .filter(hasMedia);
}

async function searchPixabayVideos(
  key: string,
  query: string,
  perPage: number,
  orient: Orient,
): Promise<StockClip[]> {
  // No orientation param on Pixabay videos — fetch extra and filter by dimensions
  const url = new URL("https://pixabay.com/api/videos/");
  url.searchParams.set("key", key);
  url.searchParams.set("q", query);
  url.searchParams.set(
    "per_page",
    String(Math.min(Math.max(perPage * 2, 3), 200)),
  );
  url.searchParams.set("safesearch", "true");

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Pixabay video ${res.status}`);
  const data = (await res.json()) as {
    hits?: Array<{
      id: number;
      pageURL: string;
      user: string;
      duration: number;
      videos?: {
        large?: { url: string; width: number; height: number };
        medium?: { url: string; width: number; height: number };
        small?: { url: string; width: number; height: number };
        tiny?: { url: string; width: number; height: number };
      };
      picture_id?: string;
    }>;
  };

  const mapped = (data.hits ?? []).map((h) => {
    const vids = h.videos ?? {};
    const candidates = [vids.large, vids.medium, vids.small, vids.tiny].filter(
      Boolean,
    ) as Array<{ url: string; width: number; height: number }>;
    const preferVert = orient === "portrait";
    const ranked = [...candidates].sort((a, b) => {
      const aV = a.height > a.width ? 1 : 0;
      const bV = b.height > b.width ? 1 : 0;
      if (preferVert && aV !== bV) return bV - aV;
      if (!preferVert && aV !== bV) return aV - bV;
      return b.width * b.height - a.width * a.height;
    });
    const download = ranked[0];
    const preview =
      ranked.find((c) => Math.max(c.width, c.height) <= 1280) ?? download;
    const thumb = h.picture_id
      ? `https://i.vimeocdn.com/video/${h.picture_id}_295x166.jpg`
      : "";
    return {
      id: idOf("pixabay", "video", h.id),
      provider: "pixabay" as const,
      kind: "video" as const,
      title: `Pixabay video #${h.id}`,
      photographer: h.user,
      pageUrl: h.pageURL,
      thumbUrl: thumb,
      previewUrl: preview?.url ?? "",
      downloadUrl: download?.url ?? "",
      width: download?.width ?? 0,
      height: download?.height ?? 0,
      durationSec: h.duration,
      matchNote: `Video · ${orientLabel(orient)} · ${query}`,
    };
  });

  const filtered = mapped.filter((c) => {
    if (!hasMedia(c)) return false;
    if (!c.width || !c.height) return true;
    return orient === "portrait"
      ? isVertical(c.width, c.height)
      : !isVertical(c.width, c.height);
  });

  // If orientation filter emptied the list, keep any with media
  const pool = filtered.length ? filtered : mapped.filter(hasMedia);
  return pool.slice(0, perPage);
}

async function searchPixabayPhotos(
  key: string,
  query: string,
  perPage: number,
  orient: Orient,
): Promise<StockClip[]> {
  const url = new URL("https://pixabay.com/api/");
  url.searchParams.set("key", key);
  url.searchParams.set("q", query);
  url.searchParams.set("image_type", "photo");
  url.searchParams.set(
    "orientation",
    orient === "portrait" ? "vertical" : "horizontal",
  );
  url.searchParams.set("per_page", String(Math.min(Math.max(perPage, 3), 200)));
  url.searchParams.set("safesearch", "true");

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Pixabay photos ${res.status}`);
  const data = (await res.json()) as {
    hits?: Array<{
      id: number;
      pageURL: string;
      user: string;
      webformatURL: string;
      largeImageURL: string;
      fullHDURL?: string;
      imageWidth: number;
      imageHeight: number;
      tags?: string;
    }>;
  };

  return (data.hits ?? [])
    .map((h) => ({
      id: idOf("pixabay", "photo", h.id),
      provider: "pixabay" as const,
      kind: "photo" as const,
      title: h.tags || `Pixabay photo #${h.id}`,
      photographer: h.user,
      pageUrl: h.pageURL,
      thumbUrl: h.webformatURL,
      previewUrl: h.largeImageURL || h.webformatURL,
      downloadUrl: h.fullHDURL || h.largeImageURL || h.webformatURL,
      width: h.imageWidth,
      height: h.imageHeight,
      matchNote: `Photo · ${orientLabel(orient)} · ${query}`,
    }))
    .filter(hasMedia);
}

async function searchYouTube(
  key: string,
  query: string,
  perPage: number,
  preferVertical: boolean,
): Promise<StockClip[]> {
  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set(
    "q",
    preferVertical ? `${query} vertical 9:16 b-roll` : `${query} b-roll`,
  );
  url.searchParams.set("maxResults", String(Math.min(perPage, 25)));
  url.searchParams.set("videoEmbeddable", "true");
  url.searchParams.set("safeSearch", "moderate");
  url.searchParams.set("key", key);

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`YouTube ${res.status}: ${body.slice(0, 120)}`);
  }
  const data = (await res.json()) as {
    items?: Array<{
      id?: { videoId?: string };
      snippet?: {
        title?: string;
        channelTitle?: string;
        thumbnails?: {
          medium?: { url?: string; width?: number; height?: number };
          high?: { url?: string };
        };
      };
    }>;
  };

  return (data.items ?? [])
    .filter((it) => it.id?.videoId)
    .map((it) => {
      const vid = it.id!.videoId!;
      const sn = it.snippet ?? {};
      const thumbs = sn.thumbnails ?? {};
      return {
        id: idOf("youtube", "video", vid),
        provider: "youtube" as const,
        kind: "video" as const,
        title: sn.title ?? `YouTube ${vid}`,
        photographer: sn.channelTitle ?? "YouTube",
        pageUrl: `https://www.youtube.com/watch?v=${vid}`,
        thumbUrl: thumbs.medium?.url ?? thumbs.high?.url ?? "",
        previewUrl: thumbs.high?.url ?? thumbs.medium?.url ?? "",
        downloadUrl: "",
        width: thumbs.medium?.width ?? 320,
        height: thumbs.medium?.height ?? 180,
        matchNote: preferVertical
          ? `YouTube · vertical bias · ${query}`
          : `YouTube · ${query}`,
        linkOnly: true,
      };
    })
    .filter(hasMedia);
}

function mergeUnique(base: StockClip[], extra: StockClip[]): StockClip[] {
  const seen = new Set(base.map((c) => c.id));
  const out = [...base];
  for (const c of extra) {
    if (seen.has(c.id)) continue;
    seen.add(c.id);
    out.push(c);
  }
  return out;
}

/**
 * Portrait first. Always try landscape when vertical is thin/empty
 * so we never ship blank sections from orientation alone.
 */
async function searchWithOrientationFallback(
  search: (orient: Orient) => Promise<StockClip[]>,
  perPage: number,
  minVertical = 4,
): Promise<{ clips: StockClip[]; errors: string[] }> {
  const errors: string[] = [];
  let portrait: StockClip[] = [];
  let landscape: StockClip[] = [];

  try {
    portrait = await search("portrait");
  } catch (e) {
    errors.push(String((e as Error)?.message || e));
    portrait = [];
  }

  // Always fill with landscape when vertical is thin OR total is empty
  if (portrait.length < minVertical) {
    try {
      landscape = await search("landscape");
    } catch (e) {
      errors.push(String((e as Error)?.message || e));
      landscape = [];
    }
  }

  const merged = mergeUnique(portrait, landscape).filter(hasMedia);
  merged.sort((a, b) => {
    const aV = isVertical(a.width, a.height) ? 0 : 1;
    const bV = isVertical(b.width, b.height) ? 0 : 1;
    return aV - bV;
  });
  return { clips: merged.slice(0, Math.max(perPage * 2, perPage)), errors };
}

export const searchStock = createServerFn({ method: "POST" })
  .validator((data: SearchStockInput) => data)
  .handler(async ({ data }) => {
    const rawQuery = (data.query || "").trim();
    const query = cleanStockQuery(rawQuery);
    if (!query) {
      return {
        clips: [] as StockClip[],
        errors: ["Empty query"],
        hadKeys: false,
        videoCount: 0,
        photoCount: 0,
        youtubeCount: 0,
        queryUsed: "",
      };
    }

    const perPage = Math.min(Math.max(data.perPage ?? 15, 6), 30);
    const preferVideo = data.preferVideo !== false;
    const includePhotos = data.includePhotos !== false;
    const videos: StockClip[] = [];
    const photos: StockClip[] = [];
    const youtube: StockClip[] = [];
    const errors: string[] = [];

    const tasks: Promise<void>[] = [];
    const minVertical = Math.max(3, Math.floor(perPage / 4));

    if (preferVideo) {
      if (data.pexelsKey?.trim()) {
        tasks.push(
          (async () => {
            const { clips, errors: e } = await searchWithOrientationFallback(
              (orient) =>
                searchPexelsVideos(
                  data.pexelsKey!.trim(),
                  query,
                  perPage,
                  orient,
                ),
              perPage,
              minVertical,
            );
            videos.push(...clips);
            errors.push(...e);
          })(),
        );
      }
      if (data.pixabayKey?.trim()) {
        tasks.push(
          (async () => {
            const { clips, errors: e } = await searchWithOrientationFallback(
              (orient) =>
                searchPixabayVideos(
                  data.pixabayKey!.trim(),
                  query,
                  perPage,
                  orient,
                ),
              perPage,
              minVertical,
            );
            videos.push(...clips);
            errors.push(...e);
          })(),
        );
      }
    }

    if (data.youtubeKey?.trim()) {
      tasks.push(
        (async () => {
          try {
            let yt = await searchYouTube(
              data.youtubeKey!.trim(),
              query,
              Math.min(perPage, 12),
              true,
            );
            if (yt.length < 3) {
              const more = await searchYouTube(
                data.youtubeKey!.trim(),
                query,
                Math.min(perPage, 12),
                false,
              );
              yt = mergeUnique(yt, more);
            }
            youtube.push(...yt);
          } catch (e) {
            errors.push(String((e as Error)?.message || e));
          }
        })(),
      );
    }

    if (includePhotos) {
      const photoCount = Math.min(perPage, 12);
      if (data.pexelsKey?.trim()) {
        tasks.push(
          (async () => {
            const { clips, errors: e } = await searchWithOrientationFallback(
              (orient) =>
                searchPexelsPhotos(
                  data.pexelsKey!.trim(),
                  query,
                  photoCount,
                  orient,
                ),
              photoCount,
              Math.max(2, Math.floor(photoCount / 4)),
            );
            photos.push(...clips);
            errors.push(...e);
          })(),
        );
      }
      if (data.pixabayKey?.trim()) {
        tasks.push(
          (async () => {
            const { clips, errors: e } = await searchWithOrientationFallback(
              (orient) =>
                searchPixabayPhotos(
                  data.pixabayKey!.trim(),
                  query,
                  photoCount,
                  orient,
                ),
              photoCount,
              Math.max(2, Math.floor(photoCount / 4)),
            );
            photos.push(...clips);
            errors.push(...e);
          })(),
        );
      }
    }

    await Promise.all(tasks);

    const rank = (c: StockClip) => {
      const vert = isVertical(c.width, c.height);
      if (c.provider === "youtube") return 40;
      if (c.kind === "video" && vert) return 0;
      if (c.kind === "video") return 10;
      if (c.kind === "photo" && vert) return 20;
      return 30;
    };

    const combined = [...videos, ...photos, ...youtube].filter(hasMedia);
    const seen = new Set<string>();
    const unique = combined
      .filter((c) => {
        if (seen.has(c.id)) return false;
        seen.add(c.id);
        return true;
      })
      .sort((a, b) => rank(a) - rank(b));

    return {
      clips: unique.slice(0, perPage * 4),
      errors,
      hadKeys: Boolean(
        data.pexelsKey?.trim() ||
          data.pixabayKey?.trim() ||
          data.youtubeKey?.trim(),
      ),
      videoCount: videos.length,
      photoCount: photos.length,
      youtubeCount: youtube.length,
      queryUsed: query,
    };
  });

export const proxyDownload = createServerFn({ method: "POST" })
  .validator((data: { url: string; filename: string }) => data)
  .handler(async ({ data }) => {
    const res = await fetch(data.url, {
      headers: {
        "User-Agent": "BRollFinder/1.0",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Download failed: ${res.status}`);
    }
    const buf = await res.arrayBuffer();
    const b64 = Buffer.from(buf).toString("base64");
    const contentType =
      res.headers.get("content-type") || "application/octet-stream";
    return {
      base64: b64,
      contentType,
      filename: data.filename,
    };
  });
