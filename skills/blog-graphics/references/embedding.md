# Embedding the finished graphic

Every graphic ships as one self-contained snippet. How it's delivered depends on the user's blog platform — ask if unknown, or infer from the repo you're working in.

## Deliverable format

Produce two files per graphic:

1. `<slug>.html` — the snippet itself: one root element (usually `<figure>` or `<svg>`), scoped `<style>`, optional inline `<script>`. No external requests of any kind.
2. `<slug>.preview.html` — the snippet wrapped in a minimal page shell (light + dark toggle) used only for local preview and screenshotting. Not shipped.

## Per-platform notes

| Platform | How to embed |
|---|---|
| MDX / Astro / Next.js blog | Paste snippet into the MDX file directly, or save as a component that returns it via `dangerouslySetInnerHTML`. Scoped class prefixes make this safe. |
| Plain Markdown (Hugo, Jekyll, Eleventy) | Raw HTML blocks pass through by default in most configs. Hugo needs `unsafe = true` under `[markup.goldmark.renderer]`, or use a shortcode. |
| Ghost / WordPress | Use an HTML card / Custom HTML block. Inline `<script>` works in both. |
| Medium, Substack, dev.to | Inline HTML is stripped. Export an animated fallback instead: record with `scripts/screenshot.mjs` frames → assemble a GIF/MP4 (`ffmpeg -framerate 30 -i frame-%d.png out.mp4`), or host the snippet on a page and embed via iframe where supported. |
| Email newsletters | CSS animation support is inconsistent. Use SMIL (`<animate>`, `<animateMotion>`) inside the SVG, or ship a GIF. |

## Sizing contract

- Root element: `style="max-width: <design-width>px; width: 100%; margin-inline: auto;"`.
- Design widths: 680–760px for in-column graphics, up to 960px for full-bleed. Verify legibility at 360px (phone) — if labels collapse, either enlarge text or simplify the diagram; never let it become unreadable at mobile width.
- Never set fixed pixel heights on the root; let `viewBox` aspect ratio control height.

## Checklist before handing over

- [ ] Zero network requests (check the preview page with devtools or `grep -E 'https?://' <slug>.html` — only `xmlns` and `aria` URLs allowed).
- [ ] Class/keyframe/id names prefixed with the graphic's slug.
- [ ] `prefers-reduced-motion` block present.
- [ ] `role="img"` + meaningful `aria-label`.
- [ ] Verified on light and dark backgrounds via screenshots.
- [ ] Loop seam checked (screenshot just before and just after loop boundary).
