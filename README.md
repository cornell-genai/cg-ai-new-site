# cornellgenai.dev

Website for Generative AI at Cornell. Next.js 15 (static export), Tailwind 4, Framer Motion, Lenis.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in ./out
```

## Content

Everything editable lives in `src/lib/data.ts`: members (board, members, business, alumni) and
project descriptions (`CURRENT`, `PAST`), which the Projects page will use once write-ups are ready.

Headshots go in `public/team/` as ~720px WebP; they appear when hovering a name on the Team page.
Client marks for the home page circles are in `public/logos/mark-*`.

## Pieces

- `Swarm`: the homepage. Schools of ASCII agents on a character grid flee the cursor, leave red
  wakes, and ripple on click; 81 of them assemble the mark in the lockup (`[data-swarm-mark]`).
  Anything marked `[data-swarm-avoid]` (nav, copy) is swum around. Canvas 2D, fixed timestep.
- `PageTransition`: a dark-red sheet rises over the page, then the new page rises over it. It
  catches `<a>` clicks in the capture phase, so plain `<Link>`s need no wrapper.
- `Scramble`: section labels that decode from ASCII noise on hover.
- `TeamPhoto` / `AsciiHover`: ASCII layers over the team and campus photos that react to the cursor.
- `Glow`: the warm dot field in the footer. It can also spell out text (`text` prop).
- `Mark`: the red square with a pixel spark; also `src/app/icon.svg`.

Everything pauses offscreen and respects `prefers-reduced-motion`.
