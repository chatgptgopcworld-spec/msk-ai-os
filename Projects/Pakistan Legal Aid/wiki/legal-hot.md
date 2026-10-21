---
type: hot-cache
updated: 2026-10-22
word_budget: 500
---
# Pakistan Legal Aid: hot cache

The most important context for this project, about 500 words. Read it right after `CLAUDE.md`, then [[legal-index]] and [[legal-gaps]]. Rewrite it in full (never append) after every ingest, lint, schema change or finished case. It only summarises what the wiki pages already say.

## What this project is
A verified law and forum wiki for drafting complaints, applications and representations to Pakistani bodies (NCCIA, police, courts, regulators, ombudsmen, departments). Part of MSK AI OS, at `Projects/Pakistan Legal Aid/`. Law sources (original PDFs and verbatim md) sit in `raw/source-laws/`; copies used here sit in `raw/laws/`.

## Rules that never bend
- Truth first: no invented facts, dates, names or sections; unknowns stay in [BRACKETS] and go on the case's must-confirm list. False complaints expose the complainant ([[ppc-s182]], [[ppc-s211]]).
- Statute text is copied verbatim by `tools/build_sections.py`, never retyped.
- Check a section's currency before citing it; record online checks with URL and date.
- Drafts are aids, not legal advice; high-stakes matters go to an advocate.
- Case files stay private in `cases/`; no CNICs or account numbers on wiki pages.

## What the wiki holds
- 27 verbatim section pages: PECA (ss.13, 14, 16, 20, 21, 24, 24A, 26A, 29, 30; Rules 2018 r.6), PPC (182, 211, 383, 384, 415, 420, 499, 500, 503, 506, 507, 509), Qanun-e-Shahadat (Arts. 46-A, 73, 78-A, 164).
- Statute pages: [[peca-2016]] (current to Act II of 2025), [[qso-1984]] (to Dec 2025), [[ppc-1860]] (outdated source), [[constitution-1973]] (outdated), [[crpc-1898]] (no source yet).
- Forums: [[nccia]], [[police-fir]], [[smpra]].
- Drafting kit: [[drafting-workflow]], [[loophole-audit]], [[evidence-handling]], [[complaint-template]].

## Facts drafts need most
- PECA offences are investigated only by the NCCIA ([[peca-s30]]); the FIA Cyber Crime Wing no longer exists ([[peca-s29]]). File at complaint.nccia.gov.pk or call 1799.
- Non-PECA offences: FIR with the SHO; if refused, apply to the Justice of the Peace under Cr.P.C. s.22-A ([[police-fir]], still needs-check).
- Content removal goes to SMPRA ("the Authority"), reported not yet operational in July 2026.
- Electronic evidence: keep originals and the device, record hashes; admissibility is the court's call ([[qso-art164]]).

## Biggest gaps
- No Cr.P.C. ingested; Constitution copy stops at 2017 (27th Amendment missing); PPC copy stops at Dec 2023, and Act XXVII of 2025 amended ss.354A and 402C.
- Open questions: NCCIA's own rules, SMPRA's filing channel, whether PECA s.24A covers adults.

## Open threads
- Files 08-11 in `raw/source-laws/md` (Cr.P.C. to Dec 2022, a 2026 ICT Cr.P.C. amendment, Limitation Act 1908, Constitution with the 27th Amendment) await the user's go-ahead to ingest. They would close the Cr.P.C. and Constitution gaps.
- No cases filed yet.

## Recently changed
- 22 Oct 2026: project hot cache added.
- 22 Oct 2026: project moved to `MSK AI OS/Projects/`.
- 22 Oct 2026: wiki built: sections, statutes, forums, drafting kit.
