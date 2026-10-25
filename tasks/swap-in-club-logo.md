# Swap the pixel-spark mark for the club logo

## Goal

Replace the placeholder brand mark (red 9×9 square with a pixel spark) with the real Cornell Generative AI Club logo (red "C" around a split brain), everywhere the mark appears, and keep the home page effect where the mark assembles pixel by pixel on the Game of Life board.

## Approach

- **Vector source.** The only logo files (`cgaiweb.svg` on the old site, `Logo_Vect.svg` in Club Logos) are a 1024px raster wrapped in an SVG (608 KB). The logo is one flat colour, so it was traced with potrace from the embedded alpha mask into a real path: `public/brand/logo.svg` (~7 KB, `#BC3127`, the logo's own red). Proportions checked against the original (width/height 0.852 vs 0.856).
- **Tile.** Brand rules: don't recolour or invert the logo; on dark ground put it on a white tile. So the mark is now the logo on a white square tile (logo height 78% of the tile, about one C-stroke of clear space). This mirrors the old mark's structure (square tile + spark) in both themes.
- **Home page effect.** A 9×9 grid can't carry the brain detail (tested 18/27/36/45 grids; even 45 loses it). `Life` now rasterises `logo.svg` at runtime into a 36×36 grid (4 pixels per Life cell, same 9-cell footprint), sweeps it in diagonally with the same timing as before, then fades to the crisp vector once assembled. The logo file stays the single source; no hand-copied bitmap.
- **Favicon.** `src/app/icon.svg` is the same white tile + logo.

## Decisions

- Logo pixels use `#BC3127` (logo red), not the site accent `#d7261e`: the brand guide says not to recolour the logo.
- ~~Tile is pure white in both themes (brand: logo on a white field).~~ Dropped: no tile, logo fills its box (see log).
- `Swarm.tsx` is not used anywhere (the home page uses `Life`) but imports the old grid. The old grid moved into `Swarm.tsx` so it still compiles; it is otherwise untouched.

## Progress log

- 2026-10-24: traced logo, wrote `public/brand/logo.svg` and `src/app/icon.svg`; updating `Mark`, `Life`, `Swarm`.
- 2026-10-24: `Mark`, `Life`, `Swarm` updated; nav mark bumped 22px → 26px so the brain reads. README updated (it still described `Swarm` as the homepage).
- 2026-10-24: Verification. Headless Chrome can't show the sweep (its rAF loop doesn't advance), so checked in a real Chrome tab: pixel sweep → crisp logo in light and dark, nav, 404, favicon (`icon.svg` 200, image/svg+xml), no console errors.
- 2026-10-24: Dead end: temporarily restored the old files to compare headless renders; the dev server cached the old 404 page during that window and caused a hydration mismatch. Fixed by restarting with a clean `.next`.
- 2026-10-24: Reversal at Morgan's request: dropped the white tile everywhere (nav, home, 404, favicon) and let the logo fill its box (~28% bigger; nav box 26px → 30px). The brand guide asks for a white tile on dark ground; this overrides it by choice. Home sweep now draws only logo pixels and cross-fades them into the vector (no opaque tile to hide them under).
- 2026-10-24: Made the logo interactive in the board's own terms (`Life.tsx`: `stepMark`, `burst`). Each logo pixel is a damped spring to its home; the cursor pushes pixels within 3.5 cells. Pixels pushed past the logo's edge may drop onto the board as hot (red) live cells, the same kind the cursor brush paints, and regrow in the logo 1.2–2.2s later. Clicking the logo kicks every pixel outward and fires four gliders from its corners (the logo is a wall, so the ordinary click gliders would land inside it and be dropped). Disturbed → pixels within 0.12s; still for 0.35s → crisp vector over 0.6s. Physics skips entirely when settled and the cursor is away. Tunables are constants at the top of `Life.tsx`. Verified in Chrome: hover parts the pixels and sheds red cells, click bursts and reassembles, returns to the vector, no console errors.
- 2026-10-24: Sharper and snappier, bigger, centred. Pixels 4 → 6 per cell. Returns to the vector much sooner: spring 40 → 70 (critically damped), calm hold 0.35 → 0.12s, fade 0.6 → 0.35s, shed-pixel regrowth 1.2–2.2 → 0.5–1s, looser "settled" thresholds. Slot 9×9 → 11 tall × 10 wide cells and centred on the wordmark (`items-center`, was bottom-aligned). `MARK_CELLS` removed: Life now reads the slot's size in cells from `[data-swarm-mark]` and rebuilds the pixel grid if it changes, so `page.tsx` is the one place the size lives. Measured in Chrome: slot 143px vs letter height 108px (1.3×), centres 3px apart. Also enlarged the hero's top-left copy (headline 44px max, was 34px; subtitle 15 → 17/19px) at Morgan's request.

## Out of scope

- Deleting the unused `Swarm` component.
- The full lockup (mark + CORNELL / GENERATIVE AI CLUB) as an image; the site keeps its own wordmark text.
