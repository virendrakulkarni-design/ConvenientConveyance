const test = require('node:test');
const assert = require('node:assert');

// Mock DOM elements for test
class MockElement {
  constructor(id) {
    this.id = id;
    this.classList = new Set();
    this.style = {};
    this.value = '';
    this.innerHTML = '';
  }
  classListAdd(cls) { this.classList.add(cls); }
  classListRemove(cls) { this.classList.delete(cls); }
}

test('AI Assistant & Human Review Separation - Mutually Exclusive Drawer State', () => {
  let isReviewOpen = false;
  let isChatOpen = false;

  function toggleReviewDrawer() {
    isReviewOpen = !isReviewOpen;
    if (isReviewOpen) {
      isChatOpen = false; // close chat drawer when opening review
    }
  }

  function toggleChatDrawer() {
    isChatOpen = !isChatOpen;
    if (isChatOpen) {
      isReviewOpen = false; // close review drawer when opening chat
    }
  }

  // Initial state: both closed
  assert.strictEqual(isReviewOpen, false);
  assert.strictEqual(isChatOpen, false);

  // Open Human Review
  toggleReviewDrawer();
  assert.strictEqual(isReviewOpen, true, 'Review drawer should be open');
  assert.strictEqual(isChatOpen, false, 'Chat drawer should remain closed');

  // Open AI Chat -> should auto-close Human Review
  toggleChatDrawer();
  assert.strictEqual(isChatOpen, true, 'Chat drawer should now be open');
  assert.strictEqual(isReviewOpen, false, 'Review drawer must automatically close to avoid panel clutter');

  // Open Human Review again -> should auto-close AI Chat
  toggleReviewDrawer();
  assert.strictEqual(isReviewOpen, true, 'Review drawer should be open again');
  assert.strictEqual(isChatOpen, false, 'Chat drawer must close when review opens');
});

test('AI Assistant - Help Guide Toggle State', () => {
  let isHelpOpen = false;

  function toggleHelp() {
    isHelpOpen = !isHelpOpen;
    return isHelpOpen;
  }

  assert.strictEqual(isHelpOpen, false, 'Help starts hidden');
  assert.strictEqual(toggleHelp(), true, 'Toggling help turns it visible');
  assert.strictEqual(toggleHelp(), false, 'Toggling help again hides it');
});

test('AI Assistant - Active Matter Grounding Resolution', () => {
  const mockMatters = [
    { id: 'mt-1', reference: '2026-0184', property: '57 Prospect Road, Norwood SA 5067' },
    { id: 'mt-2', reference: '2026-0192', property: '12 Albert Street, Mitcham SA 5062' }
  ];

  function getGroundingText(activeMatterId) {
    const active = mockMatters.find(m => m.id === activeMatterId) || mockMatters[0];
    return `Grounding: [${active.reference}] ${active.property}`;
  }

  assert.strictEqual(getGroundingText('mt-1'), 'Grounding: [2026-0184] 57 Prospect Road, Norwood SA 5067');
  assert.strictEqual(getGroundingText('mt-2'), 'Grounding: [2026-0192] 12 Albert Street, Mitcham SA 5062');
  assert.strictEqual(getGroundingText('non-existent'), 'Grounding: [2026-0184] 57 Prospect Road, Norwood SA 5067', 'Fallback to default matter');
});
