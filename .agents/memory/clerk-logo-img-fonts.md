---
name: Clerk logo / SVG-as-img fonts
description: Why the Clerk auth-page logo must be a square self-contained mark, not a webfont wordmark lockup.
---

# Clerk auth-page logo

Clerk's `appearance.options.logoImageUrl` is rendered as a plain `<img src>`. An
SVG loaded that way is font-isolated: it cannot pull in the page's custom web
fonts (Google Fonts, @font-face, etc.). A wordmark lockup whose `<text>` relies
on a brand font (e.g. Archivo) therefore drops to a muddy gray system fallback,
and a wide lockup also gets squished in Clerk's small square logo box.

**Rule:** point `logoImageUrl` at a square, self-contained brand *mark* (icon
only, e.g. `logo-mark.svg`) and size `logoBox`/`logoImage` square. If the
wordmark must appear, bake the text into outlines/paths in the SVG (no font
dependency) — never rely on a webfont inside the img.

**Why:** the wide `logo.svg` lockup looked "incorrect" in Clerk for exactly this
reason; the square `logo-mark.svg` renders crisp on the dark card.

**How to apply:** any time you set a Clerk `logoImageUrl`, prefer the square mark
and verify by screenshotting `/sign-in` and `/sign-up`.
