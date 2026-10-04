import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stock-api-DMhxmLXP.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function idOf(provider, kind, raw) {
	return `${provider}_${kind}_${raw}`;
}
async function searchPexelsVideos(key, query, perPage) {
	const url = new URL("https://api.pexels.com/videos/search");
	url.searchParams.set("query", query);
	url.searchParams.set("per_page", String(perPage));
	url.searchParams.set("orientation", "landscape");
	const res = await fetch(url, { headers: { Authorization: key } });
	if (!res.ok) {
		const body = await res.text().catch(() => "");
		throw new Error(`Pexels video ${res.status}: ${body.slice(0, 120)}`);
	}
	return ((await res.json()).videos ?? []).map((v) => {
		const files = [...v.video_files ?? []].sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
		const download = files.find((f) => f.width >= 1280 && f.width <= 1920 && f.file_type.includes("mp4")) ?? files.find((f) => f.file_type.includes("mp4")) ?? files[0];
		const preview = files.find((f) => f.width <= 960 && f.file_type.includes("mp4")) ?? download;
		const thumb = v.video_pictures?.[0]?.picture ?? v.image ?? "";
		return {
			id: idOf("pexels", "video", v.id),
			provider: "pexels",
			kind: "video",
			title: `Pexels video #${v.id}`,
			photographer: v.user?.name ?? "Pexels",
			pageUrl: v.url,
			thumbUrl: thumb,
			previewUrl: preview?.link ?? "",
			downloadUrl: download?.link ?? "",
			width: download?.width ?? 0,
			height: download?.height ?? 0,
			durationSec: v.duration,
			matchNote: `Video · ${query}`
		};
	});
}
async function searchPexelsPhotos(key, query, perPage) {
	const url = new URL("https://api.pexels.com/v1/search");
	url.searchParams.set("query", query);
	url.searchParams.set("per_page", String(perPage));
	url.searchParams.set("orientation", "landscape");
	const res = await fetch(url, { headers: { Authorization: key } });
	if (!res.ok) throw new Error(`Pexels photos ${res.status}`);
	return ((await res.json()).photos ?? []).map((p) => ({
		id: idOf("pexels", "photo", p.id),
		provider: "pexels",
		kind: "photo",
		title: p.alt || `Pexels photo #${p.id}`,
		photographer: p.photographer,
		pageUrl: p.url,
		thumbUrl: p.src.medium ?? p.src.large ?? "",
		previewUrl: p.src.large2x ?? p.src.large ?? p.src.original ?? "",
		downloadUrl: p.src.original ?? p.src.large2x ?? p.src.large ?? "",
		width: p.width,
		height: p.height,
		matchNote: `Photo fallback · ${query}`
	}));
}
async function searchPixabayVideos(key, query, perPage) {
	const url = new URL("https://pixabay.com/api/videos/");
	url.searchParams.set("key", key);
	url.searchParams.set("q", query);
	url.searchParams.set("per_page", String(Math.min(perPage, 20)));
	url.searchParams.set("safesearch", "true");
	url.searchParams.set("video_type", "film");
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Pixabay video ${res.status}`);
	return ((await res.json()).hits ?? []).map((h) => {
		const v = h.videos ?? {};
		const download = v.large ?? v.medium ?? v.small ?? v.tiny;
		const preview = v.small ?? v.medium ?? v.tiny ?? v.large;
		const thumb = h.picture_id ? `https://i.vimeocdn.com/video/${h.picture_id}_295x166.jpg` : "";
		return {
			id: idOf("pixabay", "video", h.id),
			provider: "pixabay",
			kind: "video",
			title: `Pixabay video #${h.id}`,
			photographer: h.user,
			pageUrl: h.pageURL,
			thumbUrl: thumb,
			previewUrl: preview?.url ?? "",
			downloadUrl: download?.url ?? "",
			width: download?.width ?? 0,
			height: download?.height ?? 0,
			durationSec: h.duration,
			matchNote: `Video · ${query}`
		};
	});
}
async function searchPixabayPhotos(key, query, perPage) {
	const url = new URL("https://pixabay.com/api/");
	url.searchParams.set("key", key);
	url.searchParams.set("q", query);
	url.searchParams.set("image_type", "photo");
	url.searchParams.set("orientation", "horizontal");
	url.searchParams.set("safesearch", "true");
	url.searchParams.set("per_page", String(Math.min(perPage, 20)));
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Pixabay photos ${res.status}`);
	return ((await res.json()).hits ?? []).map((h) => ({
		id: idOf("pixabay", "photo", h.id),
		provider: "pixabay",
		kind: "photo",
		title: h.tags?.split(",")[0]?.trim() || `Pixabay #${h.id}`,
		photographer: h.user,
		pageUrl: h.pageURL,
		thumbUrl: h.webformatURL,
		previewUrl: h.largeImageURL,
		downloadUrl: h.fullHDURL ?? h.largeImageURL,
		width: h.imageWidth,
		height: h.imageHeight,
		matchNote: `Photo fallback · ${query}`
	}));
}
var searchStock_createServerFn_handler = createServerRpc({
	id: "7066de57cf1728a9992ccb32693a9e4815bb14f8c91f40498e8e601eea636275",
	name: "searchStock",
	filename: "src/lib/broll/stock-api.ts"
}, (opts) => searchStock.__executeServer(opts));
var searchStock = createServerFn({ method: "POST" }).validator((data) => data).handler(searchStock_createServerFn_handler, async ({ data }) => {
	const query = (data.query || "").trim();
	if (!query) return {
		clips: [],
		errors: ["Empty query"],
		hadKeys: false,
		videoCount: 0,
		photoCount: 0
	};
	const perPage = data.perPage ?? 6;
	const preferVideo = data.preferVideo !== false;
	const includePhotos = data.includePhotos !== false;
	const videos = [];
	const photos = [];
	const errors = [];
	const tasks = [];
	if (preferVideo) {
		if (data.pexelsKey?.trim()) tasks.push((async () => {
			try {
				videos.push(...await searchPexelsVideos(data.pexelsKey.trim(), query, perPage));
			} catch (e) {
				errors.push(String(e?.message || e));
			}
		})());
		if (data.pixabayKey?.trim()) tasks.push((async () => {
			try {
				videos.push(...await searchPixabayVideos(data.pixabayKey.trim(), query, perPage));
			} catch (e) {
				errors.push(String(e?.message || e));
			}
		})());
	}
	await Promise.all(tasks);
	if (includePhotos && (videos.length < 3 || !preferVideo)) {
		const photoTasks = [];
		if (data.pexelsKey?.trim()) photoTasks.push((async () => {
			try {
				photos.push(...await searchPexelsPhotos(data.pexelsKey.trim(), query, perPage));
			} catch (e) {
				errors.push(String(e?.message || e));
			}
		})());
		if (data.pixabayKey?.trim()) photoTasks.push((async () => {
			try {
				photos.push(...await searchPixabayPhotos(data.pixabayKey.trim(), query, perPage));
			} catch (e) {
				errors.push(String(e?.message || e));
			}
		})());
		await Promise.all(photoTasks);
	}
	const combined = [...videos, ...photos].filter((c) => c.downloadUrl || c.previewUrl);
	const seen = /* @__PURE__ */ new Set();
	return {
		clips: combined.filter((c) => {
			const k = c.downloadUrl || c.id;
			if (seen.has(k)) return false;
			seen.add(k);
			return true;
		}).slice(0, perPage * 2),
		errors,
		hadKeys: Boolean(data.pexelsKey?.trim() || data.pixabayKey?.trim()),
		videoCount: videos.length,
		photoCount: photos.length
	};
});
var proxyDownload_createServerFn_handler = createServerRpc({
	id: "4d4dc089e7068c85278fb39612fa7ea245f7642a2c1cef005820c908a7646c08",
	name: "proxyDownload",
	filename: "src/lib/broll/stock-api.ts"
}, (opts) => proxyDownload.__executeServer(opts));
var proxyDownload = createServerFn({ method: "POST" }).validator((data) => data).handler(proxyDownload_createServerFn_handler, async ({ data }) => {
	const res = await fetch(data.url, {
		headers: {
			"User-Agent": "BRollFinder/1.0",
			Accept: "*/*"
		},
		redirect: "follow"
	});
	if (!res.ok) throw new Error(`Download failed (${res.status})`);
	const buf = await res.arrayBuffer();
	const contentType = res.headers.get("content-type") || "application/octet-stream";
	const bytes = new Uint8Array(buf);
	let binary = "";
	const chunk = 32768;
	for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
	return {
		base64: btoa(binary),
		contentType,
		filename: data.filename,
		size: bytes.length
	};
});
//#endregion
export { proxyDownload_createServerFn_handler, searchStock_createServerFn_handler };
