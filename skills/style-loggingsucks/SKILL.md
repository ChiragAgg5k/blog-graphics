---
name: style-loggingsucks
description: Create blog graphics in the loggingsucks.com style (Boris Tane) — dark-terminal interactive essay widgets where the reader does something, fails or discovers authentically, and the punchline is computed from their own action. Use for opinionated technical essays, observability/infra topics, and any post that teaches by letting the reader play.
---

# loggingsucks style — rigged toys with a voice

## Ideology

The widget is an **argument the reader runs**. Each one answers exactly one question by making the reader act: click a button and watch chaos stream in, search a rigged log file and fail, drag a slider and watch your errors vanish. The moral is never static text — it's **computed from the reader's own action** ("At 10% sampling you have a 90% chance of missing any specific error"). Controls appear in narrative order: the escalation slider and the takeaway callout stay hidden until the first act completes.

Voice is part of the design: confident, funny, second-person, mildly abusive toward the reader's infrastructure ("Good luck finding anything"). Deadpan captions under reveals. The fake data must be *hyper-plausible* — real-looking IDs, millisecond jitter, actual error codes (`insufficient_funds`) — because believable data is what makes the jokes land.

## Tokens

```css
--black:#0a0a0a;   /* page/panel bg */     --white:#f5f5f5;  /* headings, primary buttons */
--red:#ff2b2b;     /* THE accent — sparingly */
--green:#4ade80; --yellow:#fbbf24; --blue:#60a5fa; --gray:#666;
```

Surfaces: `#0a0a0a` page, `#111` terminals, `#1a1a1a` tooltips; hairlines `rgba(255,255,255,.06–.1)`; fills `rgba(255,255,255,.02–.05)`. **Text is an opacity ladder, never pure white**: `.7` body, `.5` descriptions, `.4` muted, `.2` timestamps/line numbers. Log levels: debug green, info blue, warn yellow, error `rgba(248,113,113,.8)` — all at ~.7–.8 alpha. JSON tokens: keys `#7dd3fc`, strings `#86efac`, numbers `#fbbf24`, booleans `#f472b6`. Callouts: `rgba(96,165,250,.05)` background + 2px `#60a5fa` left border. This style owns its dark background — it does not theme-flip.

## Typography — the three-font contract

- **Instrument Serif** (or `Georgia, serif` fallback) for widget titles — the elegant editorial serif colliding with machine output *is* the visual thesis.
- **Inter / system sans** 16px, line-height 1.7 for UI text and judgments.
- **JetBrains Mono / ui-monospace** for anything machine-made: logs 0.75rem, code 0.8rem, JSON.
- Micro-labels: small-caps/uppercase with `letter-spacing:.1–.2em`.

## Terminal chrome (the signature drawing)

`#111` box, 4–8px radius, 1px white-alpha border; header strip with three 10px dots — all rendered gray `#6b7280` at .6 opacity (a monochrome ghost of macOS); bottom `linear-gradient(transparent, #111)` fade instead of hard clipping.

## Interaction grammar — pick 1–2 per widget

1. **Stream on click**: a primary button pours in 15–30 canned lines with `await randomDelay(30, 80)` per line, newest first, alongside a live counter. Not tweening — awaited timeouts.
2. **Slider that regenerates**: every `input` rebuilds the visualization from state (one `innerHTML` string for perf) and recomputes the judgment sentence.
3. **Rigged input**: a search/text box that recognizes the exact terms the surrounding prose tells the reader to try, each triggering a scripted revelation. Let them fail authentically at a rigged task, then hand them the fix.
4. **Naive-vs-deliberate toggle**: one button flips both panels to show what each approach actually captures, with a deadpan caption ("4 fields. Good luck debugging with this.").
5. **Checkboxes → live artifact**: toggles feed a live JSON/score preview plus scenario checkers that flip Yes/No with "Missing: field, field" computed from the selection.
6. **Stepper**: Prev/Next through stages, an artifact accumulating fields with a count badge and progress bar, payoff callout on the last step.
7. **Dot field + slider** (visceral): hundreds of 6px status dots; the slider fades dropped ones to `opacity:.15`; a stats row and computed callout update live.

**Every input immediately changes three things**: the picture, a big number (`2rem` white bold), and a sentence of judgment (muted italic). Progressive reveal via `display:none` until earned.

## Implementation pattern

- No framework, no build: one plain state object (`let state = {…}`), `render()` writes a template literal to `container.innerHTML` (including a scoped `<style>` prefixed with the widget id), small `update*()` functions patch elements by id. Rebuilding subtrees with `innerHTML` is fine at this scale.
- Entrances `fadeUp .8s ease-out` staggered .1/.3/.5s; log lines fade in over .2s with 4px translateY; reveals `slideDown .3s`; new JSON fields flash a 1s background decay. **Nothing bounces or springs** — drama comes from timing and reveal order, not motion.
- Ambient option (zero JS): duplicate a log list once and scroll it with a 20s linear infinite `translateY(-50%)` keyframe behind a gradient fade.
- Persistent widgets (checklists, scores) may use `localStorage`.

## Recipe

1. State the one question this widget answers, and what the reader must *do* to discover the answer.
2. Hand-write the fake dataset first (15–30 hyper-plausible rows; seed it so the prose-suggested inputs always hit).
3. Build act one (the naive experience), then the hidden escalation control, then the computed callout. Wire reveals in that order.
4. Write the judgment sentences as functions of state, and give them the voice.
5. Skin it: dark terminal chrome, three-font contract, opacity-ladder text, one red accent.
6. Verify by scripting the interactions in screenshots: initial state, mid-stream, post-reveal, extreme slider positions. Every state must be legible and the callout text must actually match the state shown.

See `references/example.html` for a complete annotated snippet (a sampling-trap style widget).
