# MSK AI OS: pointer for Claude

This vault's rules are kept in tool-neutral files so any AI can use them. This file only points
there; `AGENTS.md` is the same pointer for other AI tools. Don't add rules here
(vault map, section 2, rule 6).

**Start of every session, in this order:**
0. `AIOS/msk-me.md`: who the user is and how to work with them.
1. `AIOS/msk-vault-map.md`: what the vault is, rules that never bend, layout, page conventions,
   projects (everything this file used to hold).
2. `AIOS/msk-skill-map.md`: which skill to follow for each job; open that skill file in
   `AIOS/skills/` and follow it.
3. `wiki/hot.md` → `wiki/brain-index.md` → the last 5 entries of `wiki/brain-log.md` → check `raw/inbox/`.

Inside a project folder, that project's own `CLAUDE.md` applies after these.

**Older references:** project files and logs written before 2026-10-22 say "rules in the root
`CLAUDE.md`". Those rules now live here:
- Hot-cache rules → `AIOS/skills/msk-skill-hot-cache.md`
- Ingest, lint, query, new project → their skill files (see the skill map)
- Project rules 1-10 (imported projects, git repos, outside dependencies) → vault map, section 6
- Page conventions, context-lookup rule → vault map, sections 2 and 5
