with open('Domain Model & Data.txt', 'r', encoding='utf-8') as f:
    dom = f.read()

pos_forms = dom.find('5.7 Forms')
print("=== SECTION 5.7 FORMS & TEMPLATES ===")
print(dom[pos_forms:pos_forms+3000])

pos_docs = dom.find('5.6 Documents')
print("=== SECTION 5.6 DOCUMENTS ===")
print(dom[pos_docs:pos_docs+3000])
