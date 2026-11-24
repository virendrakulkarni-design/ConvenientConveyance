const test = require('node:test');
const assert = require('node:assert');

// South Australian Stamp Duty Calculator (Section 14B June 2024 Amendment)
function calculateSouthAustraliaStampDuty(purchasePrice, isFirstHomeBuyer) {
  if (purchasePrice <= 0) return { duty: 0, relief: 0, netPayable: 0 };

  // Standard statutory ad valorem stamp duty calculation (SA Stamp Duties Act 1923)
  let standardDuty = 0;
  if (purchasePrice <= 12000) {
    standardDuty = (purchasePrice / 100) * 1.00;
  } else if (purchasePrice <= 30000) {
    standardDuty = 120 + ((purchasePrice - 12000) / 100) * 2.00;
  } else if (purchasePrice <= 50000) {
    standardDuty = 480 + ((purchasePrice - 30000) / 100) * 3.00;
  } else if (purchasePrice <= 100000) {
    standardDuty = 1080 + ((purchasePrice - 50000) / 100) * 3.50;
  } else if (purchasePrice <= 200000) {
    standardDuty = 2830 + ((purchasePrice - 100000) / 100) * 4.00;
  } else if (purchasePrice <= 250000) {
    standardDuty = 6830 + ((purchasePrice - 200000) / 100) * 4.25;
  } else if (purchasePrice <= 300000) {
    standardDuty = 8955 + ((purchasePrice - 250000) / 100) * 4.75;
  } else if (purchasePrice <= 500000) {
    standardDuty = 11330 + ((purchasePrice - 300000) / 100) * 5.00;
  } else {
    standardDuty = 21330 + ((purchasePrice - 500000) / 100) * 5.50;
  }

  if (!isFirstHomeBuyer) {
    return { duty: standardDuty, relief: 0, netPayable: standardDuty };
  }

  // June 2024 SA Amendment: Under $650,000 is 100% exempt
  if (purchasePrice <= 650000) {
    return { duty: standardDuty, relief: standardDuty, netPayable: 0 };
  }

  // Tiered relief up to $700,000
  if (purchasePrice <= 700000) {
    const reliefFraction = (700000 - purchasePrice) / 50000;
    const relief = standardDuty * reliefFraction;
    return { duty: standardDuty, relief: Math.round(relief * 100) / 100, netPayable: Math.round((standardDuty - relief) * 100) / 100 };
  }

  // Above $700,000: No first home buyer relief
  return { duty: standardDuty, relief: 0, netPayable: standardDuty };
}

test('SA Stamp Duty - First Home Buyer Full Exemption under $650k', () => {
  const result = calculateSouthAustraliaStampDuty(600000, true);
  assert.strictEqual(result.netPayable, 0, 'First home buyer under $650k must pay $0 stamp duty');
  assert.strictEqual(result.relief, result.duty, 'Relief amount must equal full standard duty');
});

test('SA Stamp Duty - First Home Buyer Tiered Relief ($680k purchase)', () => {
  const result = calculateSouthAustraliaStampDuty(680000, true);
  // Standard duty for $680,000: 21330 + (180000/100 * 5.5) = 21330 + 9900 = 31230
  // Tiered factor = (700000 - 680000) / 50000 = 20000/50000 = 0.40
  // Relief = 31230 * 0.40 = 12492
  assert.strictEqual(result.duty, 31230, 'Standard duty for $680k is $31,230');
  assert.strictEqual(result.relief, 12492, 'Tiered relief for $680k is $12,492 (40%)');
  assert.strictEqual(result.netPayable, 31230 - 12492, 'Net payable must reflect $12,492 deduction');
});

test('SA Stamp Duty - Standard Non-FHB Property ($1,250,000 purchase)', () => {
  const result = calculateSouthAustraliaStampDuty(1250000, false);
  // 21330 + (750000/100 * 5.5) = 21330 + 41250 = 62580
  assert.strictEqual(result.duty, 62580, 'Standard duty for $1.25m is $62,580');
  assert.strictEqual(result.relief, 0, 'No relief for non-FHB');
  assert.strictEqual(result.netPayable, 62580, 'Full duty payable');
});
