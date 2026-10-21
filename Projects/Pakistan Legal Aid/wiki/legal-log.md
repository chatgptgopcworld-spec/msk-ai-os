# Pakistan Legal Aid: log

## [2026-10-22] setup | Wiki created from the LLM Wiki pattern
- Copied 7 verbatim law conversions from `Documents\Pakistan Laws\md` into `raw/laws/`.
- Wrote schema (`CLAUDE.md`), 7 source pages, 5 statute pages, 27 verbatim section pages (PECA, PPC, QSO), 3 forum pages (NCCIA, police/FIR + 22-A, SMPRA), drafting workflow, loophole audit, evidence handling, complaint template.
- Online checks: NCCIA portal/helpline (nccia.gov.pk), SMPRA status (The News Mar 2026, ProPakistani Jul 2026), Criminal Laws (Amendment) Act 2025 (Senate gazette copy), 27th Amendment (APP, Dawn), SHC orders on s.22-A.
- Flagged: Cr.P.C. missing; Constitution and PPC copies outdated. See [[legal-gaps]].

## [2026-10-22] note | New sources appeared in Pakistan Laws while building
During setup, `Documents\Pakistan Laws\md` gained: 07 renamed to "(OUTDATED, upto 2017)"; 08 Cr.P.C. 1898 (amended up to Dec 2022, SJA); 09 Cr.P.C. Amendment Act XXXVI of 2026 (ICT, ss.513-514); 10 Limitation Act 1908 (incl. 2023 amendment); 11 Constitution 1973 (incl. 27th Amendment 2025). A `candidates` folder also exists. Not yet ingested — waiting for confirmation the folder is final.

## [2026-10-22] restructure | Moved into its own project folder
Everything moved from the vault root into `MSK AI OS/Pakistan Legal Aid/`, because the vault will hold several projects. Generic page names renamed to avoid clashes across projects: index → legal-index, log → legal-log, gaps → legal-gaps, workflow → drafting-workflow. Links updated.

## [2026-10-22] restructure | Moved under Projects/
MSK AI OS as a whole is now the user's second brain; this project moved to `MSK AI OS/Projects/Pakistan Legal Aid/`. No content changed.

## [2026-10-22] schema | Project hot cache added
- Created `wiki/legal-hot.md` (~500 words): rules, what the wiki holds, facts drafts need most, gaps, open threads. Read right after `CLAUDE.md`.
- `CLAUDE.md`: reading order and refresh rules updated; index rebuilt with the hot cache under "Start here".
