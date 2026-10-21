"""Mechanical health check for the MSK AI OS second-brain wiki.
Run from the vault root:  python3 tools/wiki_lint.py
Reports: broken links, orphan pages, pages missing from the index, missing frontmatter,
and files waiting in raw/inbox. Judgement checks (contradictions, stale claims) stay with Claude.
"""
import os, re, glob
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
os.chdir(ROOT)
pages = {os.path.basename(p)[:-3]: p for p in glob.glob('wiki/**/*.md', recursive=True)}
# every note in the vault (projects included) counts as a valid link target
# (code folders and git internals inside imported projects are skipped)
SKIP_DIRS = ('/.git/', '/node_modules/', '/projects/')
all_md = [p for p in glob.glob('**/*.md', recursive=True) if not any(s in '/' + p.replace(os.sep, '/') for s in SKIP_DIRS)]
vault = {os.path.basename(p)[:-3] for p in all_md}
def resolves(l):
    # path-style link, e.g. [[Projects/Hamzi Prompts/wiki/hot]]
    return (os.path.exists(l + '.md') or os.path.exists(l)) if '/' in l else l in vault
SKIP = {'brain-index', 'brain-log', 'brain-overview', 'hot'}
links, inbound = {}, {s: 0 for s in pages}
for s, p in pages.items():
    t = open(p, encoding='utf-8').read()
    links[s] = set(re.findall(r'\[\[([^\]|#]+)', t))
    for l in links[s]:
        if l in inbound and l != s: inbound[l] += 1
index = links.get('brain-index', set())
def show(title, items):
    print(f'\n{title}: {len(items)}')
    for i in sorted(items): print('  -', i)
show('Broken links (target page missing)', {f'{s} -> {l}' for s, ls in links.items() for l in ls if not resolves(l)})
show('Orphans (no inbound links)', {s for s, n in inbound.items() if n == 0 and s not in SKIP})
show('Not in brain-index', {s for s in pages if s not in index and s not in SKIP})
show('Missing frontmatter', {s for s, p in pages.items() if s not in {'brain-index', 'brain-log'} and not open(p, encoding='utf-8').read().startswith('---')})
hot_words = len(open('wiki/hot.md', encoding='utf-8').read().split('\n---\n', 1)[-1].split()) if os.path.exists('wiki/hot.md') else 0
print(f'\nHot cache words: {hot_words} (target ~500, ceiling 600)' + ('  <-- TOO LONG' if hot_words > 600 else ''))
show('Waiting in raw/inbox', {f for f in os.listdir('raw/inbox') if not f.startswith('.')})
# AIOS schema layer: pointers exist, skill map and skill files agree, links resolve
aios = []
for f in ('CLAUDE.md', 'AGENTS.md', 'AIOS/msk-me.md', 'AIOS/msk-vault-map.md', 'AIOS/msk-skill-map.md'):
    if not os.path.exists(f): aios.append(f'missing {f}')
if os.path.exists('AIOS/msk-skill-map.md'):
    listed = set(re.findall(r'\[\[(msk-skill-[^\]|#]+)', open('AIOS/msk-skill-map.md', encoding='utf-8').read()))
    files = {os.path.basename(p)[:-3] for p in glob.glob('AIOS/skills/*.md')}
    aios += [f'skill file not in skill map: {s}' for s in files - listed]
    aios += [f'skill map row has no file: {s}' for s in listed - files]
def strip_code(s):  # placeholders like `[[slug]]` inside code are examples, not links
    return re.sub(r'`[^`\n]*`', '', re.sub(r'```.*?```', '', s, flags=re.S))
for p in glob.glob('AIOS/**/*.md', recursive=True):
    for l in set(re.findall(r'\[\[([^\]|#]+)', strip_code(open(p, encoding='utf-8').read()))):
        if not resolves(l): aios.append(f'broken link {os.path.basename(p)} -> {l}')
show('AIOS schema problems', set(aios))
# me.md health: length and age (monthly review, see AIOS/skills/msk-skill-me-update.md)
if os.path.exists('AIOS/msk-me.md'):
    import datetime
    me = open('AIOS/msk-me.md', encoding='utf-8').read()
    lines = len([l for l in me.split('\n---\n', 1)[-1].splitlines() if l.strip()])
    m = re.search(r'^updated: (\d{4}-\d{2}-\d{2})', me, re.M)
    age = max(0, (datetime.date.today() - datetime.date.fromisoformat(m.group(1))).days) if m else None  # clamp: shell clock may be UTC
    note = []
    if lines > 80: note.append('too long, compress')
    if age is None or age >= 30: note.append('monthly review due')
    print(f'\nme.md: {lines} lines, updated {age} days ago' + (('  <-- ' + ', '.join(note)) if note else ''))
