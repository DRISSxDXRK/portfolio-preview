# DESIGN.md, Preview3: "The Cutting Ledger"

Direction, picked before code: an editorial, asymmetric, serif-led dark
page for a video editor. The macrostructure is a ledger, not a bento:
a headline ledger up top, a work index as hairline rows, services as a
price table, facts as definition rows. Flat color, one lavender accent,
hairline rules, serif display type. Motion only where it guides the eye,
and one shader accent that earns its place in the hero.

## Dials (Craftwork, agency/portfolio/experimental brief)

Variance 8, Motion 7, Density 3. Asymmetry: headline block against an
offset portrait figure. Airy: 64px section padding, 48px grid gaps.

## Tokens (from preview2 DESIGN.md)

Background #0E0B1D, panel #1A1430, panel deep #2A1E4D, hairline
rgba(139, 124, 199, 0.22), text #EDEAF7, pale #C9C2E3, muted #B3A9D4,
accent #8B7CC7, accent deep #5A3B8C. One accent, flat, no glow, no
CSS gradients. Radius 8px everywhere. Spacing only 4/8/16/24/32/48/64;
the only off-scale numbers are functional, not visual rhythm: 90px
scroll-margin anchor offset (carried from preview2), 44px touch
targets, media dimensions, and the 1120px wrap.

## Typography

Display: Fraunces 600/700 with italic accent words, tight tracking,
line-height 1.02 to 1.05. Body: Inter 400/500/600, line-height 1.65.
Labels: Inter 12px uppercase, wide letter-spacing, muted. Two font
families only. Body copy capped at 64ch.

## Motion (Premium personality)

One signature easing for every animation: cubic-bezier(0.23, 1, 0.32, 1).
DOM motion uses CSS transitions, not GSAP, per cheapest-tool-first:
CSS transition beats a CDN dependency, and it keeps the exact easing
everywhere instead of an approximation. UI under 300ms, reveals 600ms
with a 10px rise from scale 0.98 (never scale 0), press feedback
scale 0.97 over 150ms, filter stagger 40ms steps capped at 480ms,
ticker at constant linear speed, count-up 1600ms. Transform and
opacity only. Hover motion is gated behind hover/pointer media.
Reduced motion ships with the animation: opacity-only fades, no
position changes, no ticker scroll, no shader, final count-up values.

## The one WebGL accent

A single WebGL2 canvas behind the hero headline renders a slow
accent-tinted value-noise field (4 FBM octaves, max alpha 0.16, DPR
capped at 1.5). It stays hidden unless context creation, compile, and
link all succeed, pauses offscreen and when the tab hides, and never
starts under reduced motion. The static fallback is the flat hero
background: the page is complete without it.

## Structure

Nav: fixed, blur, wordmark plus links plus Hire me, hamburger under
720px with dropdown panel, Escape and resize handling, scroll state.
Hero: headline block plus offset portrait figure, then a ledger strip
(availability, based, toolkit) as text, not metrics. Ticker: career
stats tape with count-up. Work: 25-row ledger, index number, thumb
button, title, client, format tag; tapping a thumb opens an inline
player drawer (video or YouTube iframe), one drawer at a time, real
buttons with aria-labels and aria-expanded. Services: price table, not
cards. About: pull statement plus paragraphs plus fact rows plus
portrait figure. Kind Words: Malek quote, shown by testimonials.js.
Contact: three large link rows. Footer: single line plus the no-data
collected note.

## Copy rules applied

Same copy, prices, videos, and contacts as the original. Titles use a
hyphen separator and facts use commas: this build has no em dashes and
no middle-dot separators anywhere, per the skill. No invented work,
metrics, testimonials, or prices.

## Refactoring UI 8-point diagnostic (self-audit from code)

1. Blur-test hierarchy: pass, headline dominates by size, then
   section titles, then body.
2. Grayscale survival: pass, hierarchy is size and weight driven,
   not color driven.
3. White space: pass, 64px sections, 48px gaps, density dial 3.
4. De-emphasised labels: pass, 12px uppercase muted labels.
5. Spacing scale: pass, all visual margin, padding, and gap values
   are on 4/8/16/24/32/48/64.
6. Text width: pass, body copy capped at 64ch.
7. Contrast: pass, text about 15:1, pale about 11:1, muted about 8:1,
   accent about 5:1 used only for large text, UI accents, and bold
   button text on accent.
8. Shadows matched to elevation: pass by absence, flat design with
   zero shadows and zero false elevation.

Score: 8 of 8, which is 10 of 10. Note: this is a code-level audit,
not a rendered screenshot audit, and phone-width rendering is
unverified (see below).

## Verification done locally

HTML parses with no errors and no unclosed tags. CSS braces and
parens balance, no unclosed comments. All three JS files pass
node --check. Every element ID and class referenced by JS exists in
the HTML or CSS, except drawer-player, which is a JS hook only and
needs no styles. All 49 referenced media paths (22 videos, 25 thumbs,
profile, og-image) exist in the original clone, and no original media
file is unreferenced. No em dashes, middle dots, placeholders, or
invented content. No transition-all, 100vh, z-index 999, bare
outline-none, or background-clip text in CSS.

## NOT verified (honest gaps)

Phone-width rendering at 390px cannot be verified from here: no live
browser is available to this build, so the stacking, the ledger row
compaction, the price table block layout, and the absence of
horizontal overflow at 390 are designed but unrendered. The WebGL
shader compiles on paper (standard WebGL2, guarded with try/catch and
a static fallback) but was never executed in a browser. The GSAP
ScrollTrigger skill was read but GSAP was deliberately not used; see
the motion section for why.
