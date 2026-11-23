with open('cpms_analysis/chunk-dQ1yy7rz.js', 'r', encoding='utf-8') as f:
    tour_code = f.read()

print("chunk-dQ1yy7rz.js size:", len(tour_code))

# Format it
formatted = tour_code.replace(';', ';\n').replace('{', '{\n').replace('}', '\n}\n')
with open('cpms_analysis/tour_clean.txt', 'w', encoding='utf-8') as f:
    f.write(formatted)

print("Saved tour_clean.txt. Length:", len(formatted))

# Let's search for step definitions, popover titles, descriptions
import re

steps = re.findall(r'popover:\s*\{([^}]+)\}', tour_code)
print(f"Popover steps found: {len(steps)}")
for i, s in enumerate(steps):
    print(f"\n--- STEP {i+1} ---")
    print(s)

# Also look for any step titles or descriptions
titles = re.findall(r'title:\s*["\']([^"\']+)["\']', tour_code)
descriptions = re.findall(r'description:\s*["\']([^"\']+)["\']', tour_code)
print("\nTitles found:", titles)
print("\nDescriptions found:", descriptions)
