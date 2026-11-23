with open('CPMS Agentic AI Stack Design.txt', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Find numbered headings e.g. "1. ", "2. ", "2.1 ", etc.
headings = re.findall(r'(\n(?:[0-9]+\.[0-9]*|[0-9]+)\s+[^\n]+)', text)
print("=== Headings found ===")
for h in headings:
    print(h.strip())

# Look for agent definitions or roles
print("\n=== Agent Definitions ===")
agents = re.findall(r'Agent\s*:\s*[^\n]+|Agent\s+Name[^\n]+|[A-Z][a-zA-Z\s]+Agent\b', text)
print(set(agents))
