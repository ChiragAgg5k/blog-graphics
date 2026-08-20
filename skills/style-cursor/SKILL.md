---
name: style-cursor
description: Create blog graphics in the Cursor engineering blog style (e.g. "Git at any scale") — austere hairline schematics in tiny monospace caps on warm paper, where color means semantics and time means physics. Use for infrastructure, protocols, storage, and systems posts with a serious engineering tone.
---

# Cursor style — hairline simulation schematics

## Ideology

**An engineer's whiteboard drawn with 1px hairlines and tiny monospace caps on warm paper, where color means semantics and time means physics.** Nothing is decorated: every color is a meaning, every motion is a modeled event (a request crossing a network, an object being fetched), and timing is derived from believable numbers (latency + bytes/bandwidth), not arbitrary tweens. Packets travel at constant speed — linear easing — because data on a wire doesn't ease. Nothing appears until the event that produces it "arrives".

## Tokens — define once on the graphic root, never hardcode on elements

```css
.g { /* light */
  --bg: #f7f7f4;  --ink: #26251e;
  --tone-accent: #f54e00;  /* the important action — Cursor orange */
  --tone-data:   #2268ff;  /* uploads / reads / data */
  --tone-commit: #019f52;  /* commits / success */
  --tone-lock:   #ec77bf;  /* locks / coordination */
  --tone-error:  #cf2d56;
}
@media (prefers-color-scheme: dark) { .g {
  --bg: #14120b;  --ink: #edecec;  --tone-error: #e05c7d; /* tones otherwise unchanged */
} }
```

Everything else is **derived by color-mix**, which is what makes light/dark free:

```css
.g [data-tone] { --fill: color-mix(in srgb, var(--tone) 12%, transparent); }
.g .edge  { stroke: color-mix(in srgb, var(--ink) 28%, var(--bg)); }
.g .lane  { stroke: color-mix(in srgb, var(--ink) 34%, var(--bg)); stroke-dasharray: 3 5; }
.g .border { stroke: color-mix(in srgb, var(--ink) 10%, transparent); }
```

Elements carry `data-tone="data|commit|lock|accent|error"`; CSS resolves fill (12% tint) and stroke (full tone). Secondary text = ink at 60%, tertiary at 40%.

## Geometry & typography

- **Hairlines everywhere**: node stroke 1px (active nodes 1.75px), edges 1px, tiny radii (rx 2–3 on cells/nodes/packets). Figure shell: 1px border at ink@10%, 8px radius, 16px padding, background `var(--bg)`.
- Wide cinematic viewBox, e.g. `0 0 1080 500`, `preserveAspectRatio="xMidYMid meet"`, width 100%.
- **All monospace** (Berkeley Mono on the real site — use `ui-monospace, SFMono-Regular, Menlo, monospace`). ViewBox-unit sizes: title 12, header 10, label 8, meta 7. Labels UPPERCASE, weight 700, letter-spacing .02–.05em.

## Visual vocabulary

- **Entity card**: 108×48 rect rx 3, 1px stroke, with a **4px tone-colored key bar** on the left edge; label + a `meta` line like `commit · c8f3` in ink@60%.
- **Pending state**: dashed stroke `3 2.5` at tone@40%, `?` label — filled in when its data arrives.
- **Boundary lane** (NETWORK, DISK): vertical dashed line `3 5` with a caps label — the stage across which everything travels.
- **Packet**: 38×22 rect rx 3 carrying a short mono verb: `GET idx`, `PREP`, `VOTE`, `ACK`, `COMM`, `GET If-None-Match e1`.
- **Arrowheads**: tiny `polygon points="0 0, 8 3, 0 6"` rotated to the edge angle.
- **Counters**: plain mono text in a corner — `objects 12/54 · round-trips 3`.
- Long, paragraph-length `aria-label` narrating the whole loop.

## Motion grammar — a simulation, not keyframes

1. Build an **event schedule** `{id, startMs, endMs}` from modeled physics: `transferMs = latency + bytes / (125e3 * Mbps / 1e3)`. Scene length 7–12s, looping (optional 1s loop pause).
2. One rAF clock; **commit updates at ~24fps** (skip frames between 1000/24ms commits) — the slightly steppy, film-like cadence is part of the look.
3. Each frame derive everything from `elapsedMs`: packet position = **linear** lerp (or quadratic Bézier) along its segment — no easing on travel; entity states flip via `data-state="pending|active|visited"` attribute swaps.
4. **Soften transitions, not motion**: `transition: fill .14s, stroke .14s, stroke-width .14s` on state-carrying shapes; enter/exit as tiny 0.2–0.3s easeOut fades (`opacity 0→1, scale .6→1, y -6→0`).
5. Pause when offscreen (`IntersectionObserver`, 160px rootMargin); freeze entirely on `prefers-reduced-motion`; support `?freeze=<ms>` for reproducible screenshots.

## Recipe

1. Model the protocol/process as numbered events with realistic timings; write the schedule as a JS array.
2. Lay out the static scene: entities on both sides of a lane, counters at zero, downstream objects in `pending` state.
3. Write the clock + per-frame deriver (~50 lines of vanilla JS): move packets, flip `data-state` when events complete, tick counters.
4. Style entirely through tokens + `data-tone`/`data-state` CSS — if you catch yourself putting a hex on an element, stop.
5. Verify: screenshot at 0 / mid / just-before-loop in light and dark; the final frame must show the completed state legibly.

See `references/example.html` for a complete annotated snippet.
