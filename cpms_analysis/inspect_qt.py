import re

with open('cpms_analysis/chunk-dQ1yy7rz.js', 'r', encoding='utf-8') as f:
    code = f.read()

pos_qt = code.rfind('Qt=')
if pos_qt == -1:
    pos_qt = code.rfind('var Qt=')
if pos_qt == -1:
    pos_qt = code.rfind('Qt =')

print("pos_qt:", pos_qt)
if pos_qt != -1:
    print("=== Qt DEFINITION ===")
    print(code[pos_qt:pos_qt+3000])
else:
    # search for 'Qt'
    matches = [m.start() for m in re.finditer(r'\bQt\s*=', code)]
    print("Matches for Qt =:", matches)
    for m in matches:
        print(code[m:m+1500])
