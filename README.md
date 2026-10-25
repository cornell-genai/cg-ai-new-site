# cornellgenai.dev

Website for Generative AI at Cornell. Next.js 15 (static export), Tailwind 4, and Canvas 2D.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in ./out
```

## Content

Members (board, members, business, alumni) live in `src/lib/data.ts`. Project write-ups live in
`src/lib/work.ts`: each post is a list of blocks (paragraphs, headings, flow diagrams, stats, figures,
illustrations), rendered on `/projects` and `/projects/<slug>`. Real screenshots or charts go in
`public/work/<slug>/` and are added as a `figure` block; each post's banner (about 1.9:1) lives there
as `banner.webp`.

Headshots go in `public/team/` as roughly 720px WebP files. The Team page shows them in a responsive portrait grid, with links to each member's LinkedIn profile when available.
Client marks for the home page circles are in `public/logos/mark-*`.
Every page, including Team, follows the shared light/dark theme.

## Design

Keep the site's character in its dense editorial introduction, inline logo marks, and ASCII
effects. Improve readability and accessibility without flattening those details. Navigation uses
standard Next.js links without page wipes.

## Pieces

- `Life`: the homepage. Conway's Game of Life on an ASCII character grid; the cursor seeds cells and
  clicks fire gliders. On wider screens, the club logo is an SVG visible from first paint in
  `[data-swarm-mark]`. The separate hero mark is hidden below 640px; the navigation logo remains.
  It breaks into pixels during interaction and crossfades to the vector in 150ms once the pixels
  settle. The cursor shoves its pixels aside, pixels
  knocked off its edge become live cells, and clicking it bursts it and fires gliders. (`Swarm`, the earlier schooling-fish hero, is no longer used.)
  Anything marked `[data-swarm-avoid]` (nav, copy) is swum around. Canvas 2D, fixed timestep.
- `Nav`: standard Next.js links on desktop and a native modal dialog on mobile. The dialog handles
  keyboard focus, Escape, and background inertness.
- `AsciiHover`: an ASCII layer over the campus photo (project banners) that reacts to the cursor.
- `OutlineLife`: the home page team photo (a transparent cut-out) with a faint Game of Life in a thin band around the group's outline; the cursor seeds red cells in it.
- `Glow`: the warm dot field in the footer. It can also spell out text (`text` prop).
- `Mark`: the club logo, filling its box. `public/brand/logo.svg` is the single source (traced from
  the old site's raster `cgaiweb.svg`); `src/app/icon.svg` is the favicon version.

The home and footer canvases pause offscreen. All active canvas effects respond to live changes
in `prefers-reduced-motion`, showing a still frame or the original photo when motion is reduced.
The canvases intentionally have no pause control.

## Interface checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Check every route in both themes at 320px, 768px, and desktop widths. Walk the mobile menu with
Tab and Escape, follow the skip link, and check project section links. Test safe areas, browser
chrome, and touch feedback on a physical phone before claiming hardware coverage.
