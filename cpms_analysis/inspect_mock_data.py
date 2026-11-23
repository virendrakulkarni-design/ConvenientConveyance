with open('cpms_analysis/main.js', 'r', encoding='utf-8') as f:
    main_txt = f.read()

pos = 185939
print("=== AROUND API DEFINITION IN MAIN.JS ===")
print(main_txt[pos-1000:pos+1500])

# Find definition of ae, X, q, Q, Z, etc.
# search backwards from pos for 'var ae=' or 'const ae=' or 'let ae='
snippet = main_txt[max(0, pos-25000):pos]
print("\n=== FINDING MOCK DATA DEFINITIONS ===")
import re
vars_found = re.findall(r'(?:var|const|let)\s+(ae|X|q|Q|Z)\s*=\s*(\[[^\]]+\])', snippet)
for var_name, val in vars_found:
    print(f"Var {var_name}: {val[:300]}...")

# Also find where ae is defined
ae_matches = [m.start() for m in re.finditer(r'\bae\s*=\s*\[', snippet)]
for m in ae_matches:
    print("ae definition snippet:")
    print(snippet[m:m+1500])
