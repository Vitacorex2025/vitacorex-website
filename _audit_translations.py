"""Audit missing translations across procurement pages."""
import re
from html.parser import HTMLParser


def walker_norm(s):
    """Mirrors normText() in vcx-page-translations.js."""
    s = s or ''
    # Fold curly quotes to straight
    for c in '\u2018\u2019\u201A\u201B':
        s = s.replace(c, "'")
    for c in '\u201C\u201D\u201E\u201F':
        s = s.replace(c, '"')
    # en/em dash -> em dash
    for c in '\u2013\u2014':
        s = s.replace(c, '\u2014')
    s = s.replace('\u2026', '...')
    s = re.sub(r'\s+', ' ', s).strip()
    return s


# Read current translation keys
with open('assets/js/vcx-page-translations.js', encoding='utf-8') as f:
    js = f.read()
# Capture keys declared with single or double quotes
raw_keys = re.findall(r"^\s*add\('((?:[^'\\]|\\.)*)'", js, re.M)
raw_keys_d = re.findall(r'^\s*add\("((?:[^"\\]|\\.)*)"', js, re.M)
keys = set()
for k in raw_keys + raw_keys_d:
    k2 = k.replace(r"\'", "'").replace(r'\"', '"')
    keys.add(walker_norm(k2))
print(f'Current translation keys: {len(keys)}')

TARGET_TAGS = {'h1', 'h2', 'h3', 'p', 'li', 'span'}
SKIP_PARENTS = {'header', 'footer', 'nav', 'script', 'style'}

ENTS = {
    'amp': '&', 'lt': '<', 'gt': '>', 'quot': '"', 'apos': "'",
    'nbsp': ' ', 'ndash': '\u2014', 'mdash': '\u2014', 'hellip': '...',
    'times': 'x', 'copy': '(c)',
}


class Extractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.in_target = False
        self.in_skip = 0
        self.strings = []
        self.cur = []
        self.cur_tag = None
        self.cur_class = ''

    def handle_starttag(self, tag, attrs):
        attrd = dict(attrs)
        if tag in SKIP_PARENTS:
            self.in_skip += 1
            self.stack.append(tag)
            return
        if any(k in attrd for k in ('data-common', 'data-tx', 'data-page', 'data-i18n', 'data-v52')):
            self.in_skip += 1
            self.stack.append(tag + '::skipped')
            return
        self.stack.append(tag)
        if tag in TARGET_TAGS and self.in_skip == 0:
            if tag == 'span':
                cls = attrd.get('class', '')
                if 'eyebrow' not in cls and 'pill' not in cls:
                    return
            self.in_target = True
            self.cur = []
            self.cur_tag = tag
            self.cur_class = attrd.get('class', '')

    def handle_endtag(self, tag):
        if not self.stack:
            return
        popped = self.stack.pop()
        if popped.endswith('::skipped') or popped in SKIP_PARENTS:
            if self.in_skip > 0:
                self.in_skip -= 1
            return
        if self.in_target and tag == self.cur_tag:
            s = ''.join(self.cur).strip()
            s = re.sub(r'\s+', ' ', s)
            if s:
                self.strings.append((tag, self.cur_class, s))
            self.in_target = False
            self.cur_tag = None
            self.cur = []

    def handle_data(self, data):
        if self.in_target and self.in_skip == 0:
            self.cur.append(data)

    def handle_entityref(self, name):
        if self.in_target and self.in_skip == 0:
            self.cur.append(ENTS.get(name, ''))


import glob
PAGES = sorted(glob.glob('*.html'))

all_missing = {}
for page in PAGES:
    with open(page, encoding='utf-8') as f:
        html = f.read()
    # Strip inline-formatting tags so parent elements read as leaf text
    cleaned = re.sub(
        r'</?(?:strong|em|code|b|i|small|abbr|u|sup|sub)\b[^>]*>',
        '', html, flags=re.I,
    )
    e = Extractor()
    e.feed(cleaned)
    missing = []
    for tag, cls, s in e.strings:
        if len(s) > 600:
            continue
        s_n = walker_norm(s)
        if s_n in keys:
            continue
        if re.match(r'^[0-9 ./,+%\-$]+$', s_n):
            continue
        missing.append((tag, cls[:30], s_n))
    all_missing[page] = missing

total = 0
for page, items in all_missing.items():
    print(f'\n=== {page}: {len(items)} missing ===')
    total += len(items)
    for tag, cls, s in items:
        show = s if len(s) < 160 else s[:157] + '...'
        # Strip non-ASCII for Windows console compatibility
        safe = show.encode('ascii', 'replace').decode('ascii')
        print(f'  <{tag:4s}> {safe}')

print(f'\nTOTAL MISSING: {total}')
