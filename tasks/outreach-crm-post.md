# Projects post: Outreach CRM

## Goal

Add a write-up of Outreach CRM to `/projects`, in the same shape and voice as the existing posts
in `src/lib/work.ts`, illustrated only with the CRM's demo workspace. No personal data.

## Approach

- Source material: the CRM repo's founding docs and ADRs (`~/Development/Outreach-CRM/docs/`),
  the KB mirror of the same docs, and the demo kit in `Outreach-CRM/demo/cgai/`.
- Screenshots come only from `demo/cgai/screenshots/`. That workspace belongs to a fictional
  student (Jordan Rivera); every person in it is invented, companies are real names used only as
  targets, and there are no email addresses.
- Crop the app's top bar off every shot: it shows the demo login (`jordan@demo.local`) and
  "No agent yet", which the demo README flags as worth cropping.
- Banner: a dot-matrix wordmark on cream, matching the other posts' banners, generated with PIL.

## Decisions

- **Leave out the production URL and the host.** They're Morgan's own domain and machine. The post
  links only to agentlink, which is already a public repo.
- **Leave out LinkedIn auto-send.** It exists as an opt-in feature (ADR 0004–0006), but LinkedIn's
  terms prohibit it, and the repo's own rule is that copy must never present it as safe. A club page
  is the wrong place to advertise it. The post describes the default: AI drafts, the person sends.
- **No real outreach data.** Nothing from Morgan's own workspace, contacts or messages; numbers in
  the post describe the codebase (packages, recipes, migrations), not usage.
- Tag `open source` doesn't fit (the CRM repo is private); used `personal project`.

## Progress log

- 2026-10-25: branch `outreach-crm-post`; read the five existing posts, the demo README, the
  founding doc and ADRs 0001–0009.
- 2026-10-25: cropped the top bar off five demo shots (pipeline, company, drafts, conversation,
  agent gallery) and trimmed side margins on the centred pages; WebP into `public/work/outreach-crm/`.
  Banner rendered with a throwaway PIL script (Futura wordmark on the dot grid, red "out", ink
  "reach", dotted rules for threads); the script stayed in the session scratchpad, not the repo.
- 2026-10-25: post added at the end of `POSTS`. Dropped two unsupported claims from the first
  draft (running costs "near zero", ADRs "written before the code").
- 2026-10-25: verified. `tsc --noEmit` and `eslint` clean; `npm run build` prerenders
  `/projects/outreach-crm`; in Chrome all six images load, no console errors, no horizontal
  overflow at narrow width, card shows on `/projects`.

- 2026-10-25: merged as PR #8 (resolved a conflict with PR #5, which also appended posts).
- 2026-10-25: Morgan asked for a section on the meeting brief. Added "The meeting brief" between
  the agent and agentlink sections, sourced from the `prep_call` recipe
  (`packages/agent-prompts/src/recipes/prep-call.ts`): the five parts as a `rows` block, the
  grounding rule, and filing on the Documents tab. The agentlink paragraph now points to it and
  says the trigger is an automation that has to be turned on (commit 06a43fa, 746c199).
  Branch `outreach-crm-meeting-brief`. Verified: tsc, lint, build; section renders and shows in
  the page contents.
- 2026-10-26: reversed "leave out the production URL". The CRM is open to the public, so the post
  links to https://crm.stuart-labs.com and the status reads "Open to the public". Logged in
  `tasks/projects-by-type.md`.
- 2026-10-28: Morgan asked for more distinct covers on outreach-crm and pi-memory. Both reused the
  horizontal dotted-rule background of `cu25 reckon` and QuickFi. Kept the wordmarks, palette and
  diamond dots; new backgrounds: outreach is a contact network, with red paths reaching out to
  checked contacts, and pi-memory is a memory lattice of record blocks, with a topic index on the
  left and dotted recall paths into the hit records. Same 1600×842 WebP at the same paths, so no
  code change. Rendered with a throwaway PIL script (Futura Medium, seeded), kept out of the repo.
- 2026-10-28: Morgan asked for options. Showed three motifs per cover (outreach: network, signal,
  pipeline; pi-memory: lattice, index cards, session timeline), then three takes on the chosen
  "signal" and "index cards" motifs. Final picks, installed at the same paths:
  - outreach: dashed rings radiate from the "o"; red dotted lines run out to answered contacts
    (checked squares), ink lines to ones still waiting, grey squares for the rest.
  - pi-memory: large tilted index cards (dotted outline, title line, ragged text lines); two red
    query squares, one above the word and one below, each returning its own set of cards, the
    strongest in red and the rest in ink. Morgan asked for the second web after seeing one.
  Same throwaway PIL scripts, same scratchpad; not in the repo.

## Open questions

- The drafts screenshot's own intro text mentions "LinkedIn Auto-send". Left as is; retake or crop
  if that shouldn't appear on the club site.

## Out of scope

- Retaking screenshots or changing the demo seed.
