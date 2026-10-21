"""Verbatim section extractor for the MSK AI OS legal wiki.

Usage:  python3 tools/extract_section.py "<raw file name>" "<start regex>" "<end regex>" [from_line]
Prints the block between the first line matching <start regex> (inclusive) and the next
line matching <end regex> (exclusive), searching from from_line (0-based). The text is never
modified; only trailing blank lines are dropped. Also reports line range and PDF pages.
"""
import os, re, sys
RAW = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'raw', 'laws')

def extract(fname, start_re, end_re, from_line=0):
    lines = open(os.path.join(RAW, fname), encoding='utf-8').read().split('\n')
    page = None; s = None; spage = None
    for i, l in enumerate(lines):
        m = re.match(r'<!-- Page (\d+) -->', l)
        if m: page = int(m.group(1))
        if i < from_line: continue
        if s is None and re.match(start_re, l):
            s = i; spage = page; continue
        if s is not None and re.match(end_re, l):
            e = i; break
    else:
        raise SystemExit(f'not found: {start_re} .. {end_re} in {fname}')
    block = lines[s:e]
    while block and not block[-1].strip(): block.pop()
    pages = f'{spage}' if spage == page else f'{spage}-{page}'
    return dict(start=s + 1, end=s + len(block), pages=pages, text='\n'.join(block))

if __name__ == '__main__':
    a = sys.argv[1:]
    r = extract(a[0], a[1], a[2], int(a[3]) if len(a) > 3 else 0)
    print(f"lines {r['start']}-{r['end']}, PDF page(s) {r['pages']}\n")
    print(r['text'])
