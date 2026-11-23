import re

with open('cpms_analysis/main.js', 'r', encoding='utf-8') as f:
    main_txt = f.read()

# Extract all readable string literals of length >= 4
strings = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"|\'([^\'\\]*(?:\\.[^\'\\]*)*)\'', main_txt)
all_strs = []
for s1, s2 in strings:
    s = s1 if s1 else s2
    if len(s) >= 4 and not re.match(r'^[a-zA-Z0-9_\-\.]{1,8}$', s):
        all_strs.append(s)

print(f"Total interesting strings: {len(all_strs)}")

# Let's find template text, headings, button labels, navigation labels
ui_labels = [s for s in all_strs if any(c.isupper() for c in s) and len(s) < 100]
print("\nSample UI labels / strings:")
for s in sorted(set(ui_labels))[:80]:
    print(" -", s)

# Search for route definitions
# In Angular 17/18/19 with standalone components:
# provideRouter([...]) or [{path: '...', component: ...}]
route_matches = re.findall(r'path:\s*"([^"]*)"', main_txt)
print("\nRoute matches with double quotes:", set(route_matches))

# Look for router-related structures
router_snippets = re.findall(r'\{path:[^}]+\}', main_txt)
print(f"\nRouter snippets found ({len(router_snippets)}):")
for r in router_snippets[:20]:
    print("  ", r)

# Look for component templates: ɵɵelementStart, ɵɵtext, ɵɵtemplate, etc.
# In Angular, templates have text nodes: ɵɵtext(index, "Some Text")
texts = re.findall(r'ɵɵtext\(\d+,\s*["\']([^"\']+)["\']\)', main_txt)
print(f"\nAngular ɵɵtext values ({len(texts)}):")
for t in set(texts):
    print("  *", t)
