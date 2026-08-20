---
name: style-planetscale
description: Create blog graphics in the PlanetScale blog style — flat monochrome schematics with dashed-inset boxes, database cylinders, JetBrains Mono caps labels, and honest constant-speed motion; ambient looping diagrams or interactive "lab" widgets with color-coded controls. Use for databases, sharding, replication, backups, storage, and parallelism.
---

# PlanetScale style — dashed-inset schematics

## Ideology

One diagram = **one idea**; a long article gets 9–20 small diagrams interleaved with prose, each showing the delta from the previous one. Two modes, pick per graphic:

- **Ambient** (backups-post style): autoplays, loops forever, zero visible controls — reads as live traffic, not a GIF (randomized request cadence does that).
- **Lab** (B-tree/IO-post style): the reader drives it with color-coded pill buttons, steppers, and sliders, and *measures* the point themselves (timers, counters) instead of being told.

Direction is shown by **motion, never arrowheads**. Data transfer is always linear-eased (constant speed = honest physics).

## Tokens

```css
.d { /* light */
  --bg: #FAFAFA;  --fg: #111111;
  --accent: #F35815;   /* brand orange — theme-invariant */
  --blue:   #144EB6;   /* storage / databases */
  --green:  #13862E;   /* router / coordinator */
  --yellow: #A78103;
  --purple: #5E49AF;
  --plumbing: #818181; /* connectors, traffic dots */
}
@media (prefers-color-scheme: dark) { .d {
  --bg: #111111; --fg: #FAFAFA;
  --blue: #0E73CC; --green: #27B648; --yellow: #F2B600; --purple: #A18BF5;
} }
```

Hue stays constant across themes, lightness flips; orange never changes. One semantic hue per component class (router = green, storage = blue, new/temporary infra = purple/yellow); gray `#818181` for all plumbing.

## Visual vocabulary

- **Box** (the signature): outer rect stroke-width 2, transparent fill, **plus an inset rect 8px in with `stroke-dasharray: 8 8` and fill = same hue at 0.10 opacity**. Busy components additionally get diagonal hatch lines at 0.30 stroke-opacity inside a clipPath.
- **Database**: a mini cylinder — path with curved bottom + top ellipse, stroke 1.35–1.5, fill = `var(--bg)`, in `--blue`; interior detail lines at 0.5 width. Canonical sharding picture: one wide green ROUTER box fanning out to N primary-above-two-replicas cylinder triangles.
- **Connectors**: orthogonal (Manhattan) polylines, `#818181`, 1.5px, `stroke-dasharray: 8 6`, round caps/joins, **no arrowheads**.
- **Labels**: `'JetBrains Mono', ui-monospace, monospace`, weight 500, **ALL CAPS**, centered (`text-anchor: middle; dominant-baseline: middle`), 18–32 units in a ~1500-wide viewBox, `user-select: none`.
- Wide flat canvas: viewBox ~`0 0 1500 600`, flat background rect, fixed aspect-ratio container.

## Motion grammar

- **Data flow**: marching ants — animate connector `stroke-dashoffset` by −14 per 0.9s, linear, infinite — or 7px gray dots moving at constant ~240 px/s along the polyline (duration = pathLength / 240).
- **Live traffic**: a pool of ~12 dots; each request fades in, travels through router → random shard (50/50 primary vs replica), the target's stroke flashes to the traffic color for 0.12s, returns, fades out. Next request scheduled at `0.7 + random()*0.6` s.
- **Pop in/out**: `back.out(1.5)`-style overshoot in, `power2.in` fade+drift out; structural moves `power2.inOut` 0.5–0.65s with 0.08–0.15s stagger across siblings. (In CSS: `cubic-bezier(.34,1.56,.64,1)` ≈ back.out; `cubic-bezier(.4,0,.2,1)` for in-out.)
- **Parallelism = bar race**: N rows of segmented tracks (1 segment vs 32), markers pop in staggered, all fills grow linearly at the same rate, per-row elapsed-time label pops when its bar finishes — the 32-way row finishes 32× sooner. Hold 2.5s, fade, reset, loop.
- **Playback discipline**: pause everything when off-viewport (IntersectionObserver) or tab hidden (visibilitychange); freeze on `prefers-reduced-motion`.

## Lab mode extras

Rounded control panel (secondary background `#ebebeb` / `#1a1a1a`) above or below the SVG: pill buttons (1px border, 6px radius, weight 600, `:active { transform: translateY(2px) }`), +/- steppers, sliders. **Each control's hue matches the SVG elements it affects** (purple = inner nodes, orange = leaves, blue = search, green = insert). Step sequencing at ~400ms per step with an optional speed slider; expose timers/counters so the reader discovers the conclusion.

## Recipe

1. Split the concept into one-idea diagrams; storyboard the deltas between consecutive ones.
2. Draw the static scene from the vocabulary above (boxes with dashed insets, cylinders, Manhattan connectors, caps mono labels).
3. Pick ambient or lab. Ambient: build looping timelines (CSS keyframes or a small rAF scheduler — no GSAP needed for a snippet) with linear transfer motion and randomized traffic. Lab: wire the color-coded controls, ~400ms steps, measurable output.
4. Wire theming purely through `--d-*` custom properties with the dark media query.
5. Verify screenshots in both themes at multiple timeline points; in ambient mode also confirm the loop reset is invisible.

See `references/example.html` for a complete annotated snippet.
