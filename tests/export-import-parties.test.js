const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function loadAppContext() {
  const root = path.resolve(__dirname, '..');
  const context = {
    console,
    Date,
    Math,
    JSON,
    Array,
    Object,
    String,
    Number,
    Boolean,
    RegExp,
    Error,
    setTimeout,
    clearTimeout,
    Blob: class MockBlob { constructor(parts) { this.parts = parts; } },
    URL: { createObjectURL: () => 'blob:mock', revokeObjectURL: () => {} },
    localStorage: { getItem: () => null, setItem: () => {} },
    location: { hash: '#/dashboard' },
    addEventListener: () => {},
    lucide: { createIcons: () => {} },
    document: {
      addEventListener: () => {},
      querySelector: () => null,
      querySelectorAll: () => [],
      getElementById: () => ({
        innerText: '',
        innerHTML: '',
        value: '',
        classList: { add: () => {}, remove: () => {}, toggle: () => {} },
        appendChild: () => {},
        click: () => {},
        style: {}
      }),
      createElement: () => ({
        className: '',
        innerHTML: '',
        style: {},
        click: () => {},
        remove: () => {}
      }),
      body: {
        classList: { add: () => {}, remove: () => {} },
        appendChild: () => {},
        removeChild: () => {}
      }
    }
  };
  context.window = context;
  context.globalThis = context;
  vm.createContext(context);

  vm.runInContext(fs.readFileSync(path.join(root, 'app/data.js'), 'utf8'), context);
  vm.runInContext(fs.readFileSync(path.join(root, 'app/app.js'), 'utf8'), context);
  vm.runInContext(fs.readFileSync(path.join(root, 'app/view-dashboard.js'), 'utf8'), context);
  vm.runInContext(fs.readFileSync(path.join(root, 'app/view-parties.js'), 'utf8'), context);
  context.CPMS_STORE = vm.runInContext('CPMS_STORE', context);

  return context;
}

test('Export & Import - Full State Roundtrip Across Reset', () => {
  const ctx = loadAppContext();
  const router = ctx.appRouter;

  const initialCount = ctx.CPMS_STORE.matters.length;
  // Add a custom matter with a custom buyer and seller
  ctx.CPMS_STORE.matters.unshift({
    id: 'mt-custom-99',
    reference: '2026-9999',
    transactionType: 'purchase',
    property: '101 Rundle Mall, Adelaide SA 5000',
    title: 'CT 9999/101',
    client: 'Test Buyer',
    manager: 'Demo Conveyancer',
    settlementDate: '20/12/2026',
    daysLeft: 25,
    stage: 'Contract signed',
    stageIndex: 1,
    voiStatus: 'verified',
    purchasePrice: '$950,000.00',
    depositHeld: '$95,000.00',
    balanceDue: '$855,000.00',
    contractDate: '25/11/2026',
    coolingOff: 'Active',
    parties: [
      { name: 'Test Buyer', role: 'Purchaser', phone: '0400 111 222', email: 'buyer@test.com', voi: 'verified' },
      { name: 'Test Seller', role: 'Vendor', phone: '0400 333 444', email: 'seller@test.com', voi: 'verified' }
    ],
    documents: [],
    trustAllocations: []
  });

  assert.strictEqual(ctx.CPMS_STORE.matters.length, initialCount + 1);

  // Export before reset
  const backup = router.buildExportPayload();
  assert.strictEqual(backup.schemaVersion, '1.0.0');
  assert.strictEqual(backup.data.matters.length, initialCount + 1);

  // Reset / Clean up all data
  router.confirmResetSyntheticData();
  assert.strictEqual(ctx.CPMS_STORE.matters.length, 0, 'Reset must clean up all matters');
  assert.strictEqual(ctx.CPMS_STORE.clients.length, 0, 'Reset must clean up all clients');
  assert.strictEqual(router.getAllParties().length, 0, 'Reset must clean up all parties');

  // Import the exported backup
  const restoreRes = router.restoreAppData(backup);
  assert.strictEqual(restoreRes.ok, true, 'Restore must succeed for valid backup');
  assert.strictEqual(ctx.CPMS_STORE.matters.length, initialCount + 1, 'Restored store must match exported matter count');
  assert.ok(ctx.CPMS_STORE.matters.some(m => m.reference === '2026-9999'), 'Custom matter must be restored after import');

  // Load demo data restores initial seed
  router.loadDemoData();
  assert.strictEqual(ctx.CPMS_STORE.matters.length, initialCount, 'loadDemoData must restore initial demo count');
});

test('Export & Import - Rejects Invalid Backup Payloads Safely', () => {
  const ctx = loadAppContext();
  const router = ctx.appRouter;
  const beforeCount = ctx.CPMS_STORE.matters.length;

  const bad1 = router.restoreAppData(null);
  assert.strictEqual(bad1.ok, false);

  const bad2 = router.restoreAppData({ schemaVersion: '1.0.0', data: { matters: 'not-an-array' } });
  assert.strictEqual(bad2.ok, false);

  assert.strictEqual(ctx.CPMS_STORE.matters.length, beforeCount, 'Store must remain untouched on failed import');
});

test('Parties Register - Aggregates All Roles Across Matters & Respects Privacy Mode', () => {
  const ctx = loadAppContext();
  const router = ctx.appRouter;

  const allParties = router.getAllParties();
  assert.ok(allParties.length >= 15, 'Should aggregate all parties across all matters');

  const categories = new Set(allParties.map(p => p.roleCategory));
  assert.ok(categories.has('Buyer / Purchaser'), 'Must include Buyers / Purchasers');
  assert.ok(categories.has('Seller / Vendor'), 'Must include Sellers / Vendors');
  assert.ok(categories.has('Mortgagee / Lender'), 'Must include Mortgagees / Lenders');
  assert.ok(categories.has('Agent & Other'), 'Must include Agents & Other');

  // Verify PII masking in Parties table HTML when Privacy Mode is active
  router.privacyMode = true;
  const html = router.getPartiesRowsHTML([allParties[0]]);
  assert.ok(html.includes('pii-sensitive'), 'Parties table must apply pii-sensitive class');
  assert.ok(!html.includes('Margaret Thi Nguyen'), 'Raw client name must be masked in Privacy Mode');
});
