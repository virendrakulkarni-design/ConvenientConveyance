import re

with open('cpms_analysis/chunk-CyE91exf.js', 'r', encoding='utf-8') as f:
    shell = f.read()

# Let's search for navigation items or route links
# Look for backtick strings in shell
backticks = re.findall(r'`([^`]+)`', shell)
print(f"Backticks count in shell: {len(backticks)}")

interesting = [b for b in backticks if any(c.isupper() for c in b) or '/' in b or 'lucide' in b]
print("\nSample interesting strings in shell:")
for s in interesting[:40]:
    print(" -", s)

# Let's see what icons or menu links exist
nav_items = re.findall(r'\{[^}]*(?:label|title|route|path|icon)[^}]*\}', shell)
print(f"\nNav items patterns found ({len(nav_items)}):")
for item in nav_items[:15]:
    print("  *", item)
