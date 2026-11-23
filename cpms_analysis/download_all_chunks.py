import urllib.request
import re
import os

base_url = 'https://cpms-demo-1.web.app/'
out_dir = 'cpms_analysis'
os.makedirs(out_dir, exist_ok=True)

chunks_to_fetch = [
    'chunk-CyE91exf.js', # DemoShell
    'chunk-BhstPguA.js', # DemoDashboardScreen
    'chunk-dP-VkGwE.js', # DemoClientsScreen
    'chunk-BekLd8UQ.js', # DemoClientDetailScreen
    'chunk-Bsc0o42W.js', # DemoWorkspacesScreen
    'chunk-mtJjNpzs.js', # DemoWorkspaceDetailScreen
    'chunk-BQiyk_AR.js', # DemoPropertiesScreen
    'chunk-BKTxlIBc.js', # DemoFinancialsScreen
    'chunk-CGh4VkTq.js', # DemoTrustScreen
    'chunk-DDRXT2KS.js', # DemoUsersScreen
    'chunk-gy8p5OUg.js', # DemoRolesScreen
    'chunk-CUPT9Ac7.js', # DemoDocumentsScreen
]

def fetch(c):
    url = base_url + c
    dest = os.path.join(out_dir, c)
    print(f"Fetching {c}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as resp, open(dest, 'wb') as f:
            f.write(resp.read())
        return True
    except Exception as e:
        print(f"Failed {c}: {e}")
        return False

for c in chunks_to_fetch:
    fetch(c)

print("Downloaded all route chunks.")
