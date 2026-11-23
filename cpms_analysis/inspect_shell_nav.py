with open('cpms_analysis/chunk-CyE91exf.js', 'r', encoding='utf-8') as f:
    shell = f.read()

idx = shell.find('DemoShell')
class_code = shell[max(0, idx - 4000): idx]
print("Class code before DemoShell:")
print(class_code)
