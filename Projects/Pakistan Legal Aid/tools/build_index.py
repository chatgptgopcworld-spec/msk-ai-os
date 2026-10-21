"""Rebuilds wiki/legal-index.md from page frontmatter and titles. Run: python3 tools/build_index.py"""
import os, re
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
GROUPS = [('Start here', ['wiki/legal-hot.md', 'wiki/legal-gaps.md', 'wiki/legal-log.md']),
          ('Forums', 'wiki/forums'), ('Statutes', 'wiki/statutes'),
          ('Sections (verbatim)', 'wiki/sections'), ('Sources', 'wiki/sources'),
          ('Drafting', 'drafting')]
def meta(path):
    t = open(path, encoding='utf-8').read()
    m0 = re.match(r'---\n(.*?)\n---\n', t, re.S)
    fm = dict(re.findall(r'^(\w+): (.*)$', m0.group(1), re.M)) if m0 else {}
    m = re.search(r'^# (.+)$', t, re.M)
    return (m.group(1) if m else os.path.basename(path)), fm
out = ['# Pakistan Legal Aid: index', '', 'Catalogue of every page. Status: verified · needs-check · outdated-source. Rebuilt by `tools/build_index.py`.', '']
for name, spec in GROUPS:
    files = spec if isinstance(spec, list) else sorted(os.path.join(spec, f) for f in os.listdir(os.path.join(ROOT, spec)) if f.endswith('.md'))
    out += [f'## {name}', '']
    for rel in files:
        title, fm = meta(os.path.join(ROOT, rel))
        slug = os.path.basename(rel)[:-3]
        st = f" — `{fm['status']}`" if 'status' in fm else ''
        out.append(f'- [[{slug}]] {title}{st}')
    out.append('')
open(os.path.join(ROOT, 'wiki', 'legal-index.md'), 'w', encoding='utf-8').write('\n'.join(out))
print('\n'.join(out))
