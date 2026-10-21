---
type: template
domains: [ai]
sources: [src-2026-10-22-nm-cowork-80, src-2026-10-22-nm-3-file-ai-system, src-2026-10-22-nm-obsidian-cowork-life]
created: 2026-10-22
updated: 2026-10-22
status: stub
---
# Skill file template

A skill is one repeatable process in plain markdown ([[aios-skills-as-files]]). Make one by doing the task with AI until the result is right, then asking it to write the process down in this shape. Store it in the vault; list it in the skill map.

```markdown
---
skill: <name>
system: <Janitor | Daily Trident | Chronicler | ...>
trigger: <what the user says or what event starts it>
schedule: <none | daily 06:00 | 1st of month 09:00>
inputs: <folders, files or apps it reads>
outputs: <files it writes, and where>
ai_generated_marker: <tag or emoji added to anything it writes>
updated: YYYY-MM-DD
---
# <Skill name>

## Goal
<one sentence>

## Steps
1. <...>
2. <...>

## Rules
- <what it must never do, e.g. never edit raw/>

## Done when
- <checks that prove it worked>
```
