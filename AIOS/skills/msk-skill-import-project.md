---
type: skill
skill: import-project
system: Projects
trigger: user wants an existing wiki vault or folder brought into MSK AI OS
schedule: none
inputs: the existing vault/folder
outputs: it moved under Projects/, registered, sync finished
updated: 2026-10-22
---
# Bring an existing vault in as a project

## Steps
1. If it is a git repo: commit its pending work first.
2. Move it to `Projects/<Name>/` unchanged; it keeps its own schema and file names (vault map,
   section 6, rule 7).
3. Add it to `.gitignore` (it stays its own repo).
4. Find anything outside the vault pointing at its old location and update it (rule 9); record it there.
5. Register it as in [[msk-skill-new-project]] step 3; log it; refresh the hot cache.
6. Finish its GitHub sync from Windows ([[msk-skill-git-sync]]).

## Done when
- Its own Obsidian vault still opens; links from the main wiki use full paths; lint passes.
