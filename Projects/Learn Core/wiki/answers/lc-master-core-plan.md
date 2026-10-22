---
type: answer
domains: [business, software]
sources: []
created: 2026-10-22
updated: 2026-10-22
status: active
---
# Plan: one master LMS core (Option B) — awaiting approval

**Status:** the owner chose Option B ("one master copy") on 2026-10-22. Phase 0 (read-only comparison) is
done. **Nothing in any code repo or live site has changed.** Phases 1-6 need the owner's approval, phase by phase.

## Phase 0 findings (2026-10-22, read-only)
Compared `Projects/Hamzi Prompts/projects/hamzi-lms/plugin` with
`Projects/Ubaid Automation/projects/ubaidooautomation/wordpress/academy-lms/hamzi-lms`, file by file (MD5):

| | Hamzi copy | Ubaidoo copy |
|---|---|---|
| Plugin version | 0.39.10 | 0.39.10.18 |
| Database version | 19 | **21** |
| Files | 119 | 137 |
| Identical files | 67 | 67 |
| Changed files | 50 (about 48,600 changed lines in total) | |
| Only here | Hamzi connector (2 files) | MSK connector (2), **notes, grades, search, certificate templates** (4 new classes), certificate fonts (14) |

- **Fork point:** Ubaidoo started on 2026-10-13 from the live Hamzi 0.39.10 (exact copy, verified by SHA-256).
- **Hamzi changed after the fork too** (plugin commits on 2026-10-16): "capture live edits made directly on the
  server (13-15 Oct)", "fix: low findings of the 2026-10-16 security review", and RedotPay payment (added, then
  reverted). So each copy has something the other lacks.
- **Ubaidoo branding is inside the core:** "ubaid/ubaidoo" appears in at least 10 admin files. In a shared core
  that would show Ubaidoo's name on Hamzi; it has to move into settings or the client connector.
- **LearnCore product:** built from 0.35.3 on 2026-10-01; its `build.py` (renames + leak check), docs and 32
  test suites are reusable; its code is not.

## Synthesis: the plan
1. **Pick the base:** the Ubaidoo copy (newest features, DB 21).
2. **Bring in Hamzi's post-fork changes:** the live-edit capture and the security-review fixes from 16 Oct
   (not the reverted RedotPay change). Each change checked by hand.
3. **Make the core brand-free:** every Ubaidoo or Hamzi name, logo, colour or link becomes a setting or lives in
   that client's connector (`connectors/msk/`, `connectors/hamzi-prompts/`). `build.py --check` must show
   **leaks found: 0**.
4. **Make LearnCore the one place where LMS features are made:** the core lives in
   `Projects/Learn Core/projects/monetics-learncore`; `build.py` produces three outputs from it: the Hamzi
   build, the Ubaidoo build, and the neutral product ZIP. The plugin folder name on the live sites stays
   `hamzi-lms`, so WordPress treats it as an update, not a new plugin.
5. **Test before any live site:** a fresh WordPress, plus a copy of Hamzi's database: the upgrade from DB 19 to
   21 must keep every student, payment, course and setting. Run the 32 product suites plus each client's checks.
6. **Roll out one site at a time:** Ubaidoo first (smallest change), then Hamzi. Each: owner's approval, fresh
   backup, upload, browser check, record in that project's wiki.

**From then on:** LMS features are only made in Learn Core; Hamzi and Ubaidoo never edit the plugin directly.

## Risks
- Hamzi's live database upgrade (19 → 21) is the riskiest step; it is tested on a copy first and backed up.
- Brand leaks (Ubaidoo's name on Hamzi or the reverse); caught by the leak check and browser checks.
- About 48,600 changed lines: this is several sessions of work, not one.

## Decisions needed from the owner
1. Approve Ubaidoo 0.39.10.18 as the base (step 1).
2. Approve starting phases 1-3 (code work only inside the LearnCore repo; no live site touched).
3. Is there a staging copy of the Hamzi site for step 5, or should one be made?
