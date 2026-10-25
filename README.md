# cornellgenai.dev

Website for Generative AI at Cornell. Next.js 15 (static export), Tailwind 4, Framer Motion.

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

Headshots go in `public/team/` as ~720px WebP; they appear when hovering a name on the Team page.
Client marks for the home page circles are in `public/logos/mark-*`.

## Pieces

- `Life`: the homepage. Conway's Game of Life on an ASCII character grid; the cursor seeds cells and
  clicks fire gliders. The club logo assembles pixel by pixel in the lockup (`[data-swarm-mark]`),
  then resolves into the crisp vector. It plays along: the cursor shoves its pixels aside, pixels
  knocked off its edge become live cells, and clicking it bursts it and fires gliders. (`Swarm`, the earlier schooling-fish hero, is no longer used.)
  Anything marked `[data-swarm-avoid]` (nav, copy) is swum around. Canvas 2D, fixed timestep.
- `PageTransition`: a dark-red sheet rises over the page, then the new page rises over it. It
  catches `<a>` clicks in the capture phase, so plain `<Link>`s need no wrapper.
- `Scramble`: section labels that decode from ASCII noise on hover.
- `AsciiHover`: an ASCII layer over the campus photo (project banners) that reacts to the cursor.
- `OutlineLife`: the home page team photo (a transparent cut-out) with a faint Game of Life in a thin band around the group's outline; the cursor seeds red cells in it.
- `Glow`: the warm dot field in the footer. It can also spell out text (`text` prop).
- `Mark`: the club logo, filling its box. `public/brand/logo.svg` is the single source (traced from
  the old site's raster `cgaiweb.svg`); `src/app/icon.svg` is the favicon version.

Everything pauses offscreen and respects `prefers-reduced-motion`.
