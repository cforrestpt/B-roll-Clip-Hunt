import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { c as HeadContent, d as Outlet, f as createFileRoute, p as createRootRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as Slot, t as Label$1 } from "../_libs/@radix-ui/react-label+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { a as Search, c as KeyRound, d as ExternalLink, f as Download, h as BookOpen, i as Settings2, l as Image, m as Check, n as Video, o as MicVocal, p as Clapperboard, r as User, s as LoaderCircle, t as X, u as Film } from "../_libs/lucide-react.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/@radix-ui/react-switch+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BDfw372N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-taxQGNgw.css";
var Route$1 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "B-Roll Finder — stock under your talking head" },
			{
				name: "description",
				content: "Paste a script, chop it into 5–10s chunks, find Pexels & Pixabay video, and download clips for your timeline."
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	component: RootComponent
});
function RootComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RootDocument, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
function RootDocument({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased dark",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "min-h-dvh bg-bg text-fg",
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})]
		})]
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] text-sm font-medium transition-[opacity,transform,background-color,border-color,color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-fg hover:opacity-90",
			secondary: "bg-bg-subtle text-fg border border-border hover:bg-bg-hover",
			outline: "border border-border-strong bg-transparent text-fg hover:bg-bg-subtle",
			ghost: "text-fg-muted hover:bg-bg-subtle hover:text-fg",
			danger: "bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25"
		},
		size: {
			default: "h-10 px-4 py-2",
			sm: "h-8 rounded-[var(--radius-xs)] px-3 text-xs",
			lg: "h-11 px-6",
			icon: "h-10 w-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-[var(--radius-xl)] border border-border bg-bg-elevated shadow-[var(--shadow-sm)]", className),
		...props
	});
}
function CardHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1.5 p-5 pb-0", className),
		...props
	});
}
function CardTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
		className: cn("text-base font-semibold tracking-tight text-fg", className),
		...props
	});
}
function CardDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cn("text-sm text-fg-muted text-pretty", className),
		...props
	});
}
function CardContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("p-5", className),
		...props
	});
}
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
	className: cn("flex min-h-[140px] w-full rounded-[var(--radius-md)] border border-border bg-bg px-3.5 py-3 text-sm text-fg placeholder:text-fg-subtle shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:border-border-strong disabled:cursor-not-allowed disabled:opacity-50 resize-y", className),
	ref,
	...props
}));
Textarea.displayName = "Textarea";
function uid() {
	return `c_${Math.random().toString(36).slice(2, 9)}`;
}
/** Split script into ~target-second spoken chunks (default 5–10s). */
function chunkScript(transcript, settings) {
	const cleaned = transcript.replace(/\r\n/g, "\n").trim();
	if (!cleaned) return [];
	const sentences = cleaned.split(/(?<=[.!?])\s+|\n+/).map((s) => s.replace(/\s+/g, " ").trim()).filter((s) => s.length > 3);
	const wordsPerSec = settings.speakingWpm / 60;
	const target = Math.min(10, Math.max(5, settings.chunkSeconds));
	const maxWords = Math.round(target * wordsPerSec);
	const minWords = Math.max(6, Math.round(5 * wordsPerSec));
	const groups = [];
	let buf = [];
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
	const flat = [];
	for (const g of groups) {
		const words = g.split(/\s+/).filter(Boolean);
		if (words.length <= maxWords + 4) {
			flat.push(g);
			continue;
		}
		for (let i = 0; i < words.length; i += maxWords) flat.push(words.slice(i, i + maxWords).join(" "));
	}
	let t = 0;
	return flat.map((text, index) => {
		const words = text.split(/\s+/).filter(Boolean).length;
		const durationSec = Math.min(12, Math.max(4.5, words / wordsPerSec));
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
			results: [],
			selectedId: null,
			mediaPreference: "video",
			status: "idle"
		};
	});
}
/** Turn spoken content into filmable stock search ideas (visual first). */
function inventVisualIdea(text) {
	const lower = text.toLowerCase();
	for (const r of [
		{
			test: /\b(morning|wake|bed|scrolling|phone in bed)\b/,
			idea: "Person in bed at dawn, blue phone glow on their face — then cut to putting the phone away",
			primary: "person checking phone in bed morning",
			alts: ["waking up in bed natural light", "putting phone down on nightstand"]
		},
		{
			test: /\b(deep work|focus|notifications|email|distraction)\b/,
			idea: "Clean desk, laptop open, hands typing; soft morning window light; no clutter",
			primary: "focused work laptop desk morning light",
			alts: ["turning off phone notifications", "minimalist home office typing"]
		},
		{
			test: /\b(habit|compound|decade|career growth|output)\b/,
			idea: "Time-lapse of a plant growing / calendar pages / path stretching into distance",
			primary: "plant growing time lapse",
			alts: ["long road stretching forward", "person climbing mountain trail"]
		},
		{
			test: /\b(muscle|train|skill|practice)\b/,
			idea: "Athlete training in a gym — slow-mo effort, sweat, repetition",
			primary: "athlete training gym slow motion",
			alts: ["person lifting weights focus", "runner training outdoors"]
		},
		{
			test: /\b(studio|light|window|mic|lav|frame|shot)\b/,
			idea: "Home studio setup: soft window light, ring/key light, microphone on desk",
			primary: "home video studio soft lighting",
			alts: ["podcast microphone desk setup", "creator filming talking head room"]
		},
		{
			test: /\b(export|youtube|vertical|caption)\b/,
			idea: "Creator editing timeline on screen, vertical phone preview beside desktop",
			primary: "video editing timeline computer screen",
			alts: ["content creator phone vertical video", "youtube studio workspace"]
		},
		{
			test: /\b(burned out|late night|exhausted|empty|grind)\b/,
			idea: "Person working alone at night under desk lamp — tired eyes, empty coffee",
			primary: "tired person working late night office",
			alts: ["exhausted worker laptop dark room", "empty coffee cup late night desk"]
		},
		{
			test: /\b(coast|trip|walk|ocean|beach|rest|slept)\b/,
			idea: "Wide coastal walk at golden hour — calm waves, bare feet on sand, no devices",
			primary: "walking on beach golden hour calm",
			alts: ["ocean waves peaceful shore", "person resting by the sea"]
		},
		{
			test: /\b(cook|meal|kitchen)\b/,
			idea: "Hands preparing a simple home-cooked meal — chopping, steam, warm kitchen light",
			primary: "cooking simple meal at home kitchen",
			alts: ["chopping vegetables wooden board", "steam rising from cooking pan"]
		},
		{
			test: /\b(creativity|clients|energy|permission)\b/,
			idea: "Person writing in a notebook by a window, then standing stretched and energized",
			primary: "creative person writing notebook by window",
			alts: ["happy professional meeting clients", "person stretching after work smiling"]
		},
		{
			test: /\b(welcome|episode|today we're|in this video|in this episode)\b/,
			idea: "Fast, inviting opener — city morning commute or creator hitting record",
			primary: "morning city sunrise establishing shot",
			alts: ["content creator starting camera", "coffee steam morning table"]
		},
		{
			test: /\b(tool|system|block)\b/,
			idea: "Close-up of productivity tools: calendar app, headphones on, focus mode",
			primary: "productivity tools headphones desk",
			alts: ["calendar planning notebook pen", "noise cancelling headphones work"]
		}
	]) if (r.test.test(lower)) return {
		idea: r.idea,
		primary: r.primary,
		alts: r.alts
	};
	const nouns = text.replace(/[^a-zA-Z\s]/g, " ").split(/\s+/).filter((w) => w.length > 4).filter((w) => !/^(about|would|could|should|their|there|these|those|which|where|while|after|before|today|video|episode|because|really|thing|things)$/i.test(w)).slice(0, 4);
	const primary = nouns.length >= 2 ? `${nouns.slice(0, 3).join(" ")} cinematic footage` : "cinematic lifestyle b-roll natural light";
	return {
		idea: `Visual that shows the feeling of this line — concrete action or place, not abstract text on screen. Search stock for: ${primary.replace(" cinematic footage", "")}.`,
		primary,
		alts: [nouns.slice(0, 2).join(" ") + " lifestyle video", "cinematic detail shot natural light"].filter((q) => q.trim().length > 8)
	};
}
function formatTimecode(sec) {
	return `${Math.floor(sec / 60)}:${(sec % 60).toFixed(1).padStart(4, "0")}`;
}
var SAMPLE_PODCAST = `Welcome back. Today we're talking about how small habits compound into massive career growth over a decade.

I used to start every morning scrolling my phone in bed. Now the first thirty minutes are reserved for deep work — no notifications, no email.

That single change doubled my output within three months. Not because of hustle culture, but because focus is a skill you train like a muscle.

In this episode I'll walk through the exact morning system, the tools I use to block distractions, and how to recover when you inevitably fall off the wagon.`;
var SAMPLE_TUTORIAL = `In this video I'll show you how to set up a clean home studio for talking-head content without spending thousands.

First we pick a quiet corner with soft natural light from a window. Second, we add a simple key light and a cheap lav mic.

Then we frame the shot so your eyes sit on the top third line, leave space for captions, and keep the background tidy but not sterile.

Finally I'll show the export settings that look sharp on YouTube and short-form vertical crops.`;
var SAMPLE_STORY = `Three years ago I was burned out, working late every night, and convinced rest was for people who didn't care enough.

Then I took a two-week trip to the coast with no laptop. I walked, cooked simple meals, and slept until I was actually rested.

When I came back, the work got better — not worse. Creativity returned. Clients noticed. I started saying no to projects that drained me.

If you're running on empty right now, this is your permission slip to stop grinding and start protecting the energy that makes the work good.`;
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var searchStock = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("7066de57cf1728a9992ccb32693a9e4815bb14f8c91f40498e8e601eea636275"));
var proxyDownload = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("4d4dc089e7068c85278fb39612fa7ea245f7642a2c1cef005820c908a7646c08"));
var defaultSettings = {
	chunkSeconds: 8,
	speakingWpm: 150,
	preferVideo: true,
	includePhotos: true,
	resultsPerQuery: 6
};
var defaultKeys = {
	pexels: "",
	pixabay: ""
};
var useBrollStore = create()(persist((set, get) => ({
	step: "script",
	script: SAMPLE_PODCAST,
	chunks: [],
	selectedChunkId: null,
	keys: defaultKeys,
	settings: defaultSettings,
	searchingAll: false,
	_hydrated: false,
	setHydrated: () => set({ _hydrated: true }),
	setStep: (step) => set({ step }),
	setScript: (script) => set({ script }),
	loadSample: (kind) => {
		set({
			script: {
				podcast: SAMPLE_PODCAST,
				tutorial: SAMPLE_TUTORIAL,
				story: SAMPLE_STORY
			}[kind],
			chunks: [],
			selectedChunkId: null,
			step: "script"
		});
	},
	setKeys: (patch) => set({ keys: {
		...get().keys,
		...patch
	} }),
	setSettings: (patch) => set({ settings: {
		...get().settings,
		...patch
	} }),
	setSelectedChunkId: (selectedChunkId) => set({ selectedChunkId }),
	buildChunks: () => {
		const chunks = chunkScript(get().script, get().settings);
		set({
			chunks,
			selectedChunkId: chunks[0]?.id ?? null,
			step: "chunks"
		});
	},
	updateChunk: (id, patch) => set({ chunks: get().chunks.map((c) => c.id === id ? {
		...c,
		...patch
	} : c) }),
	searchChunk: async (id) => {
		const chunk = get().chunks.find((c) => c.id === id);
		if (!chunk) return;
		const { keys, settings } = get();
		set({ chunks: get().chunks.map((c) => c.id === id ? {
			...c,
			status: "searching",
			error: void 0
		} : c) });
		try {
			const queries = [chunk.searchQuery, ...chunk.altQueries].filter(Boolean);
			const all = [];
			let lastErrors = [];
			let hadKeys = false;
			for (const q of queries) {
				if (all.filter((c) => c.kind === "video").length >= 4) break;
				const result = await searchStock({ data: {
					query: q,
					pexelsKey: keys.pexels,
					pixabayKey: keys.pixabay,
					preferVideo: settings.preferVideo,
					includePhotos: settings.includePhotos,
					perPage: settings.resultsPerQuery
				} });
				hadKeys = hadKeys || result.hadKeys;
				lastErrors = result.errors;
				for (const clip of result.clips) if (!all.some((a) => a.id === clip.id)) all.push(clip);
			}
			all.sort((a, b) => {
				if (a.kind === b.kind) return 0;
				return a.kind === "video" ? -1 : 1;
			});
			if (!hadKeys) {
				set({ chunks: get().chunks.map((c) => c.id === id ? {
					...c,
					results: [],
					status: "error",
					error: "Add a free Pexels and/or Pixabay API key in Settings to pull real clips."
				} : c) });
				return;
			}
			set({ chunks: get().chunks.map((c) => c.id === id ? {
				...c,
				results: all,
				status: all.length ? "ready" : "empty",
				error: all.length === 0 ? lastErrors[0] || "No clips found — try editing the search query." : void 0,
				selectedId: c.selectedId && all.some((x) => x.id === c.selectedId) ? c.selectedId : all.find((x) => x.kind === "video")?.id ?? all[0]?.id ?? null
			} : c) });
		} catch (e) {
			set({ chunks: get().chunks.map((c) => c.id === id ? {
				...c,
				status: "error",
				error: String(e?.message || e)
			} : c) });
		}
	},
	searchAllChunks: async () => {
		set({
			searchingAll: true,
			step: "find"
		});
		const ids = get().chunks.map((c) => c.id);
		for (const id of ids) await get().searchChunk(id);
		set({ searchingAll: false });
	},
	selectClip: (chunkId, clipId) => set({ chunks: get().chunks.map((c) => c.id === chunkId ? {
		...c,
		selectedId: clipId
	} : c) }),
	reset: () => set({
		step: "script",
		script: SAMPLE_PODCAST,
		chunks: [],
		selectedChunkId: null,
		searchingAll: false
	})
}), {
	name: "broll-finder-v2",
	storage: createJSONStorage(() => typeof window !== "undefined" ? localStorage : {
		getItem: () => null,
		setItem: () => {},
		removeItem: () => {}
	}),
	partialize: (s) => ({
		keys: s.keys,
		settings: s.settings,
		script: s.script
	}),
	onRehydrateStorage: () => (state) => {
		state?.setHydrated();
	}
}));
function ScriptStep({ onOpenSettings }) {
	const script = useBrollStore((s) => s.script);
	const setScript = useBrollStore((s) => s.setScript);
	const loadSample = useBrollStore((s) => s.loadSample);
	const buildChunks = useBrollStore((s) => s.buildChunks);
	const keys = useBrollStore((s) => s.keys);
	const settings = useBrollStore((s) => s.settings);
	const words = script.trim().split(/\s+/).filter(Boolean).length;
	const estSec = Math.round(words / settings.speakingWpm * 60);
	const hasKey = Boolean(keys.pexels || keys.pixabay);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[1fr_280px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your talking-head script" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: [
			"Paste what you say on camera. We'll chop it into roughly",
			" ",
			settings.chunkSeconds,
			"s chunks, invent visual b-roll for each, then pull real clips from Pexels & Pixabay so you can download them onto your timeline."
		] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				value: script,
				onChange: (e) => setScript(e.target.value),
				placeholder: "Paste your script…",
				className: "min-h-[280px] leading-relaxed"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-xs tabular text-fg-subtle",
					children: [
						words,
						" words · ~",
						Math.floor(estSec / 60),
						":",
						String(estSec % 60).padStart(2, "0"),
						" spoken"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: words < 8,
					onClick: buildChunks,
					children: "Chop into chunks"
				})]
			})]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-wide text-fg-muted",
					children: "Samples"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SampleBtn, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicVocal, { className: "h-4 w-4" }),
					title: "Habits / podcast",
					onClick: () => loadSample("podcast")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SampleBtn, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-4 w-4" }),
					title: "Studio tutorial",
					onClick: () => loadSample("tutorial")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SampleBtn, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-4 w-4" }),
					title: "Story / burn-out",
					onClick: () => loadSample("story")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: hasKey ? "border-border" : "border-warning/40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-3 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-4 w-4 text-fg-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: hasKey ? "API keys ready" : "Add free API keys"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs leading-relaxed text-fg-muted text-pretty",
								children: hasKey ? "We’ll search Pexels & Pixabay for video first, then photos." : "To pull downloadable clips you need a free Pexels and/or Pixabay key (30 seconds). Without keys we can still build visual ideas."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: hasKey ? "outline" : "default",
								className: "w-full",
								onClick: onOpenSettings,
								children: hasKey ? "Manage keys" : "Add API keys"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "border-dashed",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-2 p-4 text-xs leading-relaxed text-fg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium text-fg",
							children: "How it fits your edit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Talking head stays on top. Underneath, each 5–10s chunk gets a full-bleed b-roll clip that shows the story — not random stock." })]
					})
				})
			]
		})]
	});
}
function SampleBtn({ icon, title, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "flex w-full items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-3 text-left transition-colors hover:border-border-strong hover:bg-bg-subtle",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-fg-muted",
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-medium",
			children: title
		})]
	});
}
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	type,
	className: cn("flex h-10 w-full rounded-[var(--radius-sm)] border border-border bg-bg px-3 py-2 text-sm text-fg placeholder:text-fg-subtle shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:border-border-strong disabled:cursor-not-allowed disabled:opacity-50", className),
	ref,
	...props
}));
Input.displayName = "Input";
function ChunksStep() {
	const chunks = useBrollStore((s) => s.chunks);
	const selectedChunkId = useBrollStore((s) => s.selectedChunkId);
	const setSelectedChunkId = useBrollStore((s) => s.setSelectedChunkId);
	const updateChunk = useBrollStore((s) => s.updateChunk);
	const setStep = useBrollStore((s) => s.setStep);
	const searchAllChunks = useBrollStore((s) => s.searchAllChunks);
	const keys = useBrollStore((s) => s.keys);
	const selected = chunks.find((c) => c.id === selectedChunkId) ?? chunks[0] ?? null;
	const totalDur = chunks.reduce((s, c) => s + c.durationSec, 0);
	const hasKey = Boolean(keys.pexels || keys.pixabay);
	if (!chunks.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-8 text-center text-sm text-fg-muted",
		children: ["No chunks yet.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => setStep("script"),
				children: "Back to script"
			})
		})]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[300px_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "h-fit lg:sticky lg:top-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-sm",
					children: "Chunks"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: [
					chunks.length,
					" shots · ~",
					formatTimecode(totalDur),
					" total"
				] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "max-h-[60vh] space-y-1 overflow-y-auto scrollbar-thin p-2",
				children: chunks.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setSelectedChunkId(c.id),
					className: cn("w-full rounded-[var(--radius-md)] border px-3 py-2.5 text-left transition-colors", selected?.id === c.id ? "border-border-strong bg-bg-subtle" : "border-transparent hover:bg-bg-subtle"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-[11px] tabular text-fg-subtle",
							children: [
								"#",
								c.index + 1,
								" · ",
								formatTimecode(c.startSec),
								"–",
								formatTimecode(c.endSec)
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-[10px] text-fg-subtle",
							children: [c.durationSec.toFixed(0), "s"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "line-clamp-2 text-xs text-fg-muted",
						children: c.text
					})]
				}, c.id))
			})]
		}), selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "text-base",
				children: ["Chunk #", selected.index + 1]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
				className: "font-mono text-xs",
				children: [
					formatTimecode(selected.startSec),
					" →",
					" ",
					formatTimecode(selected.endSec),
					" · under talking head"
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-1.5 text-xs font-medium uppercase tracking-wide text-fg-muted",
						children: "Spoken"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-fg text-pretty",
						children: selected.text
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-wide text-fg-muted",
							children: "Visual idea (what the b-roll shows)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: selected.visualIdea,
							onChange: (e) => updateChunk(selected.id, { visualIdea: e.target.value }),
							className: "min-h-[88px]"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-wide text-fg-muted",
								children: "Stock search query"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: selected.searchQuery,
								onChange: (e) => updateChunk(selected.id, { searchQuery: e.target.value })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-fg-subtle",
								children: ["Alts: ", selected.altQueries.join(" · ") || "—"]
							})
						]
					})
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => setStep("script"),
					children: "Back"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [!hasKey && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-warning",
						children: "Add API keys to pull real clips"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						"data-testid": "find-all-clips",
						onClick: () => {
							setStep("find");
							searchAllChunks();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4" }), "Find clips for all chunks"]
					})]
				})]
			})]
		})]
	});
}
var badgeVariants = cva("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase", {
	variants: { variant: {
		default: "border-border bg-bg-subtle text-fg-muted",
		accent: "border-border-strong bg-primary/10 text-fg",
		receipts: "border-receipt/30 bg-receipt/10 text-receipt",
		entity: "border-entity/30 bg-entity/10 text-entity",
		concept: "border-concept/30 bg-concept/10 text-concept",
		cultural: "border-cultural/30 bg-cultural/10 text-cultural",
		drop: "border-drop/30 bg-drop/10 text-drop",
		success: "border-success/30 bg-success/10 text-success"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function extFor(clip) {
	if (clip.kind === "video") return "mp4";
	const u = clip.downloadUrl.toLowerCase();
	if (u.includes(".png")) return "png";
	if (u.includes(".webp")) return "webp";
	return "jpg";
}
function filenameFor(clip, chunkIndex) {
	const safe = clip.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
	return `chunk-${String(chunkIndex + 1).padStart(2, "0")}-${clip.provider}-${safe || clip.id}.${extFor(clip)}`;
}
function triggerBlobDownload(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.rel = "noopener";
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 2e3);
}
function base64ToBlob(base64, contentType) {
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return new Blob([bytes], { type: contentType });
}
/** Try direct CORS download, fall back to server proxy. */
async function downloadClip(clip, chunkIndex) {
	const url = clip.downloadUrl || clip.previewUrl;
	if (!url) throw new Error("No download URL for this clip");
	const filename = filenameFor(clip, chunkIndex);
	try {
		const res = await fetch(url, { mode: "cors" });
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		triggerBlobDownload(await res.blob(), filename);
		return;
	} catch {}
	const proxied = await proxyDownload({ data: {
		url,
		filename
	} });
	triggerBlobDownload(base64ToBlob(proxied.base64, proxied.contentType), filename);
}
function FindStep({ onOpenSettings }) {
	const chunks = useBrollStore((s) => s.chunks);
	const selectedChunkId = useBrollStore((s) => s.selectedChunkId);
	const setSelectedChunkId = useBrollStore((s) => s.setSelectedChunkId);
	const selectClip = useBrollStore((s) => s.selectClip);
	const searchChunk = useBrollStore((s) => s.searchChunk);
	const searchAllChunks = useBrollStore((s) => s.searchAllChunks);
	const searchingAll = useBrollStore((s) => s.searchingAll);
	const setStep = useBrollStore((s) => s.setStep);
	const keys = useBrollStore((s) => s.keys);
	const [downloading, setDownloading] = (0, import_react.useState)(null);
	const selected = chunks.find((c) => c.id === selectedChunkId) ?? chunks[0] ?? null;
	const hasKey = Boolean(keys.pexels || keys.pixabay);
	const picked = chunks.filter((c) => c.selectedId).length;
	const ready = chunks.filter((c) => c.status === "ready").length;
	if (!chunks.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-8 text-center text-sm text-fg-muted",
		children: ["Chop a script first.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => setStep("script"),
				children: "Script"
			})
		})]
	}) });
	async function onDownload(clip, chunkIndex) {
		setDownloading(clip.id);
		try {
			await downloadClip(clip, chunkIndex);
			toast.success("Download started");
		} catch (e) {
			toast.error(String(e?.message || "Download failed"));
		} finally {
			setDownloading(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			!hasKey && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-warning/40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "mt-0.5 h-4 w-4 text-warning" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Need free API keys to fetch clips"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-fg-muted",
							children: "Pexels and Pixabay keys are free. Once added, we pull real video (then photos) you can preview and download."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: onOpenSettings,
						children: "Add keys"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-fg-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono tabular text-fg",
							children: ready
						}),
						"/",
						chunks.length,
						" ",
						"searched ·",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono tabular text-fg",
							children: picked
						}),
						" selected"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						disabled: searchingAll || !hasKey,
						onClick: () => void searchAllChunks(),
						children: [searchingAll ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4" }), "Search all"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						disabled: picked === 0,
						onClick: () => setStep("timeline"),
						children: [
							"Open timeline (",
							picked,
							")"
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[260px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "h-fit lg:sticky lg:top-20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "max-h-[65vh] space-y-1 overflow-y-auto scrollbar-thin p-2",
						children: chunks.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSelectedChunkId(c.id),
							className: cn("flex w-full items-start gap-2 rounded-[var(--radius-md)] border px-2.5 py-2 text-left text-xs transition-colors", selected?.id === c.id ? "border-border-strong bg-bg-subtle" : "border-transparent hover:bg-bg-subtle"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusDot, {
								status: c.status,
								selected: Boolean(c.selectedId)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-[10px] text-fg-subtle",
									children: [
										"#",
										c.index + 1,
										" · ",
										formatTimecode(c.startSec)
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 line-clamp-2 block text-fg-muted",
									children: c.visualIdea
								})]
							})]
						}, c.id))
					})
				}), selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "default",
								children: ["Chunk ", selected.index + 1]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-xs text-fg-subtle",
								children: [
									formatTimecode(selected.startSec),
									"–",
									formatTimecode(selected.endSec)
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base leading-snug",
							children: selected.visualIdea
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
							className: "text-pretty",
							children: [
								"“",
								selected.text,
								"”"
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "secondary",
									disabled: selected.status === "searching" || !hasKey,
									onClick: () => void searchChunk(selected.id),
									children: [selected.status === "searching" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4" }), "Re-search this chunk"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-fg-subtle",
									children: ["Query: ", selected.searchQuery]
								})]
							}),
							selected.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "rounded-[var(--radius-sm)] border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger",
								children: selected.error
							}),
							selected.status === "searching" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 py-8 text-sm text-fg-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Searching Pexels & Pixabay (video first)…"]
							}),
							selected.results.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
								children: selected.results.map((clip) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipCard, {
									clip,
									selected: selected.selectedId === clip.id,
									downloading: downloading === clip.id,
									onSelect: () => selectClip(selected.id, clip.id),
									onDownload: () => void onDownload(clip, selected.index)
								}, clip.id))
							}),
							selected.status === "idle" && hasKey && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "py-6 text-center text-sm text-fg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => void searchChunk(selected.id),
									children: "Search stock for this chunk"
								})
							})
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setStep("chunks"),
							children: "Back to chunks"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: picked === 0,
							onClick: () => setStep("timeline"),
							children: "Review timeline"
						})]
					})]
				})]
			})
		]
	});
}
function StatusDot({ status, selected }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("mt-1 h-2 w-2 shrink-0 rounded-full", selected ? "bg-success" : status === "ready" ? "bg-fg-muted" : status === "searching" ? "bg-warning animate-pulse" : status === "error" || status === "empty" ? "bg-danger" : "bg-border-strong") });
}
function ClipCard({ clip, selected, downloading, onSelect, onDownload }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("overflow-hidden rounded-[var(--radius-md)] border bg-bg-elevated transition-colors", selected ? "border-primary ring-1 ring-primary/40" : "border-border"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onSelect,
			className: "block w-full text-left",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-video bg-bg-subtle",
				children: [
					clip.kind === "video" && clip.previewUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						src: clip.previewUrl,
						poster: clip.thumbUrl,
						muted: true,
						playsInline: true,
						loop: true,
						preload: "metadata",
						className: "h-full w-full object-cover",
						onMouseEnter: (e) => {
							e.currentTarget.play().catch(() => {});
						},
						onMouseLeave: (e) => {
							e.currentTarget.pause();
							e.currentTarget.currentTime = 0;
						}
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: clip.thumbUrl || clip.previewUrl,
						alt: "",
						className: "h-full w-full object-cover",
						crossOrigin: "anonymous"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute left-1.5 top-1.5 flex gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 rounded bg-black/55 px-1.5 py-0.5 text-[10px] text-fg",
							children: [clip.kind === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-3 w-3" }), clip.kind]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded bg-black/55 px-1.5 py-0.5 text-[10px] uppercase text-fg-muted",
							children: clip.provider
						})]
					}),
					selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-fg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" })
					}),
					clip.durationSec != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "absolute bottom-1.5 right-1.5 rounded bg-black/55 px-1.5 py-0.5 font-mono text-[10px] text-fg",
						children: [clip.durationSec, "s"]
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2 p-2.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "line-clamp-1 text-xs font-medium",
					children: clip.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "truncate text-[11px] text-fg-subtle",
					children: [
						clip.photographer,
						" · ",
						clip.width,
						"×",
						clip.height
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: selected ? "default" : "secondary",
							className: "flex-1",
							onClick: onSelect,
							children: selected ? "Selected" : "Use this"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							disabled: downloading || !clip.downloadUrl,
							onClick: onDownload,
							"aria-label": "Download",
							children: downloading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: clip.pageUrl,
								target: "_blank",
								rel: "noreferrer",
								"aria-label": "Open source",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" })
							})
						})
					]
				})
			]
		})]
	});
}
function TimelineStep() {
	const chunks = useBrollStore((s) => s.chunks);
	const setStep = useBrollStore((s) => s.setStep);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const rows = chunks.map((c) => ({
		chunk: c,
		clip: c.results.find((r) => r.id === c.selectedId) ?? null
	}));
	const withClips = rows.filter((r) => r.clip);
	const total = Math.max(1, chunks.at(-1)?.endSec ?? chunks.reduce((s, c) => s + c.durationSec, 0));
	async function downloadAll() {
		if (!withClips.length) return;
		setBusy(true);
		setProgress(0);
		let ok = 0;
		for (let i = 0; i < withClips.length; i++) {
			const row = withClips[i];
			try {
				await downloadClip(row.clip, row.chunk.index);
				ok++;
				await new Promise((r) => setTimeout(r, 350));
			} catch (e) {
				toast.error(`Chunk ${row.chunk.index + 1}: ${String(e?.message || e)}`);
			}
			setProgress(Math.round((i + 1) / withClips.length * 100));
		}
		setBusy(false);
		toast.success(`Downloaded ${ok} of ${withClips.length} clips`);
	}
	async function downloadOne(clip, index) {
		try {
			await downloadClip(clip, index);
			toast.success("Download started");
		} catch (e) {
			toast.error(String(e?.message || e));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your b-roll timeline" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Full-bleed under your talking head. Each block is a stock clip timed to that script chunk — download the files and drop them on the same ranges in your editor." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-[11px] text-fg-subtle",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: "0:00.0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: formatTimecode(total)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative h-20 overflow-hidden rounded-[var(--radius-md)] border border-border bg-bg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute left-2 top-1.5 z-10 inline-flex items-center gap-1 rounded bg-bg-elevated/90 px-1.5 py-0.5 text-[10px] text-fg-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3 w-3" }), " Talking head (your video)"]
							}), rows.map(({ chunk, clip }) => {
								const left = chunk.startSec / total * 100;
								const width = Math.max(2, chunk.durationSec / total * 100);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: cn("absolute bottom-2 top-7 overflow-hidden rounded-[var(--radius-xs)] border", clip ? "border-border-strong" : "border-dashed border-border bg-bg-subtle/50"),
									style: {
										left: `${left}%`,
										width: `${width}%`,
										background: clip ? clip.kind === "video" ? "linear-gradient(135deg, #2a2a32, #16161c)" : "linear-gradient(135deg, #1e2a24, #121814)" : void 0
									},
									title: `#${chunk.index + 1} ${formatTimecode(chunk.startSec)}`,
									children: [clip?.thumbUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: clip.thumbUrl,
										alt: "",
										className: "h-full w-full object-cover opacity-70",
										crossOrigin: "anonymous"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute inset-x-0 bottom-0 truncate bg-black/50 px-1 py-0.5 text-center font-mono text-[9px] text-fg",
										children: chunk.index + 1
									})]
								}, chunk.id);
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-fg-subtle",
							children: "Lane above is your continuous talking head. Colored blocks are b-roll underneath."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => void downloadAll(),
						disabled: busy || withClips.length === 0,
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), busy ? `Downloading… ${progress}%` : `Download all selected (${withClips.length})`]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setStep("find"),
						children: "Change picks"
					})]
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: rows.map(({ chunk, clip }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex flex-col gap-3 p-3 sm:flex-row sm:items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative h-16 w-full shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-bg-subtle sm:w-28",
							children: clip?.thumbUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: clip.thumbUrl,
								alt: "",
								className: "h-full w-full object-cover",
								crossOrigin: "anonymous"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-full items-center justify-center text-[11px] text-fg-subtle",
								children: "No pick"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1 space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "default",
											children: ["#", chunk.index + 1]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono text-[11px] tabular text-fg-subtle",
											children: [
												formatTimecode(chunk.startSec),
												" →",
												" ",
												formatTimecode(chunk.endSec)
											]
										}),
										clip && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1 text-[11px] text-fg-muted",
											children: [clip.kind === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-3 w-3" }), clip.provider]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm text-fg",
									children: clip?.title ?? "Nothing selected for this chunk"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "line-clamp-1 text-xs text-fg-muted",
									children: chunk.visualIdea
								})
							]
						}),
						clip && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => void downloadOne(clip, chunk.index),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), "Download"]
						})
					]
				}) }, chunk.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[var(--radius-lg)] border border-dashed border-border bg-bg-elevated p-4 text-xs leading-relaxed text-fg-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1 font-medium text-fg",
					children: "In your editor"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "list-inside list-decimal space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Drop your talking-head clip on V1 (full timeline)." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Place each downloaded b-roll on V2 at the start times above, full-bleed under the face (or pip the face top-right)." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Mute stock audio. Crossfade joins if two blocks touch." })
					]
				})]
			})
		]
	});
}
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label$1, {
	ref,
	className: cn("text-xs font-medium uppercase tracking-wide text-fg-muted", className),
	...props
}));
Label.displayName = "Label";
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 data-[state=checked]:bg-primary data-[state=unchecked]:bg-bg-subtle", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-5 w-5 rounded-full bg-fg shadow-sm ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5 data-[state=checked]:bg-primary-fg") })
}));
Switch.displayName = "Switch";
function SettingsPanel({ open, onClose }) {
	const keys = useBrollStore((s) => s.keys);
	const setKeys = useBrollStore((s) => s.setKeys);
	const settings = useBrollStore((s) => s.settings);
	const setSettings = useBrollStore((s) => s.setSettings);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center bg-bg/80 p-4 sm:items-center",
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": "settings-title",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg rounded-[var(--radius-xl)] border border-border bg-bg-elevated shadow-[var(--shadow-md)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3 border-b border-border p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "settings-title",
					className: "text-base font-semibold tracking-tight",
					children: "Stock API keys"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-fg-muted text-pretty",
					children: "Free keys unlock real video + photo search on Pexels and Pixabay. Stored only in your browser."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					onClick: onClose,
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "pexels-key",
								children: "Pexels API key"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "https://www.pexels.com/api/",
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex items-center gap-1 text-[11px] text-fg-subtle hover:text-fg",
								children: ["Get free key ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "pexels-key",
							type: "password",
							autoComplete: "off",
							placeholder: "Paste Pexels key",
							value: keys.pexels,
							onChange: (e) => setKeys({ pexels: e.target.value.trim() })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "pixabay-key",
								children: "Pixabay API key"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "https://pixabay.com/api/docs/",
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex items-center gap-1 text-[11px] text-fg-subtle hover:text-fg",
								children: ["Get free key ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "pixabay-key",
							type: "password",
							autoComplete: "off",
							placeholder: "Paste Pixabay key",
							value: keys.pixabay,
							onChange: (e) => setKeys({ pixabay: e.target.value.trim() })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[var(--radius-md)] border border-border bg-bg p-3.5 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-wide text-fg-muted",
								children: "Search preferences"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-fg",
									children: "Prefer video"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-fg-subtle",
									children: "Search video before photos"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: settings.preferVideo,
									onCheckedChange: (v) => setSettings({ preferVideo: v })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-fg",
									children: "Include photos"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-fg-subtle",
									children: "Fallback when video is thin"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: settings.includePhotos,
									onCheckedChange: (v) => setSettings({ includePhotos: v })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									htmlFor: "chunk-sec",
									children: [
										"Target chunk length: ",
										settings.chunkSeconds,
										"s"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "chunk-sec",
									type: "range",
									min: 5,
									max: 10,
									step: 1,
									value: settings.chunkSeconds,
									onChange: (e) => setSettings({ chunkSeconds: Number(e.target.value) }),
									className: "w-full accent-fg"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						onClick: onClose,
						children: "Save & close"
					})
				]
			})]
		})
	});
}
var STEPS = [
	{
		id: "script",
		label: "Script",
		short: "1"
	},
	{
		id: "chunks",
		label: "Chunks",
		short: "2"
	},
	{
		id: "find",
		label: "Find clips",
		short: "3"
	},
	{
		id: "timeline",
		label: "Timeline",
		short: "4"
	}
];
var ORDER = STEPS.map((s) => s.id);
function StepNav() {
	const step = useBrollStore((s) => s.step);
	const setStep = useBrollStore((s) => s.setStep);
	const chunks = useBrollStore((s) => s.chunks);
	const current = ORDER.indexOf(step);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		"aria-label": "Workflow",
		className: "flex w-full items-center gap-1 overflow-x-auto scrollbar-thin pb-1",
		children: STEPS.map((s, i) => {
			const done = i < current;
			const active = s.id === step;
			const locked = (s.id === "chunks" || s.id === "find" || s.id === "timeline") && chunks.length === 0 && !active && !done;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				disabled: locked,
				onClick: () => {
					if (!locked && (done || active || i <= current + 1)) setStep(s.id);
				},
				className: cn("flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors duration-150", active && "border-primary bg-primary text-primary-fg", done && !active && "border-border-strong bg-bg-subtle text-fg", !active && !done && "border-border bg-transparent text-fg-subtle", locked && "opacity-40"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("flex h-5 w-5 items-center justify-center rounded-full font-mono text-[10px]", active ? "bg-primary-fg/15" : "bg-bg-hover"),
					children: s.short
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden sm:inline",
					children: s.label
				})]
			}, s.id);
		})
	});
}
function AppShell() {
	const step = useBrollStore((s) => s.step);
	const hydrated = useBrollStore((s) => s._hydrated);
	const setHydrated = useBrollStore((s) => s.setHydrated);
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const result = useBrollStore.persist.rehydrate();
		Promise.resolve(result).finally(() => setHydrated());
	}, [setHydrated]);
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-bg text-fg-muted",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm",
			children: "Loading…"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-bg-elevated",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clapperboard, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "truncate text-sm font-semibold tracking-tight sm:text-base",
									children: "B-Roll Finder"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-[11px] text-fg-subtle sm:text-xs",
									children: "Script → chunks → stock clips under your talking head"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setSettingsOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "API keys"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepNav, {})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8",
				children: [
					step === "script" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScriptStep, { onOpenSettings: () => setSettingsOpen(true) }),
					step === "chunks" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChunksStep, {}),
					step === "find" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FindStep, { onOpenSettings: () => setSettingsOpen(true) }),
					step === "timeline" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimelineStep, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border py-5 text-center text-[11px] text-fg-subtle",
				children: "Free stock from Pexels & Pixabay · Video first, photos as fallback · You pick, then download"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsPanel, {
				open: settingsOpen,
				onClose: () => setSettingsOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "bottom-right",
				toastOptions: { className: "border border-border bg-bg-elevated text-fg" }
			})
		]
	});
}
var Route = createFileRoute("/")({ component: IndexPage });
function IndexPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {});
}
var rootRouteChildren = { IndexRoute: Route.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$1
}) };
var routeTree = Route$1._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	return createRouter({
		routeTree,
		defaultPreload: "intent",
		scrollRestoration: true
	});
}
//#endregion
export { getRouter };
