---
name: style-ciechanowski
description: Create blog graphics in the ciechanow.ski (Bartosz Ciechanowski) spirit — "Ciechanowski-lite" — museum-grade figures scrubbed by a slider rather than played, with prose words color-linked to diagram parts. Use for geometric, mechanical, or continuous processes where the reader should control time or angle by hand.
---

# Ciechanowski style (lite) — scrub, don't play

## Ideology

The real ciechanow.ski posts are bespoke WebGL engines with photoreal 3D — months of work, out of scope. What transfers, and what this skill reproduces, are his two disproportionately effective ideas:

1. **The slider is the primary verb.** Figures don't autoplay; the reader scrubs a range input that drives the figure's time/angle/progress. Scrubbing back and forth is how understanding happens. One figure = one slider = one dimension of change.
2. **Prose and figure share a color channel.** Parts under discussion are tinted with semantic colors, and the *words in the surrounding sentence get the same color* ("the <span class=blue>balance wheel</span> pushes the <span class=yellow>pallet fork</span>"). The figure and the sentence become one instrument.

Depict the **actual mechanism**, not a metaphor: real proportions, real geometry, correct motion relationships (if gear A has twice the teeth, it turns at half the rate — get the physics right, readers notice).

## Palette

Neutral machine + semantic tints on parts under discussion:

```css
--paper:  #FFFFFF;          /* figure background — clean white, always */
--metal:  #B8BCC2;          /* neutral parts, fills */
--metal-dark: #7A7F87;      /* neutral strokes, 1.5px */
--ink:    #333333;          /* labels */
--part-blue:   #4A90D9;     /* first discussed part  */
--part-yellow: #E8B93E;     /* second discussed part */
--part-red:    #D95B4A;     /* third discussed part  */
--part-green:  #58A55C;     /* fourth discussed part */
```

Tints are muted, not neon; apply as fills with a darker stroke of the same hue. At most 3–4 tinted parts per figure. Subtle depth allowed here (unlike samwho): a soft same-hue darker edge or 2-stop gradient to suggest roundness — but no drop shadows.

## Figure grammar

- Container: white card, thin `#E5E5E5` border, generous padding; slider centered underneath in its own gutter — a plain, wide range input with a large round thumb.
- The slider maps to a single scalar `--t` (0–1). Everything in the figure is a pure function of `--t`: rotations via `transform: rotate(calc(var(--t) * 360deg))`, progress via `stroke-dashoffset: calc(...)`, assembly/explosion via translate.
- Set `transform-box: fill-box; transform-origin: <pivot>` per part; mechanisms live or die on correct pivots.
- Multiple linked parts move at *mechanically correct* ratios from the same `--t` (gear ratios, phase offsets).
- Optionally add a tiny "play" that just auto-advances the slider slowly; scrubbing pauses it.
- Labels sparse; the color-linked prose carries the naming.

## Recipe

1. Choose the one scalar the reader should control (time, rotation, insertion depth, load).
2. Draw the mechanism as inline SVG with correct proportions; group each moving part in its own `<g class="part">` with its pivot set.
3. Wire: `input.addEventListener('input', e => figure.style.setProperty('--t', e.target.value))` — that's the entire JS.
4. Express every part's motion as a `calc()` of `--t` with the mechanically correct multiplier/offset. Verify ratios by hand.
5. Deliver alongside the snippet a set of `<span>` color classes (`.part-blue { color: var(--part-blue); font-weight: 600 }`) and tell the author which words in their prose to wrap.
6. Screenshot at `--t` = 0, 0.33, 0.66, 1 — parts must move in visibly correct relationships and never intersect wrongly.

No autoplay means `prefers-reduced-motion` is satisfied by design; still include the media query to freeze the optional auto-advance.

See `references/example.html` for a complete annotated snippet.
