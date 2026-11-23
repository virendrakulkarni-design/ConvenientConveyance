with open('cpms_analysis/main.js', 'r', encoding='utf-8') as f:
    main_txt = f.read()

pos = 185939
# Let's inspect the entire section from ~170000 to ~186000
snippet = main_txt[170000:pos+500]

with open('cpms_analysis/mock_db_snippet.js', 'w', encoding='utf-8') as f:
    f.write(snippet)

print("Saved mock_db_snippet.js, length:", len(snippet))

# Let's search for the definitions of te, p, D, ee, z
import re

for var in ['te', 'p', 'D', 'ee', 'z', 'q', 'X', 'Q', 'Z', 'ae']:
    pattern = rf'(?:var|const|let)\s+{var}\s*=\s*'
    m = re.search(pattern, snippet)
    if m:
        val_start = m.end()
        print(f"\n--- {var} ---")
        print(snippet[val_start:val_start+500])
    else:
        # try anywhere in main_txt
        m2 = re.search(pattern, main_txt)
        if m2:
            print(f"\n--- {var} (found elsewhere) ---")
            print(main_txt[m2.end():m2.end()+500])
