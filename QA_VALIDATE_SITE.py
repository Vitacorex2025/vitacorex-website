#!/usr/bin/env python3
import os, re, glob
from bs4 import BeautifulSoup

ROOT = os.path.abspath(os.path.dirname(__file__))

def read(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def main():
    pages = sorted(glob.glob(os.path.join(ROOT, '*.html')))
    broken = []
    issues = []
    old_phone_hits = []

    for path in pages:
        name = os.path.basename(path)
        html = read(path)
        soup = BeautifulSoup(html, 'html.parser')

        if re.search(r'813[\s\-]*919[\s\-]*4242', html):
            old_phone_hits.append(name)

        if not soup.title or not soup.title.get_text(strip=True):
            issues.append((name, 'missing_title'))
        desc = soup.find('meta', attrs={'name':'description'})
        if not desc or not desc.get('content','').strip():
            issues.append((name, 'missing_description'))
        canon = soup.find('link', rel='canonical')
        if not canon or not canon.get('href','').strip():
            issues.append((name, 'missing_canonical'))
        if name not in {'ai-intake.html','auto-purchase.html','business-plans.html','contracts.html','corporate-paralegal.html','immigration-documents.html','net-recovery.html'}:
            if not soup.find_all('script', attrs={'type':'application/ld+json'}):
                issues.append((name, 'missing_jsonld'))

        for tag in soup.find_all(['a','link','script','img','source','video']):
            attr = 'href' if tag.name in ['a','link'] else 'src'
            url = tag.get(attr)
            if not url or url.startswith(('http://','https://','mailto:','tel:','#','javascript:','data:')):
                continue
            rel_path = url.split('#')[0].split('?')[0]
            if not rel_path:
                continue
            target = os.path.normpath(os.path.join(os.path.dirname(path), rel_path))
            if not os.path.exists(target):
                broken.append((name, tag.name, url))

    print('Broken local links/assets:', len(broken))
    if broken:
        for row in broken:
            print('  ', row)

    print('Legacy phone hits:', len(old_phone_hits))
    if old_phone_hits:
        for row in old_phone_hits:
            print('  ', row)

    print('Metadata/schema issues:', len(issues))
    if issues:
        for row in issues:
            print('  ', row)

if __name__ == '__main__':
    main()
