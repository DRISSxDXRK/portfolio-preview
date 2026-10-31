# DESIGN.md — Portfolio v2 "Midnight Cutting Room"

Direction, picked before code: a dark cutting-room editorial page for a
video editor. Flat color, one lavender accent, hairline rules, big
grotesk type, bento tiles. Motion only where it guides the eye.

## Macrostructure: Bento Grid

The whole page is a bento: the hero is a tile composition (title tile,
portrait tile, three stat tiles), the work section is a varied-size
tile grid with three featured tiles spanning two columns, services are
hairline-separated columns, contact is a row list. No stacked cards.

## Tokens

| Role | Value | Notes |
|---|---|---|
| Background | #0E0B1D | Tinted near-black, never pure black |
| Panel | #1A1430 | Stat tiles, tile backs |
| Panel deep | #2A1E4D | Reserved for featured emphasis |
| Hairline | rgba(139,124,199,.22) | All dividers and tile borders |
| Text | #EDEAF7 | Headings, primary copy |
| Pale | #C9C2E3 | Body copy on dark (about 11:1 contrast) |
| Muted | #B3A9D4 | Secondary copy (about 8:1) |
| Accent | #8B7CC7 | ONE accent: kickers, labels, CTAs, hover (about 5:1 on bg, passes AA) |
| Accent deep | #5A3B8C | Featured markers only |

## Typography

- Display: Space Grotesk 700, tight tracking (-.02 to -.03em), line-height 1.02-1.05.
- Body: Inter 400/500/600, line-height 1.65.
- Scale: hero clamp(2.9rem, 6.5vw, 5.2rem); section titles clamp(2rem, 4.5vw, 3.4rem).
- Labels: monospace, uppercase, wide letter-spacing, never italic in headings.
- Measure: body copy capped around 60ch.
- Loading: preconnect + display=swap, no layout shift.

## Motion (purposeful only)

- Hero entrance: staggered rise, power3.out, no bounce, no elastic easing.
- Scroll reveals: sections rise 28px on entry (GSAP ScrollTrigger).
- Work tiles: stagger on filter change.
- Hover: image scale 1.04, play button fade, arrow nudge. Nothing moves layout.
- Ticker: constant-speed tape + count-up numbers.
- Reduced motion: all JS animation skipped, content fully visible.
  Initial hidden states are set from JS only, never CSS, so a failed
  CDN or disabled JS still shows the full page.
- If the GSAP CDN fails, the page works with zero animation.

## Anti-slop checks applied (Impeccable detector / Hallmark gates)

- No radial gradient blooms, no purple gradient hero.
- No pure black or untinted gray.
- No Inter-as-display; Space Grotesk carries headings.
- No cards nested in cards; tiles are flat, captions sit on the background.
- No italic emphasis in headings or CTAs.
- No over-centered text blocks; everything left-aligned except the footer.
- No bounce or elastic easing.
- Clickable text never wraps mid-word in buttons.
- Focus-visible outlines in accent on every interactive element.
- Honest copy only: every stat and quote already appears on the live site.

## Structure

- Nav: fixed, blur, wordmark + links + Hire me.
- Hero bento: title (7 cols), portrait (5 cols), 3 stat tiles (4 cols each).
- Ticker: career stats tape.
- Work: filters + 25-tile bento (3 featured span 2 cols).
- Services: 3 hairline columns, Short-Form featured.
- About: editorial split, facts as hairline rows.
- Kind Words: Malek quote, accent bar (hidden while empty).
- Contact: 3 hairline rows with arrows.
- Footer: single line.

## Media

Videos, thumbnails and the portrait are hotlinked from the original
`portfolio` repo (raw.githubusercontent.com) so this preview stays
lightweight. When the redesign is approved for the live site, the media
moves with it and the hotlinks become local paths.
