with open('Domain Model & Data.txt', 'r', encoding='utf-8') as f:
    domain_text = f.read()

with open('engg.txt', 'r', encoding='utf-8') as f:
    engg_text = f.read()

with open('Standard & Decisions.txt', 'r', encoding='utf-8') as f:
    std_text = f.read()

# Let's extract Section on Documents from Domain Model
print("=== DOMAIN MODEL: DOCUMENTS & FORMS ===")
# search for 'Document' entity or 'Form' entity
for heading in ['Documents', 'Form template', 'Form instance', 'Section 6', 'Section 7', 'Section 8', 'DocumentVersion']:
    pos = domain_text.find(heading)
    if pos != -1:
        print(f"\n--- HEADING: {heading} (pos {pos}) ---")
        print(domain_text[pos:pos+1500])

print("\n=== ENGG: MODULE MAP & DOCUMENT / FORM VOLUMES ===")
pos_map = engg_text.find('Module map')
if pos_map != -1:
    print(engg_text[pos_map:pos_map+2000])
else:
    # search for 'Vol'
    vols = [m.start() for m in re.finditer(r'Vol\s+\d|Volume\s+\d', engg_text)]
    for v in vols[:5]:
        print(engg_text[v-50:v+400])

print("\n=== DECISIONS LIST IN STANDARD & DECISIONS ===")
pos_dec = std_text.find('Decision Register')
if pos_dec != -1:
    print(std_text[pos_dec:pos_dec+3000])
