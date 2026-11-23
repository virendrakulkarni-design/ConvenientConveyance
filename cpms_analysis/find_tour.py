import os
import re

out_dir = 'cpms_analysis'

for fname in os.listdir(out_dir):
    if fname.endswith('.js'):
        fpath = os.path.join(out_dir, fname)
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        if 'Start the tour' in content or 'demoTour' in content or 'data-tour' in content or 'driver.js' in content.lower() or 'shepherd' in content.lower():
            print(f"=== Found tour references in {fname} ===")
            for m in re.finditer(r'(?:tour|Start the tour|driver)', content, re.IGNORECASE):
                start = max(0, m.start() - 60)
                end = min(len(content), m.end() + 100)
                # print sample
            print(f"  Total matches in {fname}: {len(list(re.finditer(r'tour', content, re.IGNORECASE)))}")

# Let's inspect chunk-CyE91exf.js where demoTour was used
with open('cpms_analysis/chunk-CyE91exf.js', 'r', encoding='utf-8') as f:
    shell = f.read()

# Find Bn definition or where demoTour comes from
# In DemoShell: demoTour = g(Bn);
# Let's see what Bn is
pos_bn = shell.find('demoTour=g(')
if pos_bn != -1:
    print("demoTour line:")
    print(shell[pos_bn-50:pos_bn+150])
    # extract the token name
    token = shell[pos_bn+11:pos_bn+13]
    print(f"Token: '{token}'")
    # find definition of this token in shell or imported
    m = re.search(rf'import\{{[^}}]*\b{re.escape(token)}\b[^}}]*\}}from"([^"]+)"', shell)
    if m:
        print(f"Imported from: {m.group(1)}")
    else:
        # find where token is defined
        for m_def in re.finditer(rf'\b{re.escape(token)}\s*=\s*', shell):
            print("Def in shell:", shell[m_def.start():m_def.start()+200])
