---
name: style-bun
description: Create blog graphics in the Bun blog style (bun.com/blog release posts) — dark dev-tool aesthetic with replayable line-timeline terminals, glowing benchmark progress cards, count-up counters, and comparison tables. Use for release notes, benchmark posts, CLI tools, and performance stories.
---

# Bun style — replayable dev-tool graphics

## Ideology

Release-note energy: the graphic *is the receipt*. Benchmarks, terminals, and counters show the claim happening — a terminal replays the actual command, a progress bar grows from the old version's mark to the new one, a counter counts up the delta. Every animation is **replayable via a button**, triggered on scroll-into-view (IntersectionObserver, threshold 0.2, once), and skipped under reduced-motion. Depth comes from 1px borders and background steps — **box-shadows are banned** (the only glow allowed is on hero metrics).

## Tokens

```css
.b { /* light */
  --canvas:#ffffff; --surface:#ffffff; --subtle:#f6f6f6; --line:#e2e2e2;
  --fg:#0a0a0a; --fg-muted:#525252; --fg-faint:#707070;
  --accent:#ff1f8f;          /* Bun pink — prompt glyph, deltas, badges, one fill */
  --cream:#fbf0df;           /* hero-metric color in dark mode */
  --code-bg:#f6f6f6; --success:#009150; --warning:#c27803;
}
@media (prefers-color-scheme: dark) { .b {
  --canvas:#0d0a0c; --surface:#0c0b0a; --subtle:#171316; --line:rgba(255,255,255,.08);
  --fg:#eaeae8; --fg-muted:#a8a8a5; --fg-faint:#808080;
  --accent:#ff2e97; --code-bg:#0d0d0d; --success:#28dc82; --warning:#f5b43c;
} }
```

Dark surfaces layer *transparent white* (`rgba(255,255,255,.02–.08)`), never grays. Pink is used sparingly; cream `#fbf0df` is reserved for the hero metric.

## Typography

- Headings: **Archivo** (Google Fonts, variable, bold, `line-height:1.02`); fallback `system-ui`.
- Everything data: **Martian Mono** (Google Fonts) at 13px/1.5 for terminals, 10–13px for charts, always `font-variant-numeric: tabular-nums`; fallback `ui-monospace, Menlo`.
- Signature micro-label: `mono 10px uppercase, letter-spacing:.14em, color:var(--fg-faint)` — use for table headers, card captions, axis labels.
- Cards: `border-radius:16px; border:1px solid var(--line); background:var(--surface)`; inner elements 8–12px radius.

## Signature element 1: the replayable terminal

- Container: 12px radius, 1px `--line` border, `background:var(--code-bg)`, mono 13px/1.5.
- Header (no macOS traffic lights): slim flex bar with bottom border and `--subtle` background — pink `❯` glyph, the command in `--fg`, a right-aligned `↻ replay` ghost button.
- Body: `padding:12px 16px`, `min-height` reserved for all lines so playback doesn't reflow; lines `white-space:pre`.
- **Line-timeline playback, not character typing**: each line is `{t: <absolute ms>, text, cls}`; playback schedules one `setTimeout(t/speed)` per line. Revealed lines transition `opacity 0→1, translateY(2px)→0` over 80ms ease-out.
- Multi-process output: colored `name |` prefixes, padded to equal width, colors assigned first-seen from `[pink, sky, amber, emerald, violet, rose]` (700-shades light, 400-shades dark).
- Color grammar: `$ command` lines in `--fg-faint`, results in `--fg`, "Done in Xms" in `--success`, values in `--warning`, errors red.
- Write **plausible real output** — realistic timings, file paths, byte counts. Fake-looking logs kill the effect.

## Signature element 2: benchmark graphics

Two idioms — pick per data shape:

1. **Comparison table** (few scenarios × few tools): your tool's column first, its value bold in `--fg` with a small `N× faster` line beneath in pink; competitor values tinted cream (`#f3d2a0` in dark); secondary metric (memory) as a faint 11px third line; 10px uppercase header row; a `source ↗` link in the card's top-right.
2. **Progress-card grid** (many items with a before/after): per-item card with mono label, optional pink pill badge (`8.5px uppercase, border accent/40`), a 6px `rounded-full` track (`--line` background) with:
   - fill animated `transform: scaleX(var(--sx)) → 1` over `700ms cubic-bezier(.2,.7,.2,1)`, `transform-origin:left`, where `--sx` starts at old/new ratio;
   - dark-mode fill = **cream gradient with glow**: `linear-gradient(90deg,#fdf8ec,#efe2c7); box-shadow:0 0 12px rgba(251,242,225,.25)`; light mode = solid pink;
   - a 1px `white/25` tick marking the "before" position;
   - value row `349 / 358  +133` in 11px tabular mono, delta in pink.
   Stagger cards across ~4s total (card *i* fires at `i/(n-1) * 4000` ms). Crown with a big count-up number (`+1,517`) via rAF with cubic ease-out (`1-(1-t)^3`) and, in dark, `text-shadow: 0 0 24px rgba(251,112,186,.35)`.

While resetting for replay, wrap in a no-transition guard (`[data-rewind] * { transition:none !important }`), then double-`requestAnimationFrame` before playing.

## Other vocabulary

- Diagrams: flat inline SVG (rects + 1.5px lines), colors via custom properties paired per theme, animated by staggered class toggles (~400ms first wave, +350ms per hop), clickable to step scenarios.
- Easings: `--ease-out: cubic-bezier(.22,1,.36,1)`, `--ease-in-out: cubic-bezier(.65,0,.35,1)`.
- Buttons: ghost style, `▶ play` / `↻ replay` / `◼ playing…` labels.

## Recipe

1. Decide the receipt: what command/number proves the claim? Get realistic data (real timings, counts).
2. Build the static final state first (all lines shown, bars full, counter at target) — that's the reduced-motion and pre-JS state.
3. Add the timeline: line timestamps for terminals, stagger offsets for card grids, one rAF counter.
4. Wire IntersectionObserver (threshold 0.2, once) to start, and a replay button that clears timers and restarts.
5. Verify by screenshotting mid-playback and done states in both themes; the done state must read as a complete, legible figure.

See `references/example.html` for a complete annotated snippet.
