import os, re
build = '/tmp/vcx_build_264'
all_files = set()
for root, dirs, files in os.walk(build):
    for f in files:
        p = os.path.join(root, f).replace(build, '')
        p = p.replace(os.sep, '/')
        all_files.add(p)

missing = []
for root, dirs, files in os.walk(build):
    for f in files:
        if not f.endswith('.html'):
            continue
        path = os.path.join(root, f)
        text = open(path, errors='ignore').read()
        refs = re.findall(r'(?:href|src)=["\']([^"\'?#\s]+)["\']', text)
        for ref in refs:
            if not ref.startswith('/assets/') and not ref.startswith('/app/'):
                continue
            if ref not in all_files:
                missing.append((path.replace(build,''), ref))
for p, r in sorted(set(missing))[:30]:
    print('MISSING: %s (ref in %s)' % (r, p))
print('Total missing: %d' % len(set(missing)))
