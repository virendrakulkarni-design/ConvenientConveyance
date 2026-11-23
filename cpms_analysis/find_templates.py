import os
import re

out_dir = 'cpms_analysis'
for fname in os.listdir(out_dir):
    if fname.endswith('.js'):
        fpath = os.path.join(out_dir, fname)
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        if 'templates' in content:
            print(f"Found 'templates' in {fname} (length {len(content)})")
            # find all occurrences of .templates
            for m in re.finditer(r'templates\b', content):
                start = max(0, m.start() - 60)
                end = min(len(content), m.end() + 100)
                print(f"  [{m.start()}]: {content[start:end]}")
