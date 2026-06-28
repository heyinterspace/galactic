---
name: Overlay vs Sidebar stacking context
description: Why top-right overlay UI (banners, badges, toasts) can't sit above the console rail, and how to keep its controls clickable.
---

The galaxy `Overlay` subtree is mounted at `z-10`; the right "Mission Control"
`Sidebar` rail is a separate sibling at `z-30`. They form independent stacking
contexts, so **anything nested inside Overlay renders below the console rail no
matter how high its own z-index** — a `z-40` element inside Overlay is still
under the `z-30` sidebar globally.

**Why:** a full-width top promo banner mounted in Overlay had its right-aligned
close button land *under* the desktop console rail, making it unclickable.

**How to apply:** any overlay element that reaches the right edge up top
(banners, badges, corner toasts) must either (a) inset its right edge by the live
console width — `consoleOpen ? "min(12rem,80vw)" : "3.5rem"`, mirroring
`HeaderActions` in Overlay.tsx — so it stays left of the rail, or (b) be hoisted
out of Overlay to a top-level sibling with z above the sidebar. Insetting is
preferred: hoisting a full-width bar above everything would also cover the
console's own top controls.
