---
name: blog-graphics
description: Create stunning animated graphics for technical blog posts, modeled on the design ideologies of exceptional engineering blogs (Cursor, PlanetScale, samwho.dev, Josh Comeau, Bartosz Ciechanowski). Use when the user wants an animated diagram, illustration, or interactive figure for an article, README, or docs page. Routes to a style skill, then guides build + screenshot verification.
---

# Blog graphics

You produce **one self-contained HTML/SVG snippet** per graphic — no build step, no external requests — that a reader would believe came from a top-tier engineering blog. The craft lives in three places: picking the right *concept* to animate, committing fully to one *style ideology*, and *verifying* with screenshots before delivering.

## Process (follow in order)

### 1. Understand the concept before drawing anything

Ask (or infer from provided draft/post): what is the one idea the graphic must make obvious in 3 seconds? A great blog graphic shows **one mechanism** (data flows here, these run in parallel, this splits into that) — not an architecture inventory. If the user's ask contains more than one mechanism, propose splitting into multiple graphics.

Write one sentence before coding: "This graphic shows ___ by animating ___." If you can't, you're not ready.

### 2. Pick a style — offer the gallery, then commit

If the user hasn't chosen, present this table and let them pick a style to **copy exactly** or use as a **remix base**:

| Style skill | Ideology in one line | Best for |
|---|---|---|
| `style-cursor` | Austere dark-mode minimalism — thin lines, monochrome + one accent, restrained motion | Infra/systems posts, serious engineering tone |
| `style-planetscale` | Precise schematic diagrams with player controls — light/dark aware, stepped simulations | Database/distributed-systems mechanics, anything with discrete steps |
| `style-samwho` | Playful pastel toys — rounded shapes, live simulations the reader can poke | Algorithms, queues, probabilistic structures |
| `style-comeau` | Whimsical interactive playgrounds — springy motion, sliders, delight-first | Frontend/CSS/animation topics, tutorial posts |
| `style-ciechanowski` | Museum-grade continuous simulations — physical realism, scrubbable | Physics-adjacent or geometric concepts (advanced; budget accordingly) |

Once chosen, **read that style skill fully** and obey its palette, typography, line weights, and motion rules exactly. Half-applied styles look AI-generated; fully-applied ones look designed. For "remix", pick one style as the base for layout/motion and change only what the user asked to change.

### 3. Read the technique references

- `references/animation-techniques.md` — the motion building blocks, scoping rules, `transform-box` gotcha, reduced-motion requirements. Non-optional.
- `references/embedding.md` — deliverable format and platform notes.

### 4. Storyboard in text, then build

Write a 3–6 line storyboard (t=0s: …, t=1.5s: …, loop: …) in your reply before coding. Then build `<slug>.html` (the snippet) and `<slug>.preview.html` (page shell for testing). Compose from the technique recipes; don't invent novel animation machinery when a recipe fits.

### 5. Verify with screenshots — mandatory, no exceptions

```
node scripts/screenshot.mjs <slug>.preview.html --at 0,1500,3000,4500
node scripts/screenshot.mjs <slug>.preview.html --at 0,1500,3000,4500 --dark
```

Look at every frame. Reject and fix if: frames are identical (nothing moves), any text overlaps or clips, elements escape the viewBox, the loop seam jumps, or dark mode is illegible. Iterate until clean. If playwright is unavailable, use the browser tools you have (Playwright MCP) to load the preview and screenshot; if neither exists, say explicitly that the graphic is visually unverified.

### 6. Deliver

Hand over the snippet file plus a one-paragraph embed instruction for the user's platform (see `references/embedding.md`). Offer the GIF/MP4 fallback path if their platform strips HTML.

## Quality bar

- The static final frame must work as a standalone illustration (readers on reduced-motion, RSS, and print see only that).
- Every label earns its place — if removing a label loses nothing, remove it.
- Motion has a reason: things move because the concept moves, never for decoration.
- 60 seconds of looking should reveal no default-looking choices: no `#ff0000`, no browser-default fonts inside a styled scene, no unstyled arrowheads.
