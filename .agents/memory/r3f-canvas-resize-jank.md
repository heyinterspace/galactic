---
name: R3F canvas resize jank on panel toggle
description: Why animating a flex sibling's width makes the R3F galaxy stutter/snap, and why sliding (transform) beats resizing.
---

# R3F Canvas resize jank when a sibling panel animates width

The galaxy `<Canvas>` (with an EffectComposer/Bloom pass) sits next to the
collapsible Flight Console (`Sidebar`). If the canvas shares a flex row with the
console, toggling the console's width resizes the canvas column.

**Two bad outcomes, both rooted in resizing the canvas:**
- **Resize live (default):** every ResizeObserver tick reallocates the WebGL buffer
  + bloom render targets + recomputes camera aspect → can't hold 60fps → the shift
  looks jagged/steppy.
- **Resize debounced** (`resize={{ debounce: 150 }}`): the buffer only updates after
  layout settles, so during the transition the frame is CSS-scaled (squished) then
  *snaps* crisp at the end → reads as "sudden."

**Better fix — don't resize the canvas on toggle at all.** Keep the galaxy as a
full-size `absolute inset-0` layer and **slide it with a GPU `translateX`** while the
console is an `absolute right-0` overlay (not a flex sibling). The canvas keeps a
constant size (no buffer realloc, no snap); the transform is GPU-composited and
buttery. Recenter the galaxy in the space left of the console by translating it half
the console's width (e.g. `translateX(calc(min(16rem,80vw) * -0.5))` open). Keep the
2D HUD (`Overlay`/header) *un*-translated so nothing clips off the left edge.

`resize={{ debounce: 150 }}` is still worth keeping — but now only to coalesce real
window/viewport resizes, not the console toggle.

**State note:** the galaxy slide must sync with the console, so console open/collapse
state lives in the store (`consoleOpen`), not local to `Sidebar`.

**Why:** WebGL/postprocessing buffer reallocation is the expensive part; if you never
change the canvas size, there's nothing to stutter or snap. Prefer moving pixels
(transform) over resizing the drawing buffer.

**How to apply:** any time an R3F Canvas shares layout with an animated/resizable
panel (collapsible sidebars, drawers, resizable splits), make the canvas full-size and
translate it; overlay the panel. Reach for canvas resize (debounced) only for true
viewport changes. Don't reach for a new "dashboard/console" library — this is the
actual root cause.
