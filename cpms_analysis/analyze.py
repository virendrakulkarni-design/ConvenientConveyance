import urllib.request
import re
import os
import json

base_url = 'https://cpms-demo-1.web.app/'
out_dir = os.path.join(os.getcwd(), 'cpms_analysis')
os.makedirs(out_dir, exist_ok=True)

def fetch(url, dest):
    print(f"Fetching {url} -> {dest}")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as resp, open(dest, 'wb') as f:
            f.write(resp.read())
        return True
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return False

# Fetch index.html
fetch(base_url + 'index.html', os.path.join(out_dir, 'index.html'))
fetch(base_url + 'main-77Y2FUJE.js', os.path.join(out_dir, 'main.js'))
fetch(base_url + 'chunk-BAeux_kX.js', os.path.join(out_dir, 'chunk-BAeux_kX.js'))

with open(os.path.join(out_dir, 'main.js'), 'r', encoding='utf-8') as f:
    main_txt = f.read()

# Look for chunk names or lazy dynamic imports
found_chunks = set(re.findall(r'[\'"]([a-zA-Z0-9_\-]+\.js)[\'"]', main_txt))
print(f"Potential chunks in main.js: {found_chunks}")

for c in sorted(found_chunks):
    if c.endswith('.js') and c not in ['main.js', 'chunk-BAeux_kX.js']:
        fetch(base_url + c, os.path.join(out_dir, c))

# Let's also check index.html for other links or scripts
with open(os.path.join(out_dir, 'index.html'), 'r', encoding='utf-8') as f:
    idx_txt = f.read()
idx_scripts = set(re.findall(r'src=[\'"]([^\'"]+)[\'"]', idx_txt))
idx_links = set(re.findall(r'href=[\'"]([^\'"]+)[\'"]', idx_txt))
print(f"Scripts in index: {idx_scripts}")
print(f"Links in index: {idx_links}")

for item in idx_scripts.union(idx_links):
    if item.endswith('.js') or item.endswith('.css') or item.endswith('.json'):
        fetch(base_url + item.lstrip('/'), os.path.join(out_dir, os.path.basename(item)))
