import re
import os

with open('cpms_analysis/main.js', 'r', encoding='utf-8') as f:
    main_txt = f.read()

with open('cpms_analysis/chunk-BAeux_kX.js', 'r', encoding='utf-8') as f:
    chunk_txt = f.read()

print(f"main.js size: {len(main_txt)} chars")
print(f"chunk-BAeux_kX.js size: {len(chunk_txt)} chars")

# Check sourcemaps
sm_main = re.findall(r'sourceMappingURL=([^\s]+)', main_txt)
sm_chunk = re.findall(r'sourceMappingURL=([^\s]+)', chunk_txt)
print(f"SourceMappingURL main: {sm_main}")
print(f"SourceMappingURL chunk: {sm_chunk}")

# Check Angular routes
routes = re.findall(r'path:\s*["\']([^"\']*)["\']', main_txt + chunk_txt)
print(f"Routes found: {set(routes)}")

# Check components / selectors
selectors = set(re.findall(r'selector:\s*["\']([^"\']+)["\']', main_txt + chunk_txt))
print(f"Selectors found: {selectors}")

# Check API URLs / Firebase config
urls = set(re.findall(r'https?://[a-zA-Z0-9\.\-_/]+', main_txt + chunk_txt))
print(f"URLs found: {[u for u in urls if 'w3.org' not in u and 'google' not in u and 'github' not in u]}")

# Check keywords related to CPMS and documents
keywords = ['document', 'cpms', 'project', 'contract', 'payment', 'vendor', 'invoice', 'status', 'upload', 'role', 'auth']
for kw in keywords:
    matches = len(re.findall(re.escape(kw), main_txt + chunk_txt, re.IGNORECASE))
    print(f"Keyword '{kw}': {matches} matches")
