---
name: Share-card capture timing
description: Why the off-screen galaxy share-card capture must wait for Suspense readiness, not a fixed timer.
---

The ScreenshotGate snapshots an off-screen R3F `<Scene captureTopDown>` into a 2D
share card via `buildShareCard()` (reads the WebGL canvas with
`preserveDrawingBuffer`). The card always encodes, so a blank result is not a
taint/encode failure — it's that the **scene textures hadn't painted yet** when
the snapshot ran.

**Rule:** never capture on a fixed `setTimeout`. The scene content lives under
`<Suspense fallback={null}>` (the starfield `useTexture` suspends), so a timer
races async texture load → intermittently blank cards.

**Reliable signal:** mount a tiny `SceneReady` component *inside* the Suspense
boundary; its `useEffect` fires only after the boundary resolves (content
mounted). Then wait 2 `requestAnimationFrame`s (+ a short settle for
bloom/exposure) so the first textured frame is actually painted into the
preserved buffer before snapshotting. Keep a safety-net timeout that captures
anyway if readiness never fires (texture error), so the gate never hangs.

**Why:** mount ≠ painted; the effect tells you assets resolved, the RAFs give the
renderer a frame to draw before `drawImage` reads the buffer.
