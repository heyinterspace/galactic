---
name: Galaxy tour hides non-tour UI until it ends
description: Why first-render errors in CommandBar/Header/panels surface as "bug after the guided tour".
---

In Galaxy, `Overlay` wraps the whole non-tour UI (Header, CommandBar, DetailPanel,
FilteredPapersPanel, hover tooltip) in `{!tourActive && (...)}`. The intro's "Take the
Tour" button calls `setIntroFinished(true)` then `startTour()`, so the tour begins
immediately and that UI block **never mounts until the tour ends**.

**Why it matters:** any error in the *first render* of those components shows up only
*after the guided tour* — it looks like a tour bug but is really a CommandBar (etc.)
mount-time crash. When a user reports "error after the tour", suspect the just-changed
overlay components, not the tour/camera code.

**Concrete instance:** a module-level helper (`compactNumber`) defined *below* the
`CommandBar` component crashed with "X is not defined" under React Fast Refresh / a
stale HMR module, surfacing post-tour. Fix: define module-level helpers *above* the
component that uses them; don't rely on hoisting across a Fast Refresh boundary.
