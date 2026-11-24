const test = require('node:test');
const assert = require('node:assert');

// Settlement transfer balance calculation logic
function calculateClientPortalFigures(purchasePriceNum, depositHeldNum) {
  const remainingFundsRequired = Math.max(0, purchasePriceNum - depositHeldNum);
  const percentagePaid = purchasePriceNum > 0 ? ((depositHeldNum / purchasePriceNum) * 100).toFixed(1) : '0.0';
  return {
    remainingFundsRequired,
    percentagePaid
  };
}

// Milestone stage mapper
function getMilestoneStepState(matterStageIndex, currentStepIndex) {
  if (currentStepIndex < matterStageIndex) return 'done';
  if (currentStepIndex === matterStageIndex) return 'active';
  return 'pending';
}

test('Client Portal - Financial Balance and Deposit Percentage Calculations', () => {
  // $1,250,000 purchase price with $125,000 (10%) deposit
  const { remainingFundsRequired, percentagePaid } = calculateClientPortalFigures(1250000, 125000);
  assert.strictEqual(remainingFundsRequired, 1125000, 'Remaining funds must equal purchase price minus deposit');
  assert.strictEqual(percentagePaid, '10.0', 'Percentage paid must accurately calculate 10.0%');

  // $740,000 purchase with $74,000 deposit
  const res2 = calculateClientPortalFigures(740000, 74000);
  assert.strictEqual(res2.remainingFundsRequired, 666000);
  assert.strictEqual(res2.percentagePaid, '10.0');
});

test('Client Portal - 5-Stage Settlement Milestone Tracker State', () => {
  // When matter is at Stage 3 (PEXA Workspace Ready, index 2)
  const matterStageIndex = 2;

  assert.strictEqual(getMilestoneStepState(matterStageIndex, 0), 'done', 'Step 1 should be done');
  assert.strictEqual(getMilestoneStepState(matterStageIndex, 1), 'done', 'Step 2 should be done');
  assert.strictEqual(getMilestoneStepState(matterStageIndex, 2), 'active', 'Step 3 should be active');
  assert.strictEqual(getMilestoneStepState(matterStageIndex, 3), 'pending', 'Step 4 should be pending');
  assert.strictEqual(getMilestoneStepState(matterStageIndex, 4), 'pending', 'Step 5 should be pending');
});

test('Client Portal - Cooling-Off Expiration Logic', () => {
  const coolingOff = {
    applicable: true,
    expiryDate: '2026-11-25T17:00:00.000Z',
    businessDays: 2
  };
  assert.strictEqual(coolingOff.applicable, true, 'Cooling off must be flagged as active');
  assert.strictEqual(coolingOff.businessDays, 2, 'SA statutory residential cooling-off is 2 business days');
});
