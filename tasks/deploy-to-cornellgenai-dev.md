# Deploy this repo to cornellgenai.dev

## Goal

Continuous deployment from `main` of `cornell-genai/cg-ai-new-site` into the Vercel project that serves cornellgenai.dev, replacing the old site.

## Approach

- Vercel account: cornellgenai@gmail.com (CLI user `cornellgenai-6390`), team `cornellgenais-projects`.
- Project: `cgai-website` (`prj_PKZdcgkc1IcSo4HnHqA5uwceuCQu`), domains `cornellgenai.dev` (redirects to www) and `www.cornellgenai.dev`. Domain is registered at Vercel and uses Vercel DNS.
- Re-link the project's Git connection from `cornellgenai-prog/cgai-website` to this repo, production branch `main`, then deploy `main` to production.

## Decisions

- Same project, not a new one: Morgan wants the old site taken down and replaced, so the domains, settings and history stay where they are. Both sites are Next.js with default build settings and no env vars, so the project settings carry over unchanged.
- GitHub access: the Vercel account's GitHub login is `cornellgenai-prog`, which had no access to the `cornell-genai` org (Vercel refused the link with `repo_no_access`). Added it as a write collaborator on this repo only, rather than an org member.

## Rollback

The last old-site production deployment is `dpl_FPpBi8TkNiVHBv4xBDyn5h4TjDBv` (commit `c2f7b37` of `cornellgenai-prog/cgai-website`). Instant Rollback to it in the Vercel dashboard restores the old site; re-linking the old repo restores its CD.

## Progress log

- 2026-10-26: Found the project and recorded the rollback target. Link attempt failed on repo access; invite sent to `cornellgenai-prog`, waiting for acceptance.
- 2026-10-26: Invite accepted. Unlinked `cornellgenai-prog/cgai-website` (Vercel won't re-link while another repo is linked) and linked this repo; production branch is `main`. The old site is still live: the first production build of this repo hasn't run yet (the agent's production deploy call was blocked by the permission check, so Morgan triggers it).

## Out of scope

- The duplicate Vercel project under `sar367-3278s-projects` still builds on every push. Its owner has to disconnect it.
