const test = require('node:test');
const assert = require('node:assert');

// Statutory Trust 3-Way Reconciliation Invariant (Law Society SA Schedule 2)
function verify3WayReconciliation({ bankBalance, unpresentedCheques, depositsInTransit, cashBookBalance, clientSubLedgers }) {
  const adjustedBankBalance = Math.round((bankBalance - unpresentedCheques + depositsInTransit) * 100) / 100;
  const subLedgerTotal = Math.round(clientSubLedgers.reduce((sum, acc) => sum + acc.balance, 0) * 100) / 100;

  const bankVsCashBookVariance = Math.round((adjustedBankBalance - cashBookBalance) * 100) / 100;
  const cashBookVsSubLedgerVariance = Math.round((cashBookBalance - subLedgerTotal) * 100) / 100;

  const isBalanced = (bankVsCashBookVariance === 0) && (cashBookVsSubLedgerVariance === 0);

  return {
    adjustedBankBalance,
    cashBookBalance,
    subLedgerTotal,
    bankVsCashBookVariance,
    cashBookVsSubLedgerVariance,
    isBalanced
  };
}

test('Trust Accounting - Law Society 3-Way Reconciliation Balance Invariant', () => {
  const data = {
    bankBalance: 845480.00,
    unpresentedCheques: 385.00, // Chq #004128 to SA Water
    depositsInTransit: 770.00,
    cashBookBalance: 845865.00, // 845480 - 385 + 770 = 845865
    clientSubLedgers: [
      { matterRef: '2026-0184', balance: 124615.00 },
      { matterRef: '2026-0167', balance: 210000.00 },
      { matterRef: '2026-0178', balance: 345000.00 },
      { matterRef: '2026-0175', balance: 98250.00 },
      { matterRef: '2026-0179', balance: 68000.00 }
    ]
  };

  const result = verify3WayReconciliation(data);

  assert.strictEqual(result.isBalanced, true, 'Reconciliation must be in mathematical balance');
  assert.strictEqual(result.bankVsCashBookVariance, 0, 'Bank vs Cash book variance must be $0.00');
  assert.strictEqual(result.cashBookVsSubLedgerVariance, 0, 'Cash book vs Client sub-ledgers variance must be $0.00');
});

test('Trust Accounting - Discrepancy Detection on Unbalanced Ledger', () => {
  const faultyData = {
    bankBalance: 845480.00,
    unpresentedCheques: 385.00,
    depositsInTransit: 0.00,
    cashBookBalance: 845865.00, // Discrepancy of $770 unrecorded deposit
    clientSubLedgers: [
      { matterRef: '2026-0184', balance: 124615.00 }
    ]
  };

  const result = verify3WayReconciliation(faultyData);

  assert.strictEqual(result.isBalanced, false, 'Unbalanced ledger must be detected immediately');
  assert.notStrictEqual(result.bankVsCashBookVariance, 0, 'Variance must not equal 0');
});
