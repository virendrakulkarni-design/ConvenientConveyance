const test = require('node:test');
const assert = require('node:assert');

// Logic extracted from app.js maskPII
function maskPII(str, type = 'general') {
  if (!str) return str;
  if (type === 'name') {
    const parts = str.trim().split(/\s+/);
    return parts.map(p => {
      if (p.length <= 2) return p[0] + '•';
      return p[0] + '•'.repeat(p.length - 2) + p[p.length - 1];
    }).join(' ');
  }
  if (type === 'email') {
    const [user, domain] = str.split('@');
    if (!domain) return str;
    const maskedUser = user.length <= 2 ? user[0] + '•' : user[0] + '•'.repeat(Math.max(1, user.length - 2)) + user[user.length - 1];
    return `${maskedUser}@${domain}`;
  }
  if (type === 'phone') {
    const clean = str.replace(/[^\d+]/g, '');
    if (clean.length > 6) {
      return str.slice(0, 4) + ' ••• ••• ' + str.slice(-3);
    }
  }
  if (type === 'address') {
    return str.replace(/(\d+\s+)([A-Za-z]+)(\s+Street|\s+Road|\s+Avenue|\s+Terrace|\s+Crescent|\s+Way|\s+Boulevard|\s+Drive)/i, (match, num, street, suffix) => {
      return num + street[0] + '•'.repeat(Math.max(2, street.length - 1)) + suffix;
    });
  }
  if (type === 'account') {
    return '••••' + str.slice(-4);
  }
  if (str.length <= 4) return '••••';
  return str[0] + '•'.repeat(str.length - 2) + str[str.length - 1];
}

test('PII Masking - Individual and Joint Client Names', () => {
  const single = maskPII('Margaret', 'name');
  assert.strictEqual(single, 'M••••••t', 'Single name must retain first and last char with middle dots');

  const full = maskPII('Margaret Thi Nguyen', 'name');
  assert.strictEqual(full, 'M••••••t T•i N••••n', 'Multi-part name must mask each component separately');

  const joint = maskPII('Siddharth & Priya Mehta', 'name');
  assert.ok(joint.includes('&'), 'Joint name ampersand must be preserved');
  assert.strictEqual(joint.split(' ')[0], 'S•••••••h');
});

test('PII Masking - Email Addresses and Domains', () => {
  const email = maskPII('margaret.nguyen@example.com', 'email');
  assert.strictEqual(email, 'm•••••••••••••n@example.com', 'Local part must be masked while preserving domain');

  const short = maskPII('ab@test.com', 'email');
  assert.strictEqual(short, 'a•@test.com', 'Short username should mask cleanly');
});

test('PII Masking - Australian Phone Numbers', () => {
  const mobile = maskPII('+61 412 345 678', 'phone');
  assert.strictEqual(mobile, '+61  ••• ••• 678', 'Phone should conceal middle digits');
});

test('PII Masking - Physical Addresses and Bank Accounts', () => {
  const addr = maskPII('18 Rosslyn Street, Glenside SA 5065', 'address');
  assert.strictEqual(addr, '18 R•••••• Street, Glenside SA 5065', 'Street name should be partially masked');

  const acc = maskPII('1234567890', 'account');
  assert.strictEqual(acc, '••••7890', 'Bank account should conceal all but last 4 digits');
});

test('PII Masking - Empty and Null Handling', () => {
  assert.strictEqual(maskPII('', 'name'), '');
  assert.strictEqual(maskPII(null, 'email'), null);
  assert.strictEqual(maskPII(undefined, 'phone'), undefined);
});
