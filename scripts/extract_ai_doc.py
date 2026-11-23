import zipfile
import xml.etree.ElementTree as ET

docx_path = 'CPMS Agentic AI Stack Design.docx'
with zipfile.ZipFile(docx_path) as z:
    xml_content = z.read('word/document.xml')

tree = ET.fromstring(xml_content)
paragraphs = []
for p in tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
    texts = [t.text for t in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if t.text]
    if texts:
        paragraphs.append(''.join(texts))

full_text = '\n'.join(paragraphs)
out_path = 'CPMS Agentic AI Stack Design.txt'
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(full_text)

print(f"Extracted {len(full_text)} characters to {out_path}")
print("--- FIRST 1500 CHARACTERS ---")
print(full_text[:1500])
