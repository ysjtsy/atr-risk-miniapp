const assert = require('assert');
const { calcATR } = require('../utils/atr');
const { calcPositionSize } = require('../utils/risk');

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

test('calcATR returns average true range over requested period', () => {
  const candles = [
    { high: 100, low: 95, close: 98 },
    { high: 105, low: 99, close: 100 },
    { high: 107, low: 102, close: 103 },
    { high: 110, low: 104, close: 105 }
  ];

  const atr = calcATR(candles, 2);
  assert.strictEqual(atr, 7);
});

test('calcPositionSize respects risk-based sizing when within leverage', () => {
  const result = calcPositionSize({
    equity: 1000,
    riskPercent: 1,
    leverage: 3,
    entryPrice: 100,
    stopLossPrice: 95
  });

  assert.ok(result, 'Expected a result object');
  assert.strictEqual(result.riskAmount, 10);
  assert.strictEqual(result.finalNotional, 200);
  assert.strictEqual(result.qty, 2);
});

test('calcPositionSize caps notional by leverage limit', () => {
  const result = calcPositionSize({
    equity: 500,
    riskPercent: 5,
    leverage: 2,
    entryPrice: 100,
    stopLossPrice: 99
  });

  assert.ok(result, 'Expected a result object');
  assert.strictEqual(result.maxNotionalByLev, 1000);
  assert.strictEqual(result.finalNotional, result.maxNotionalByLev);
  assert.strictEqual(result.qty, result.finalNotional / 100);
});

let failed = 0;
for (const { name, fn } of tests) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`✗ ${name}`);
    console.error(err.message);
  }
}

if (failed > 0) {
  process.exitCode = 1;
  console.error(`\n${failed} test(s) failed.`);
} else {
  console.log(`\n${tests.length} test(s) passed.`);
}
