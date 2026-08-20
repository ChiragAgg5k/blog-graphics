# Interaction patterns for blog graphics

When a graphic should be *played with*, not just watched. Distilled from the interactive essays and posts this repo studies (loggingsucks.com, PlanetScale's lab widgets, Josh Comeau's playgrounds, Bun's replayable demos, samwho's simulations, Ciechanowski's scrubbers). Style skills reference these patterns; this file is the shared grammar.

## When to make it interactive

Make it interactive when the reader's *choice* is the lesson (a trade-off, a parameter, a failure mode they should experience). Keep it ambient when the mechanism is fixed and the reader just needs to see it run. One widget answers **exactly one question** — if a control doesn't change the answer to that question, cut it.

## The core loop: act → three responses

Every input must immediately change three things:

1. **The picture** — the visualization itself.
2. **A number** — one big quantified consequence (`2rem`, bold, `tabular-nums`).
3. **A sentence** — a judgment/explanation **computed from the current state**, never static ("At 10% sampling you have a 90% chance of missing any specific error"). Template it as a function of state.

If any of the three is missing, the interaction feels dead.

## The pattern catalog

| Pattern | Reader does | Best for | Key detail |
|---|---|---|---|
| **Stream on click** | Presses one primary button; 15–30 lines/items pour in | Volume, chaos, "imagine this at scale" | `await randomDelay(30, 80)` per item — awaited timeouts, not tweens; live counter alongside |
| **Slider that regenerates** | Drags; picture rebuilds every `input` | Rates, scale, thresholds | Rebuild as one `innerHTML` string for perf; stable per-item pseudo-randomness so dragging feels continuous, not re-shuffled |
| **Rigged input** | Types/searches what the prose suggested | Letting the reader *fail authentically*, then revealing why | Recognize the exact suggested terms; each triggers a scripted revelation; always have a fallback response |
| **Naive-vs-deliberate toggle** | Flips one switch contrasting two approaches | "Same tool, different discipline" arguments | Both panels update together; deadpan caption under each result |
| **Checkboxes → live artifact** | Toggles options; a JSON/score/preview updates live | Composition, coverage, configuration | Add scenario checkers that flip Yes/No with "Missing: x, y" computed from the selection |
| **Stepper** | Prev/Next through stages | Lifecycles, protocols, accumulation | An artifact visibly accumulates per step (count badge + progress bar); payoff callout on the final step |
| **Dot field + slider** | Drags a rate; hundreds of status dots fade | Sampling, loss, probability — visceral scale | 6px dots, dropped ones to `opacity:.15` with a .3s transition; stats row recomputes |
| **Scrubber** | Drags one slider bound to `--t` (0–1) | Continuous mechanisms, time, geometry | Everything a pure function of `--t` via `calc()`; the slider is the primary verb (see style-ciechanowski) |
| **Replayable timeline** | Watches; can press `↻ replay` | Terminals, benchmarks, one-shot reveals | Absolute per-item timestamps, IntersectionObserver start, replay clears timers and restarts (see style-bun) |
| **Toggle playground** | Flips a state; CSS transitions show the consequence | Frontend/CSS properties, before/after | JS only flips `data-*`; transitions do all animating (see style-comeau) |

## Progressive reveal (narrative order)

Hide the escalation control and the takeaway callout with `display:none` until the reader completes act one. The sequence is: naive experience → earned control → computed moral. A callout that's visible before the reader has acted is a spoiler; a control that's visible too early is noise.

## Fake data is the soul

- Hand-write 15–30 rows of **hyper-plausible** domain data: real-looking IDs, timestamps with millisecond jitter, genuine error codes (`insufficient_funds`, `ECONNRESET`), believable latencies. Believability is what makes both the lesson and the jokes land.
- Seed generated datasets so the inputs the prose suggests always return something.
- Every number shown must be internally consistent (totals add up, rates match counts) — readers check.

## Mechanics that keep it robust

- **No framework, no build**: one `let state = {…}` object; `render()` writes a template literal into the container; small `update*()` functions patch by id. `innerHTML` rebuilds of subtrees are fine at widget scale.
- Scope everything: widget-specific CSS inside the snippet, selectors prefixed with the widget's id/class.
- Static fallback: the container ships with a meaningful pre-JS state (the final/most instructive frame), so no-JS readers and reduced-motion readers still get the point.
- Controls must be real form elements (`<button>`, `<input type=range>`, `<label for>`) with `aria-label`s; the whole widget gets a `role="group"`/`aria-label` describing what playing with it shows.
- Immediate response: handle `input` (not `change`) on sliders; never debounce below 100ms of perceived latency.
- Reset affordance for anything with an end state (`↻ replay`), and `localStorage` only for deliberately persistent widgets (checklists/scores).

## Verifying interactive graphics (extends the core checklist)

Screenshot the *state machine*, not just the timeline: initial state, mid-interaction, post-reveal, and both extremes of every control (slider min/max, each toggle side). Drive the controls with the same script that screenshots (Playwright `fill`/`click`). Check that the judgment sentence on screen actually matches the state shown — a wrong computed sentence is worse than a static one.
