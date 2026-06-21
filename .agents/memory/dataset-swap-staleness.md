---
name: Live dataset swap staleness
description: Module-load constants derived from galaxyData go stale after a live OpenAlex researcher swap; derive inside components under key={datasetVersion}.
---

# Live dataset swap staleness

The galaxy app can swap the active researcher at runtime (live OpenAlex search in
the Info tab). The swap mutates the module-level `galaxyData` singletons in place
and bumps `datasetVersion`; the data-dependent React tree is remounted via
`key={datasetVersion}`.

**Rule:** Any value derived from `galaxyData` (stats, domain/sun lists, tour
stops, search indexes, intro "beats", etc.) must be computed *inside* a component
that lives under the `key={datasetVersion}` subtree — use a mount-time
`useMemo(() => buildX(), [])`. A bare `const X = ...galaxyData...` at module scope
is captured once at first import and never recomputes, so it shows the previous
scientist's data after a swap.

**Why:** Module-scope constants are evaluated on first import and are not affected
by remounting. Remount only re-runs component bodies, not module top-level. Three
real sites were caught this way (CommandBar indexes, tour stops, ScrollIntro
beats) — each had to move from module scope to a mount-time `useMemo`.

**How to apply:** When adding anything that reads `galaxyData`, put the derivation
in the component (mount-time memo), not at file top level. If you must keep a
module-level builder fn for reuse, call it from inside the component, don't
freeze its result at module scope.
