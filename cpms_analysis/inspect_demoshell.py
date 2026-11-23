with open('cpms_analysis/chunk-CyE91exf.js', 'r', encoding='utf-8') as f:
    shell = f.read()

idx = shell.find('DemoShell')
if idx != -1:
    snippet = shell[max(0, idx - 1500): min(len(shell), idx + 4000)]
    print("=== SNIPPET AROUND DemoShell ===")
    print(snippet)
else:
    print("DemoShell not found directly, searching 'DemoShell'...")
