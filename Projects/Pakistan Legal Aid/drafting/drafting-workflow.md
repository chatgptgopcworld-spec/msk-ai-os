---
type: drafting
last_checked: 2026-10-22
---
# Drafting workflow

1. **Safety.** Danger to life or safety → Police **15** / nearest police station first.
2. **Intake** (ask only what is missing) into `cases/<slug>/facts.md`: who, what, when (date + time PKT), where, the other party's identity as known, evidence held, what has been tried (earlier complaints, replies, FIR, appeals, reference numbers), relief wanted.
3. **Forum.** Read the forum page ([[nccia]], [[police-fir]], [[smpra]], …). State jurisdiction (territorial, subject matter, pecuniary), whether the offence is cognizable, limitation, any remedy that must be used first, and the escalation path. No forum page yet → research it, then create the page.
4. **Law.** For every section to be cited: open its section page, check `status` and [[legal-gaps]]. Missing page → extract it verbatim with `tools/build_sections.py`. Outdated source → verify online and record URL + date.
5. **Map.** In `cases/<slug>/mapping.md`: one table per section — ingredient → fact paragraph no. → exhibit no. Any ingredient without a fact means drop the section or get the fact.
6. **Draft** in `cases/<slug>/draft.md` from [[complaint-template]] in the forum's own format and form of address.
7. **Audit** with [[loophole-audit]]; fix, then list what is left in `cases/<slug>/must-confirm.md`.
8. **Deliver:** draft, must-confirm list, how to file, what to keep, follow-up and escalation. Word/PDF on request.
9. **File back:** anything reusable learned (a forum's new portal, a verified section) goes into the wiki; add a line to [[legal-log]].
