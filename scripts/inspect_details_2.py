with open('Standard & Decisions.txt', 'r', encoding='utf-8') as f:
    std = f.read()

with open('Domain Model & Data.txt', 'r', encoding='utf-8') as f:
    dom = f.read()

with open('engg.txt', 'r', encoding='utf-8') as f:
    eng = f.read()

# 1. Print decisions table from std
pos_d = std.find('D-001')
if pos_d != -1:
    print("=== DECISIONS (D-001 onwards) ===")
    print(std[pos_d-100:pos_d+4000])

# 2. Extract Document & Form entity details from Domain Model
print("\n=== DOMAIN MODEL: SECTION ON DOCUMENTS & FORMS ===")
# search for '5.5' or 'documents' in dom
for section in ['5.5', '5.6', 'documents', 'forms']:
    pos = dom.find(section)
    if pos != -1:
        print(f"\n--- {section} in Domain Model ---")
        print(dom[pos:pos+2500])
