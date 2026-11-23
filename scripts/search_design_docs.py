import os
import re

files = {
    'engg': 'engg.txt',
    'domain': 'Domain Model & Data.txt',
    'platform': 'Platform Foundation.txt',
    'standard': 'Standard & Decisions.txt'
}

for name, fname in files.items():
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    print(f"================ {name.upper()} ({fname}) ================")
    # Look for mentions of document, template, documents, generation, storage, etc.
    matches = re.findall(r'(?:[^\n]+\n){0,3}[^\n]*(?:document|template|vol\s*4|sdd-0[0-9])[^\n]*(?:\n[^\n]+){0,3}', content, re.IGNORECASE)
    print(f"Total matching sections for document/template: {len(matches)}")
    for m in matches[:5]:
        print("--- MATCH ---")
        print(m.strip()[:400])
