# Projects page: group posts by type

## Goal

Break `/projects` into sections by project type: research, client work, products, and members'
own projects. Today it's one featured post and a flat grid, with a free-text `tag` on each post.

## Approach

- Replace the free-text `tag` on `Post` with a typed `kind`, and define the four kinds (order,
  heading, singular label, one-line blurb) once in `src/lib/work.ts` as `KINDS`. The Projects page
  and the post page both read labels from there.
- The Projects page renders one section per kind, in `KINDS` order, with a jump list under the h1.
  Within a section, posts keep their order in `POSTS`.
- Layout rule per section: an odd count leads with the wide featured card, so the two-column grid
  below stays even. Today that gives research (grid of 2), client work (Investcorp featured, then
  2), products (Outreach CRM featured), member projects (grid of 2).
- Post pages: "Keep reading" follows the page order (by kind), and the facts row shows the kind's
  singular label instead of the raw tag.

## Decisions

- **Mapping comes from the existing tags.** `research` → Research, `client` → Client work,
  `product` → Products (Outreach CRM), `open source` → Member projects (cu25 and Reckon Review,
  pi-memory). Both open-source posts are solo projects built outside a club engagement.
- **Section order:** client work, research, products, member projects. Started in the order of
  the request (research first); Morgan moved client work to the top. It's the key order of `KINDS`.
- **Cards drop the type label inside a section,** since the section heading says it. They show
  timeline and status instead. pi-memory had no status and its only "open source" signal was the
  tag, so it gets `status: "Open source"` to keep that on the page.
- **Section blurbs are one factual line each,** drawn from what the site already says
  (get-involved describes client engagements).

## Progress log

- 2026-10-26: read `projects/page.tsx`, `projects/[slug]/page.tsx`, `work.ts`, team page section
  pattern. `tag` is read in three places: the card meta, the post facts row, and "Keep reading".
- 2026-10-26: `KINDS`, `Kind` and `SECTIONS` added to `work.ts`; every post's `tag` became `kind`;
  pi-memory got `status: "Open source"`. Projects page rewritten as four sections with a jump list;
  card titles are now h3 under each section's h2. Post page reads `KINDS[kind].label` and orders
  "Keep reading" by `SECTIONS`.
- 2026-10-26: verified. `tsc --noEmit` and `eslint` clean; `npm run build` exports all 8 post pages.
  Checked the static export in Chrome: desktop light and dark, jump links (scroll margin clears the
  fixed nav), a post page's facts row and "Keep reading" wrap-around, and a 390px-wide frame
  (no horizontal scroll).
- Gotcha: `npm run build` rewrites `.next` and broke a `next dev -p 3001` server that another
  Claude session had running in this repo (500 on every route until restarted). Verify against the
  static export (`npx serve out`) instead of building while a dev server is up.
- 2026-10-26: tried a featured post above the sections (Investcorp, set by one slug in `work.ts`
  and left out of its own section). Morgan didn't like it; reverted, so Investcorp leads Client work
  again. If a top highlight comes back, don't pull the post out of its section.
- 2026-10-26: Outreach CRM is now open to the public. Status changed from "In private pilot" to
  "Open to the public", and the post's links lead with the app (https://crm.stuart-labs.com). The
  URL returned Cloudflare error 1033 (tunnel down) when checked; added on Morgan's word.
- 2026-10-26: client work moved ahead of research as the first section.

## Out of scope

- New posts or rewriting existing write-ups.
- Filters or client-side tabs. Anchored sections are enough for eight posts.
