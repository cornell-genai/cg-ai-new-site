# Make the hero's pixel logo look like the logo

## Goal

The home hero draws the club logo as square pixels on the Game of Life board (`Life.tsx`). Problems, reported by Morgan:

1. After the cursor pushed the logo's pixels aside, the logo never went back to its proper shape.
2. Even at rest, the brain didn't read as the logo: the folds and circuit traces broke into specks.

## Outcome

- **Settling fixed** (`stepMark`). Each logo pixel is a critically damped spring. It was declared settled within 0.5px of home and frozen there; drawing snaps positions to whole device pixels, so on a 2x screen the leftover became a 1-device-pixel shift and neighbours overlapped or left slivers. Now a pixel that is close, slow and not being pushed is put exactly home.
- **A fixed pixel map** (`src/components/pixelLogo.ts`, 43×48, `#`/`.`). Made from `logo.svg` by the per-part conversion below (pen 1.3 pixels), as rendered by Chrome at 1920px @1x, and picked by Morgan from a screenshot. Read out of that screenshot exactly (every 3×3 block uniform), so it's the pixels Morgan chose.
- **Sizing.** Logo pixels are as near the slot's size as whole device pixels allow: 3 CSS px at 1440–1920 on 1x and 2x screens, 2 px on phones. Centred; where rounding up overhangs the slot (3px top and bottom at 1440), the overhang is walled off from the board too.

## How the map was made (per-part conversion)

At this size the brain's strokes and gaps are under a pixel wide, so plain averaging breaks them into specks. The logo is three kinds of shape, each reduced on its own terms:

- solid shapes (the C, the circuit half) keep the pixels the logo mostly covers;
- holes in a solid shape (the circuit traces and dots) are cut back in along their centre lines (Zhang–Suen thinning), one pixel wide; a hole covering 3/4 of a pixel takes the whole pixel;
- line art (the folded half, and the loose fold inside it) is redrawn along its strokes' centre lines with a ~1.5-pixel pen, keeping a one-pixel white gap where two strokes would run together;
- then lone pixels and one-pixel spurs are dropped.

A shape is line art when the white it encloses outweighs its own ink (folded half 271 vs 232 px², circuit half 157 vs 408 px², at 60×66), and so is anything inside it. The TypeScript of this (`pixelateLogo.ts`) matched a Python prototype exactly on identical input; it was deleted once the map was frozen, since nothing runs it now.

## Decisions

- **Frozen map over live conversion.** The live conversion's result depends on the screen (grid size) and the browser's SVG rasterising; freezing the picked render makes every screen show exactly what was chosen. Cost: if the logo changes, the map is redrawn by hand.
- **Pixel size: the original's (3 CSS px).** Tried a sixth of a cell (2px, too fine) and a fifth (2.4px); the pick came from the 3px render.
- The SVG is no longer loaded or rasterised by `Life.tsx`; the DOM `Mark` stand-in still shows until the canvas is ready.

## Progress log

- 2026-10-26: Settle fix. Headless Chrome check (cursor sweeps through the logo, then compare its pixels with the resting shape): before, 36–96 device pixels off after every sweep at 2x; after, 0 at 2x and 1x.
- 2026-10-26: Confirmed `Club Logos/Current_Logo.png` and the site's `logo.svg` are the same design. The right half is solid red with the circuit cut out in white, not red lines.
- 2026-10-26: Live per-part conversion, iterated with Morgan: 6 px per cell with one-pixel strokes (too fine, too thin); 5 per cell with a two-pixel pen and every red pixel in a 2×2 block (too heavy, folds merged); 1.5-pixel pen with speck cleanup, pen scaled per screen (the basis of the pick).
- 2026-10-26: Dead ends: thinning the pooled grid again (erased folds); averaging-loss as the solid/line-art test (didn't separate them); a 40×44 hand-drawn draft with one-pixel lines (too sparse); a 48×53 hand-designed simplified logo (clean, but Morgan preferred the converted one).
- 2026-10-26: Hand edit at Morgan's request: the left half's straight inner edge back to one pixel (19 pixels in column 23, rows 13–34); the thicker top, bottom, outer curve and the rounded corners into the straight edge stay.
- 2026-10-26: Hand edit at Morgan's request: left half's outline thickened one pixel inward wherever it was one pixel (35 pixels: the straight inner edge, top, bottom and the thin stretches of the outer curve), so its edges are two pixels like the right half's and its white interior is smaller. Compared with keeping a one-pixel gap around the folds: that changed too little to see.
- 2026-10-26: Hand edit at Morgan's request: the right half ended a row lower than the left (the real logo's does, slightly). Trimmed its extra bottom row (4 pixels) so both halves run rows 11–36, with the same 3 rows of space above and 2 below inside the C.
- 2026-10-26: Froze the 1920px @1x render as `pixelLogo.ts`. On the page the drawn pixels match the map exactly at 1920 @1x, 1440 @1x and @2x, 1512 @2x and 390 @3x; settle check passes at 2x and 1x; no console errors from these files.
