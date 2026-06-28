---
name: Mobile console dock
description: How the Mission Control console (Sidebar) lays out on mobile vs desktop and the overlay rules that depend on it.
---

# Mobile console dock

On mobile (`useIsMobile()`, <768px) the Mission Control console docks to the
**bottom** of the screen — a slim horizontal rail (`h-14`) that expands into a
bottom **sheet** (`h-[min(70vh,30rem)]`). On desktop it stays the **right-edge**
vertical rail/panel (transitions width). The single `sections` model feeds both;
`RailBody`/`Divider` take a `horizontal` prop, `ConsoleBody` uses `flex-1 min-h-0`
so the sheet/panel scrolls.

**Why:** the right rail eats horizontal width on phones; a bottom dock frees the
full width and is thumb-reachable.

**How to apply / rules that must move together:**
- `App.tsx` must NOT apply the right-inset "push" on mobile — galaxy stays
  full-width (`rightInset = isMobile ? "0px" : ...`). The push is desktop-only.
- The detail panel (`Overlay.tsx`) is full-width above the collapsed bar
  (`bottom-[4.25rem]`, clears the 56px rail). It MUST be hidden while the console
  is open on mobile (`!(isMobile && consoleOpen)`) — both are `z-30` and the sheet
  would otherwise half-cover it.
- The `Footer` is hidden on mobile (`hidden md:flex`) because the bottom bar takes
  that space; version is still reachable via Changelog.
- `useIsMobile` initializes synchronously from `window.innerWidth` (not `undefined`)
  so the first paint uses the correct geometry — otherwise phones flash the desktop
  layout before the effect runs. Don't revert it to a lazy/undefined initial value.
