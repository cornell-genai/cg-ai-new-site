# Remove Claude as a repo contributor

## Goal

Get `claude` off the GitHub contributor list for cornell-genai/cg-ai-new-site, and stop it coming back.

## What was wrong

- 37 commits on `main` were authored and committed as `Claude <noreply@anthropic.com>`. That is the git identity Claude Code on the web uses, and GitHub maps it to the `claude` account. These 37 commits made it the #2 contributor.
- 33 more commits carried `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` and `Claude-Session:` trailers.
- No `Generated with Claude Code` lines were found.

## Approach

Rewrite every branch on origin with `git filter-branch`, then force-push.

- **Author/committer:** `Claude <noreply@anthropic.com>` becomes `Asad Rizvi <141244643+Archdiner@users.noreply.github.com>`.
- **Messages:** drop `Co-Authored-By:` lines naming Claude or Anthropic, and `Claude-Session:` lines. Messages with nothing removed stay byte-identical.
- File contents are unchanged. Every rewritten commit has the same tree as the original.

## Decisions

- **Credit the Claude commits to Asad (Archdiner).** Evidence: GitHub push events from 2026-10-21 on show all of these commits pushed by Archdiner. The January ones came in through PRs #1 and #2, opened by Archdiner. eb2308e (2026-10-26) had no push event visible yet. It sits in the same run as Archdiner's 2026-10-25 pushes, so it is credited the same way.
- **Use Asad's GitHub noreply address,** not aarizvi06@gmail.com. It is guaranteed to link to his account.
- **Rewrite all branches, not just `main`.** GitHub's contributor list only reads `main`, but stale branches still carrying Claude-authored commits would bring them back if merged.
- **Use filter-branch over filter-repo.** filter-repo isn't installed, and for 137 commits the speed difference doesn't matter.
- **Prevention lives in `AGENTS.md`,** which `CLAUDE.md` imports, so every agent tool reads one file.

## Progress log

- 2026-10-26: Audited history and mapped the Claude commits to pushers. Rewrote 13 branches in a scratch bare clone. Verified: 0 agent identities and 0 attribution trailers left; commit counts and tip trees identical on every branch; all 132 trees on `main` identical commit by commit. Added `AGENTS.md`. Waiting on the go-ahead to force-push.

## Open questions

- After the force-push, collaborators (Archdiner, cx18121, ezpedersen, mdelriolanse) need to re-sync local clones: `git fetch && git reset --hard origin/<branch>`, or rebase any unpushed work onto the new history.
- GitHub can take a while to refresh the cached contributor list after a force-push.

## Out of scope

- Old commits stay reachable on GitHub through closed-PR refs (`refs/pull/*`). These are read-only, and they don't count toward the contributor list.
- Enforcement in CI, such as a check that fails PRs with agent authorship. This is a possible follow-up.
