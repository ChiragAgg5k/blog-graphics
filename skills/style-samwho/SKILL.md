---
name: style-samwho
description: Create blog graphics in the samwho.dev (Sam Rose) style — playful flat simulations with the Okabe-Ito colorblind-safe palette, where the concept becomes a tiny living system the reader can watch and poke. Use for algorithms, load balancing, queues, rate limiters, probabilistic data structures.
---

# samwho.dev style — toy simulations

## Ideology

Every concept becomes a **tiny living system you watch run**: requests are colored balls dropped onto servers, memory is a strip of cells, a hash function is a chute that sorts marbles. Nothing is a static diagram — everything is a continuously running simulation, ideally with a knob or two. The argument of the post is made by a *sequence* of simulations, each isolating one parameter change (round-robin → weighted → least-connections). When you build in this style, ask: "what is the smallest simulation whose behavior *is* the point?"

Motion is honest: constant-velocity particles driven by simulation time, no decorative easing, no entrance flourishes. Things flow perpetually even when untouched.

## Palette — Okabe-Ito, verbatim, never substitute

```css
--oi-orange:     #E69F00;  /* first series / primary actor */
--oi-sky:        #56B4E9;  /* second series */
--oi-green:      #009E73;  /* success / healthy */
--oi-vermillion: #D55E00;  /* danger / dropped / overloaded */
--oi-pink:       #CC79A7;  /* third series */
--oi-yellow:     #F0E442;  /* highlight / in-flight */
--oi-blue:       #0072B2;  /* fourth series / structure */
```

Rules: flat fills only — no gradients, no drop shadows, no strokes-with-shadows. Background is warm off-white `#FBF9F6` (own it with a background rect; in dark contexts keep the same warm panel — this style does not go dark). Neutral structure (boxes, tracks) in `#2D2A26` at 1.5–2px stroke or soft gray `#D8D3CC` fills. Assign colors *semantically* and reuse the same meaning across every graphic in a post.

## Shapes & typography

- Rounded everything: `rx="8"`-ish on rects, circles for anything that moves.
- Actors are simple: servers = rounded rects with a tiny status dot, requests = 8–12px circles, queues = slots outlined in gray that fill with colored circles.
- Labels: `ui-monospace` for values/counters, `ui-sans-serif` for names, 12–14px, `#2D2A26`.
- Optional mascot energy: small emoji-free charm (a dog, a flag) only if it narrates something.

## Motion & interaction grammar

- **rAF simulation loop** in plain JS (no Pixi, no libs): entities with position/velocity, moved by `dt`, drawn by updating SVG attributes or `transform`. ~40–80 lines is typical.
- Requests travel from spawner → along straight or gently curved paths → into a server slot; served requests pop and increment a per-server monospace counter.
- Failure states: circle turns `--oi-vermillion` and drops off the bottom with slight gravity.
- Controls, in this order of preference: 1) nothing (it just runs), 2) one `<input type="range">` for the load-bearing parameter (request rate, weight), 3) play/pause. Never more than two controls.
- Slider styling: plain range input with an accent-color matching the parameter it controls.
- If the reader does nothing for 30 seconds, the simulation should still have told the story.

## Recipe

1. Define the system: spawner(s), processor(s), a queue or route between them, and the one parameter that matters.
2. Draw the static scene as inline SVG (background rect, tracks, servers with counters at 0).
3. Add the rAF loop: spawn on an interval derived from the slider, move entities, resolve arrival (increment counter, flash server fill to the entity's color for 150ms).
4. Tune rates so at default settings the interesting behavior (imbalance, overflow, drops) appears within ~5 seconds and is visible at a glance.
5. Honor `prefers-reduced-motion`: skip the loop and render a representative mid-simulation freeze-frame with counters pre-filled.
6. Screenshot at 0/2000/5000ms — counters must differ between frames and the scene must never look empty.

See `references/example.html` for a complete annotated snippet.
