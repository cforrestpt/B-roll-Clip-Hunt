import { proxyDownload } from "./stock-api";
import type { StockClip } from "./types";

function extFor(clip: StockClip): string {
  if (clip.kind === "video") return "mp4";
  const u = clip.downloadUrl.toLowerCase();
  if (u.includes(".png")) return "png";
  if (u.includes(".webp")) return "webp";
  return "jpg";
}

export function filenameFor(clip: StockClip, chunkIndex: number): string {
  const safe = clip.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `chunk-${String(chunkIndex + 1).padStart(2, "0")}-${clip.provider}-${safe || clip.id}.${extFor(clip)}`;
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function base64ToBlob(base64: string, contentType: string): Blob {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: contentType });
}

/** Try direct CORS download, fall back to server proxy. */
export async function downloadClip(
  clip: StockClip,
  chunkIndex: number,
): Promise<void> {
  if (clip.linkOnly || clip.provider === "youtube") {
    throw new Error("YouTube clips are link-only — open them on YouTube");
  }
  const url = clip.downloadUrl || clip.previewUrl;
  if (!url) throw new Error("No download URL for this clip");
  const filename = filenameFor(clip, chunkIndex);

  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    triggerBlobDownload(blob, filename);
    return;
  } catch {
    // proxy
  }

  const proxied = await proxyDownload({
    data: { url, filename },
  });
  const blob = base64ToBlob(proxied.base64, proxied.contentType);
  triggerBlobDownload(blob, filename);
}
