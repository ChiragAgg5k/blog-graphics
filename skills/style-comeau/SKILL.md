---
name: style-comeau
description: Create blog graphics in the joshwcomeau.com style — whimsical interactive playgrounds built on a strict HSL design-token system, where readers learn by toggling a property and watching the consequence animate. Use for frontend/CSS/animation topics, tutorials, and any post where "let the reader break it" teaches best.
---

# Josh Comeau style — whimsical playgrounds

## Ideology

The graphic is a **playground, not a picture**: one control (toggle, slider, or draggable thing), one visible consequence, animated by CSS transitions so cause→effect is felt. Whimsy is deliberate — springy overshoot, a wink of personality — but it sits on *strict* token discipline: a rigorous HSL palette and spacing system defined once, everything derived from it. The perceived quality is 80% token discipline, 20% whimsy.

Teach by letting the reader break it: the default state is correct, the control lets them make it wrong (or wonderful), and the animation shows why.

## Palette — HSL tokens, defined once at the root of the snippet

```css
--primary:    hsl(240deg 95% 62%);   /* indigo — actions, the "hero" element */
--secondary:  hsl(333deg 100% 45%);  /* magenta-pink — accents, highlights */
--decorative: hsl(200deg 75% 65%);   /* sky — backgrounds of decorative shapes */
--success:    hsl(145deg 100% 27%);
--error:      hsl(340deg 95% 39%);
--alert:      hsl(37deg 100% 50%);
--gray-100:   hsl(225deg 25% 95%);   /* panel background */
--gray-700:   hsl(225deg 12% 40%);   /* secondary text */
--gray-900:   hsl(225deg 25% 12%);   /* text, strokes */
```

Dark variant: flip grays (`--gray-100: hsl(210deg 30% 12%)`, text `hsl(210deg 10% 90%)`), lighten primary to `hsl(240deg 100% 75%)`. Derive every color from these tokens — no ad-hoc hex anywhere in the snippet.

## Shapes, typography, texture

- Soft cards: panels with `border-radius: 12–16px`, subtle layered shadow (`0 1px 2px hsl(225deg 25% 12% / .1), 0 4px 12px hsl(225deg 25% 12% / .08)`).
- Friendly geometry: circles, blobs, rounded rects; the "hero" element often has a face-like simplicity.
- Type: `ui-sans-serif` at 14–16px for labels; controls get real `<label>`s. Numbers in `ui-monospace`.
- Generous padding (24px+ inside panels). Cramped = broken in this style.

## Motion & interaction grammar

- **CSS transitions do the animating; JS only flips state.** Toggle sets `data-on` / a class; consequence transitions with a springy curve:
  ```css
  transition: transform 500ms cubic-bezier(.2, 1.4, .3, 1); /* overshoot = spring feel */
  ```
- Theme/state swaps use `350ms cubic-bezier(0.41, 0.1, 0.13, 1)`.
- Controls are the design's jewelry: hand-styled toggle switches (a pill with a sliding thumb), range sliders with a fat grabbable thumb, buttons with a pressed transform (`:active { transform: translateY(1px) }`).
- Reward interaction: a tiny sparkle, a bounce, a color pop when the reader does the thing. One reward, not confetti storms.
- Everything works with JS disabled: default state must be the correct/instructive one.

## Recipe

1. Identify the single property the reader should *feel* (easing curve, flex-grow, spring stiffness, z-index…).
2. Build a card: panel, the demo subject in the middle, one labeled control below it.
3. Wire control → `data-*` attribute or CSS custom property; let transitions animate the consequence. For continuous controls, write the value into a custom property and use `calc()`.
4. Add the whimsy pass *last*: springy curve on the hero transition, styled control, one micro-reward.
5. `prefers-reduced-motion`: transitions drop to 0.01s; the playground still functions.
6. Screenshot both states (control off/on, slider min/max) in light and dark — both states must be legible and obviously different.

See `references/example.html` for a complete annotated snippet.
