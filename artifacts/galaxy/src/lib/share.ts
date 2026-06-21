import { galaxyData } from "@/data/galaxy";
import { SITE } from "@/config/site";

// A reference to the live WebGL canvas, registered by Scene on create. We capture
// from it directly (the renderer runs with preserveDrawingBuffer) so a share grabs
// exactly what the visitor is looking at right now.
let galaxyCanvas: HTMLCanvasElement | null = null;

export function setGalaxyCanvas(el: HTMLCanvasElement | null): void {
  galaxyCanvas = el;
}

export type ShareOutcome = "shared" | "downloaded" | "copied" | "cancelled" | "error";

const CARD_W = 1200;
const CARD_H = 630;

const TITLE_FONT = "'Bricolage Grotesque', sans-serif";
const MONO_FONT = "'Space Mono', monospace";

type CtxLS = CanvasRenderingContext2D & { letterSpacing?: string };

function cssVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function setTracking(ctx: CanvasRenderingContext2D, value: string): void {
  (ctx as CtxLS).letterSpacing = value;
}

function fitFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  weight: number,
  family: string,
  maxWidth: number,
  startPx: number,
  minPx: number,
): number {
  let px = startPx;
  while (px > minPx) {
    ctx.font = `${weight} ${px}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    px -= 2;
  }
  return px;
}

function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "galaxy"
  );
}

// Compose the rich share card: the current galaxy view + headline stats, styled
// to match the app so it reads as a single branded artifact when shared.
async function buildShareCard(): Promise<Blob | null> {
  const card = document.createElement("canvas");
  card.width = CARD_W;
  card.height = CARD_H;
  const ctx = card.getContext("2d");
  if (!ctx) return null;

  if (typeof document !== "undefined" && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      /* fonts API unavailable — fall back to whatever is loaded */
    }
  }

  const bg = cssVar("--bg", "#272933");
  const ink = cssVar("--ink", "#e6e6e6");
  const dim = cssVar("--ink-dim", "#9da0ab");
  const accent = cssVar("--accent", "#a388ee");

  // Deep-space base in case the screenshot is missing or letterboxed.
  ctx.fillStyle = "#03030a";
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // The galaxy itself, cover-fit so it fills the card edge to edge.
  if (galaxyCanvas && galaxyCanvas.width > 0 && galaxyCanvas.height > 0) {
    const src = galaxyCanvas;
    const scale = Math.max(CARD_W / src.width, CARD_H / src.height);
    const dw = src.width * scale;
    const dh = src.height * scale;
    const dx = (CARD_W - dw) / 2;
    const dy = (CARD_H - dh) / 2;
    try {
      ctx.drawImage(src, dx, dy, dw, dh);
    } catch {
      /* canvas unreadable — keep the deep-space base */
    }
  }

  // Scrims so the wordmark (top) and stats (bottom) stay legible over the scene.
  const top = ctx.createLinearGradient(0, 0, 0, CARD_H * 0.32);
  top.addColorStop(0, "rgba(3,3,10,0.65)");
  top.addColorStop(1, "rgba(3,3,10,0)");
  ctx.fillStyle = top;
  ctx.fillRect(0, 0, CARD_W, CARD_H * 0.32);

  const bottom = ctx.createLinearGradient(0, CARD_H * 0.42, 0, CARD_H);
  bottom.addColorStop(0, "rgba(3,3,10,0)");
  bottom.addColorStop(1, `${bg}f2`);
  ctx.fillStyle = bottom;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  const PAD = 56;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  // Wordmark.
  ctx.font = `700 34px ${TITLE_FONT}`;
  ctx.fillStyle = accent;
  ctx.fillText("✦", PAD, 76);
  const star = ctx.measureText("✦").width;
  ctx.fillStyle = ink;
  ctx.fillText("Galactic", PAD + star + 16, 76);

  // Kicker.
  ctx.font = `400 18px ${MONO_FONT}`;
  ctx.fillStyle = accent;
  setTracking(ctx, "4px");
  ctx.fillText("A LIFE IN SCIENCE", PAD, CARD_H - 214);
  setTracking(ctx, "0px");

  // Researcher name (shrinks to fit the card width).
  const name = galaxyData.author.name;
  const namePx = fitFont(ctx, name, 700, TITLE_FONT, CARD_W - PAD * 2, 68, 40);
  ctx.font = `700 ${namePx}px ${TITLE_FONT}`;
  ctx.fillStyle = ink;
  ctx.fillText(name, PAD, CARD_H - 150);

  // Headline stats as punchy value/label columns.
  const stats = galaxyData.stats;
  const cols = [
    { value: stats.totalPapers.toLocaleString(), label: "PAPERS" },
    { value: stats.totalCitations.toLocaleString(), label: "CITATIONS" },
    { value: String(galaxyData.domains.length), label: "DOMAINS" },
    { value: String(stats.yearsActive), label: "YEARS" },
  ];

  const valueY = CARD_H - 76;
  const labelY = CARD_H - 50;
  let x = PAD;
  for (const c of cols) {
    ctx.font = `700 44px ${TITLE_FONT}`;
    ctx.fillStyle = ink;
    ctx.fillText(c.value, x, valueY);
    const vw = ctx.measureText(c.value).width;

    ctx.font = `400 15px ${MONO_FONT}`;
    ctx.fillStyle = dim;
    setTracking(ctx, "2px");
    ctx.fillText(c.label, x, labelY);
    const lw = ctx.measureText(c.label).width;
    setTracking(ctx, "0px");

    x += Math.max(vw, lw) + 46;
  }

  // Domain, bottom-right.
  ctx.font = `400 18px ${MONO_FONT}`;
  ctx.fillStyle = dim;
  ctx.textAlign = "right";
  ctx.fillText(SITE.domain, CARD_W - PAD, CARD_H - 50);
  ctx.textAlign = "left";

  return new Promise<Blob | null>((resolve) => {
    card.toBlob((b) => resolve(b), "image/jpeg", 0.92);
  });
}

// Share the galaxy as a rich image card. Prefers the native share sheet with the
// image attached (the viral path, great on mobile); degrades to a link-only share,
// then to saving the image + copying the link on desktops without Web Share.
export async function shareGalaxy(): Promise<ShareOutcome> {
  const shareUrl =
    typeof window !== "undefined" ? window.location.href : `https://${SITE.domain}`;
  const title = "Galactic";
  const text = `Explore ${galaxyData.author.name}'s life in science as an interactive galaxy.`;

  let blob: Blob | null = null;
  try {
    blob = await buildShareCard();
  } catch {
    blob = null;
  }

  const nav = typeof navigator !== "undefined" ? navigator : undefined;

  // 1. Native share with the image file attached.
  if (blob && nav && typeof nav.canShare === "function" && typeof nav.share === "function") {
    const file = new File([blob], `galactic-${slugify(galaxyData.author.name)}.jpg`, {
      type: "image/jpeg",
    });
    if (nav.canShare({ files: [file] })) {
      try {
        await nav.share({ files: [file], title, text, url: shareUrl });
        return "shared";
      } catch (e) {
        if ((e as DOMException)?.name === "AbortError") return "cancelled";
        /* fall through to link-only / download */
      }
    }
  }

  // 2. Native share, link only.
  if (nav && typeof nav.share === "function") {
    try {
      await nav.share({ title, text, url: shareUrl });
      return "shared";
    } catch (e) {
      if ((e as DOMException)?.name === "AbortError") return "cancelled";
      /* fall through */
    }
  }

  // 3. Desktop fallback: copy the link and hand over the image card.
  let copied = false;
  if (nav?.clipboard) {
    try {
      await nav.clipboard.writeText(shareUrl);
      copied = true;
    } catch {
      /* clipboard blocked */
    }
  }
  if (blob) {
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `galactic-${slugify(galaxyData.author.name)}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return "downloaded";
    } catch {
      /* download blocked */
    }
  }

  return copied ? "copied" : "error";
}
