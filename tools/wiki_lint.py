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
    # path-style link, e.g. [[Projects/AI Brain/wiki/hot]]
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
