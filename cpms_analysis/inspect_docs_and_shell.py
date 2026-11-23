import re

with open('cpms_analysis/mock_db_snippet.js', 'r', encoding='utf-8') as f:
    txt = f.read()

# Look for documents inside matter details D
doc_sections = re.findall(r'documents:\s*(\[[^\]]+\])', txt)
print(f"Document arrays found in D: {len(doc_sections)}")
for i, d in enumerate(doc_sections):
    print(f"\n--- Matter documents sample {i+1} ---")
    print(d[:600])

# Look for templates in ae
m = re.search(r'ae\s*=\s*(\[[^\]]+\])', txt)
if m:
    print("\n--- Templates Library (ae) ---")
    print(m.group(1))

# Let's inspect the UI components in chunk-CyE91exf.js (the shell) to see the sidebar, navigation, header, etc.
with open('cpms_analysis/chunk-CyE91exf.js', 'r', encoding='utf-8') as f:
    shell_txt = f.read()

print(f"\nShell chunk size: {len(shell_txt)}")
nav_links = re.findall(r'routerLink\s*,\s*["\']([^"\']+)["\']', shell_txt)
print("Nav links in shell:", set(nav_links))

# Look for menu items / labels in shell
labels = re.findall(r'ɵɵtext\(\d+,\s*["\']([^"\']+)["\']\)', shell_txt)
print("Shell text labels:", set(labels))
