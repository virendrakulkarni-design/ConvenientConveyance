import re

with open('cpms_analysis/chunk-dQ1yy7rz.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Let's search for exported items or class definitions
exports = re.findall(r'export\s*\{([^}]+)\}', code)
print("Exports:", exports)

# Let's find definition of Bn
m = re.search(r'\b(?:class|var|const|let)\s+Bn\b', code)
if m:
    pos = m.start()
    print("Found Bn at:", pos)
    print(code[pos:pos+3000])
else:
    # Look for Bn in export mapping e.g. { ... as Bn }
    m2 = re.search(r'([a-zA-Z0-9_$]+)\s+as\s+Bn', code)
    if m2:
        orig_name = m2.group(1)
        print(f"Bn is alias of {orig_name}")
        m3 = re.search(rf'\b(?:class|var|const|let)\s+{re.escape(orig_name)}\b', code)
        if m3:
            pos = m3.start()
            print(f"Found {orig_name} at:", pos)
            print(code[pos:pos+4000])

# Check for Driver.js
if 'driver' in code.lower():
    print("Mentions driver!")
