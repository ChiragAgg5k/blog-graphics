# Animation techniques for blog graphics

The building blocks every style skill in this repo composes from. All techniques produce a **single self-contained HTML/SVG snippet** — no build step, no external libraries — so the result can be pasted into any blog, CMS, or MDX file.

## 1. The golden setup: inline SVG + CSS animations

```html
<svg viewBox="0 0 720 400" role="img" aria-label="Data flowing from client to three shards">
  <style>
    /* Scope everything: blogs concatenate many graphics on one page. */
    .g1 .flow { animation: g1-dash 2s linear infinite; }
    @keyframes g1-dash { to { stroke-dashoffset: -24; } }
  </style>
  <g class="g1">…</g>
</svg>
```

Rules that prevent 90% of broken graphics:

- **`viewBox`, never fixed width/height.** Add `style="max-width:720px;width:100%;height:auto"` on the `<svg>` so it scales in any column.
- **Prefix every class and keyframe name** with a per-graphic slug (`g1-`, `backup-`). Two graphics on one page with a `.node` class will fight.
- **`transform-box: fill-box; transform-origin: center;`** on any element you scale/rotate. Without it, SVG elements rotate around the canvas origin (0,0) and fly off screen. This is the single most common AI-generated SVG bug.
- **Animate only `transform`, `opacity`, `stroke-dashoffset`, and `offset-distance`.** These are cheap and reliable. Avoid animating `x`/`y`/`width` attributes with CSS (patchy support) — wrap the element in a `<g>` and translate the group.

## 2. Core motion recipes

### Flowing dashes (data moving along a wire)
```css
.wire { stroke-dasharray: 6 10; animation: flow 1.2s linear infinite; }
@keyframes flow { to { stroke-dashoffset: -16; } }
```
Offset must equal a whole multiple of `dasharray` period (6+10=16) for a seamless loop. Negative offset flows in path direction; positive flows backward.

### Draw-on reveal (line drawing itself)
```css
.path { stroke-dasharray: var(--len); stroke-dashoffset: var(--len); animation: draw 1s ease forwards; }
@keyframes draw { to { stroke-dashoffset: 0; } }
```
Get `--len` from `getTotalLength()` once, or just use a generous constant (e.g. 1000) — overshoot is invisible.

### Packet along a path (dot traveling a route)
```css
.packet { offset-path: path('M20,200 C200,200 200,80 400,80'); animation: travel 2s ease-in-out infinite; }
@keyframes travel { from { offset-distance: 0%; } to { offset-distance: 100%; } }
```
`offset-path` works on SVG children in all modern browsers. For maximum-compatibility embeds (email, old RSS readers), fall back to SMIL: `<animateMotion dur="2s" repeatCount="indefinite"><mpath href="#route"/></animateMotion>`.

### Pulse (activity/heartbeat on a node)
```css
.node.active { animation: pulse 1.6s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
@keyframes pulse { 50% { transform: scale(1.06); opacity: .85; } }
```

### Staged sequence (step 1 → step 2 → step 3, then loop)
Prefer **one long timeline** over JS: give every element the same `animation-duration` (the full scene length, e.g. 8s) and express each element's activity as keyframe percentages.
```css
.scene > * { animation-duration: 8s; animation-iteration-count: infinite; }
.step2 { animation-name: appear; } /* visible only 25%–60% of the timeline */
@keyframes appear { 0%, 22% { opacity: 0 } 25%, 60% { opacity: 1 } 63%, 100% { opacity: 0 } }
```
This keeps all steps perfectly synchronized and loops forever with zero JS. Use `animation-delay` staggering (`.item:nth-child(n) { animation-delay: calc(n * 120ms) }` — write them out, `calc` can't read `n`) only for entrance cascades, not for synchronized scenes.

### Counter / ticking numbers
CSS-only via `@property`:
```css
@property --count { syntax: '<integer>'; initial-value: 0; inherits: false; }
.counter { animation: count 3s ease-out forwards; counter-reset: value var(--count); }
.counter::after { content: counter(value); }
@keyframes count { to { --count: 4096; } }
```
Fallback for `<text>` inside SVG: a small `requestAnimationFrame` loop is fine.

## 3. Interactivity (when a style calls for it)

- **Play/pause**: toggle a class that sets `animation-play-state: paused` on the scene root. Give every looping graphic a pause affordance if it runs longer than ~5s.
- **Replay on scroll into view**: add the class that starts animations from an `IntersectionObserver` (`threshold: 0.4`). Also the fix for "the reader scrolled past frame one".
- **Stepper**: buttons that set `data-step="n"` on the root; CSS `[data-step="2"] .s2 { … }` shows each state. No animation library needed.
- **Slider-driven**: `<input type="range">` writing a CSS custom property (`el.style.setProperty('--t', input.value)`); elements position with `calc()` off `--t`. This is how "scrubbing" diagrams work.
- Keep all JS **inline, < ~60 lines, framework-free**, inside the snippet.

## 4. Non-negotiables (accessibility & robustness)

- **`prefers-reduced-motion`**: every graphic must include
  ```css
  @media (prefers-reduced-motion: reduce) { .g1 * { animation-duration: .01s !important; animation-iteration-count: 1 !important; } }
  ```
  and still communicate its point as a static image (design the final frame to be self-sufficient).
- **`role="img"` + `aria-label`** describing what the animation shows.
- **Text legibility**: minimum 12px effective size at max render width; use `font-family: ui-sans-serif, system-ui, sans-serif` or `ui-monospace, SFMono-Regular, Menlo, monospace` — never rely on webfonts inside an embed.
- **Theme safety**: never assume page background. Either draw your own background `<rect>` (opaque, part of the design) or verify on both white and near-black with `scripts/screenshot.mjs --dark`.
- **Loop hygiene**: loops must be seamless (end state == start state) or deliberately gapped with a 0.5–1s hold on the final frame (`animation-timing` percentages, not JS timeouts).

## 5. Choosing a technique (decision table)

| You want to show | Use |
|---|---|
| Data/requests moving between systems | flowing dashes, or packets via `offset-path` |
| A process with distinct phases | one-timeline staged sequence |
| Scale/parallelism (many workers) | staggered `animation-delay` cascade + counter |
| Before/after or state comparison | stepper or crossfade between two `<g>` layers |
| A quantity growing/shrinking | width/height via `transform: scaleX()` on a group, counter for the number |
| Physical/continuous systems (springs, queues, latency) | small inline `<canvas>` + rAF loop (see style-samwho) |

## 6. Verification loop (mandatory)

1. Write the snippet as a standalone `.html` file (snippet + minimal page shell).
2. `node scripts/screenshot.mjs file.html --at 0,1500,3000,4500` — frames must differ (motion exists) and each frame must be individually legible.
3. Repeat with `--dark`.
4. Look at the frames yourself. Check: nothing clipped by the viewBox, nothing overlapping text, loop seam invisible between last and first timestamp.
5. Only then hand over the snippet.
