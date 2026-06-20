---
name: Intro flight camera
description: Why the scroll intro flies the single shared R3F camera via a ref instead of a second canvas or state.
---

The cinematic scroll intro reuses the single existing R3F `<Scene>` camera for
the flight, then hands off to the normal god/orbit (or tour) camera. There is no
second WebGL canvas for the warp.

**Why:** Continuity — the flight must dissolve seamlessly into the interactive
galaxy. A separate canvas would mean a hard cut and double the GPU cost.

**How to apply:**
- Scroll progress (0→1) lives in a ref (`introProgressRef` on the store), not
  React state. The camera reads it inside `useFrame`; only the intro overlay
  re-renders per frame. Putting progress in state would re-render every
  `useAppState` consumer ~60fps during the intro.
- The camera intro branch runs while `!introFinished`, lerping
  `INTRO_START → HOME_POS` (easeInOutCubic). OrbitControls stay disabled until
  `introFinished`. An effect on `introFinished` triggers the brief god-mode
  focus settle for a smooth handoff.
- Before finishing via Skip / reduced-motion / endpoints, snap
  `introProgressRef.current = 1` so the camera is already at HOME_POS and the
  handoff doesn't replay the flight.
- The starfield streaks are an HTML/CSS overlay in the cockpit, not 3D; their
  opacity/scale are set imperatively from scroll velocity to avoid extra renders.
