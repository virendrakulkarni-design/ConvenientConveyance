import re

with open('cpms_analysis/chunk-BAeux_kX.js', 'r', encoding='utf-8') as f:
    chunk_txt = f.read()

# Look for templates() definition or mock data
pos = chunk_txt.find('templates()')
if pos != -1:
    print("Found templates() at", pos)
    print(chunk_txt[pos-300:pos+1500])
else:
    # search for 'template' and see where api service is
    matches = [m.start() for m in re.finditer(r'templates\s*\(', chunk_txt)]
    print(f"Matches for templates(: {matches}")
    for m in matches:
        print("MATCH:\n", chunk_txt[m-100:m+500], "\n" + "="*50)

# Let's also check for mock data arrays (e.g. government_form, firm_template)
gf_matches = [m.start() for m in re.finditer(r'government_form', chunk_txt)]
print(f"government_form matches: {gf_matches}")
for m in gf_matches:
    print("GF MATCH:\n", chunk_txt[m-200:m+800], "\n" + "-"*50)
