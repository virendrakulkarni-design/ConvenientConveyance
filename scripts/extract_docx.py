import zipfile
import xml.etree.ElementTree as ET
import os

docx_files = [
    'Domain Model & Data.docx',
    'engg.docx',
    'Platform Foundation.docx',
    'Standard & Decisions.docx'
]

def get_docx_text(path):
    with zipfile.ZipFile(path) as z:
        xml_content = z.read('word/document.xml')
    tree = ET.fromstring(xml_content)
    # namespaces
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    paragraphs = []
    for p in tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
        texts = [t.text for t in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if t.text]
        if texts:
            paragraphs.append(''.join(texts))
    return '\n'.join(paragraphs)

for doc in docx_files:
    print(f"=== {doc} ===")
    text = get_docx_text(doc)
    out_txt_path = doc.replace('.docx', '.txt')
    with open(out_txt_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"Extracted {len(text)} characters to {out_txt_path}")
    print("First 500 chars:\n", text[:500])
    print("\n" + "="*50 + "\n")
