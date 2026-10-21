# Pakistan Legal Aid: project schema (inside MSK AI OS)

This vault is a persistent, LLM-maintained knowledge base for drafting complaints,
applications and representations to Pakistani bodies (NCCIA, police, courts, tribunals,
regulators, ombudsmen, departments, private bodies). It follows the "LLM Wiki" pattern:
raw sources are immutable, the wiki is compiled from them and kept current, and every
answer or draft is built from the wiki rather than from memory.

This project lives in `MSK AI OS/Projects/Pakistan Legal Aid/`; all paths below are relative to that folder and nothing here should be written outside it.

Read this file first in every session. Then read `wiki/legal-hot.md` (this project's hot cache),
then `wiki/legal-index.md`, then `wiki/legal-gaps.md`.

## Prime rules (override everything else)

1. **Truth first.** Never invent, assume or upgrade a fact, date, name, section number or
   piece of evidence. Unknowns stay as `[BRACKETS]` and go on the case's must-confirm list.
   A false or exaggerated complaint exposes the complainant (see [[ppc-s182]], [[ppc-s211]]).
2. **Verbatim law only.** Section text in `wiki/sections/` is copied character-for-character
   from `raw/laws/` by script, with file, line range and PDF page. Never retype or "clean"
   statutory text. Anything in a page that is not verbatim is labelled as Claude's note.
3. **Currency before citation.** Each statute page states how current its source is. Before
   citing a section in a draft, check `wiki/legal-gaps.md` and the statute page; if the source may
   be outdated, verify online (pakistancode.gov.pk, na.gov.pk, senate.gov.pk, the
   department's own site) and record the check (URL + date) on the page.
4. **Not a lawyer.** Drafts are aids. Court filings, bail, property, family, criminal
   defence and other high-stakes matters go to a licensed advocate for review.
5. **Privacy.** Case files hold real people's data. Keep them in `cases/`, never paste
   CNICs or account numbers into wiki pages, and do not publish or sync `cases/` anywhere
   without the user's say-so.

## Layout

```
raw/laws/        Immutable verbatim .md conversions of the law PDFs (originals:
                 `raw/source-laws/pdf`). Read, never edit.
wiki/legal-hot.md      Hot cache: ~500-word summary of the most important context. Read first.
wiki/legal-index.md    Catalogue of every page with a one-line summary. Read after legal-hot.
wiki/legal-log.md      Append-only history: "## [YYYY-MM-DD] <op> | <title>".
wiki/legal-gaps.md     Known outdated sources, missing laws, open questions. Read second.
wiki/sources/    One page per raw file: origin URL, "amended up to", OCR quality.
wiki/statutes/   One page per Act: currency, key sections, amendments, links.
wiki/sections/   One page per section/article: verbatim text + location + checked date,
                 then (clearly labelled) Claude's ingredient breakdown for drafting.
wiki/forums/     One page per body: legal basis, jurisdiction, how to file, escalation,
                 verified-on date and source URLs.
drafting/        Workflow, loophole audit, evidence handling, templates.
tools/           extract_section.py (verbatim extractor) and build scripts.
cases/           One folder per matter (private). See cases/README.md.
```

## Page conventions

- File names are lowercase slugs and unique: `peca-s20`, `ppc-s506`, `qso-art164`, `nccia`.
- Link with `[[slug]]`. A link to a page that does not exist yet is fine; it flags a gap.
- YAML frontmatter on every wiki page: `type`, `statute` (if any), `source`, `last_checked`
  (YYYY-MM-DD), and `status` (`verified`, `needs-check`, or `outdated-source`).
- Section pages: `## Verbatim text` (fenced, untouched) → `## Location` →
  `## Drafting notes (Claude's breakdown, not law)`. Ingredients are numbered so a draft
  can map "ingredient → fact paragraph → exhibit".

## Operations

**Ingest a new law PDF.** User drops PDF in `raw/source-laws/pdf` → convert
verbatim to .md (pdftotext, page markers kept, header with source URL) → copy to
`raw/laws/` → write `wiki/sources/` page (origin, amended-up-to, OCR quality) → create or
update the statute page → extract any sections drafts need with the extractor (verbatim) →
update index, gaps, log. Rewrite `wiki/legal-hot.md` (rules: about 500 words, ceiling 600,
rewritten in full, only summarising wiki pages). Then refresh the vault's hot cache (`../../wiki/hot.md`, rules in the
root `CLAUDE.md`): this project's paragraph only, plus a dated line under "Recently changed". If the new source supersedes an older one, mark the old pages
`outdated-source` and say which sections changed.

**Draft for a case.** Follow `drafting/drafting-workflow.md`: intake → read forum + section pages →
verify currency → draft in `cases/<slug>/draft.md` → run `drafting/loophole-audit.md` →
deliver draft + must-confirm list + filing/escalation steps. Export to Word/PDF on request.

**Query.** Read index → relevant pages → answer with `[[links]]` and page refs. If the
answer is reusable (a comparison, a forum route), file it as a new wiki page and log it.

**Hot cache.** `wiki/legal-hot.md` is also rewritten after every lint, schema change and finished
case draft, so its counts, gaps and open threads stay true.

**Lint (monthly or before a big filing).** Look for: pages past 90 days since
`last_checked`, sections cited in drafts without a section page, statutes with
`outdated-source`, forum pages whose contact details are unverified, contradictions
between pages, orphan pages. Record findings in `legal-gaps.md` and `legal-log.md`.

## Re-extracting a section verbatim

Section text is extracted with `tools/extract_section.py` (start regex → next-section regex, from a
given line) so nothing is retyped. If a section page and `raw/` ever disagree, `raw/`
wins and the page is regenerated; if `raw/` and the PDF disagree, the PDF wins.
