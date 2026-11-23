import os
import re

with open('cpms_analysis/chunk-CUPT9Ac7.js', 'r', encoding='utf-8') as f:
    doc_code = f.read()

print(f"chunk-CUPT9Ac7.js size: {len(doc_code)} chars")

# Angular compiles templates into instructions or template strings
# Let's extract strings enclosed in backticks, double quotes, and single quotes
backticks = re.findall(r'`([^`]+)`', doc_code)
print(f"Backtick strings: {len(backticks)}")
for b in backticks:
    print("BACKTICK:\n", b[:400], "\n" + "="*40)

# Check for component definition class DemoDocumentsScreen
idx = doc_code.find('DemoDocumentsScreen')
if idx != -1:
    snippet = doc_code[max(0, idx - 500): min(len(doc_code), idx + 2500)]
    print("\n--- SNIPPET AROUND DemoDocumentsScreen ---\n")
    print(snippet)

# Format chunk-CUPT9Ac7.js
formatted = doc_code.replace(';', ';\n').replace('{', '{\n').replace('}', '\n}\n')
with open('cpms_analysis/doc_chunk_clean.txt', 'w', encoding='utf-8') as f:
    f.write(formatted)
print(f"Wrote formatted code to cpms_analysis/doc_chunk_clean.txt ({len(formatted)} chars)")
