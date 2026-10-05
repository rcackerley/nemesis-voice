// Simple Node tests for the timing planner and normalization
import { computeDelays, normalizeWord } from '../timingPlanner.js';

function assertEqualArrays(a, b, label) {
  const as = JSON.stringify(a);
  const bs = JSON.stringify(b);
  if (as !== bs) {
    console.error(`[FAIL] ${label}\n expected: ${bs}\n   actual: ${as}`);
    process.exitCode = 1;
  } else {
    console.log(`[OK] ${label}`);
  }
}

function run() {
  // Test 1: exact 5s gaps
  const base = 1000;
  const times1 = [0, 5000, 10000, 15000, 20000].map(t => base + t);
  const delays1 = computeDelays(times1);
  assertEqualArrays(delays1, [0, 5000, 5000, 5000, 5000], 'computeDelays preserves 5s gaps');

  // Test 2: mixed gaps, including a small and a large one
  const times2 = [0, 4900, 10100, 15150, 20100].map(t => base + t);
  const delays2 = computeDelays(times2);
  assertEqualArrays(delays2, [0, 4900, 5200, 5050, 4950], 'computeDelays handles mixed deltas');

  // Test 3: clamping
  const times3 = [0, 50, 40000].map(t => base + t);
  const delays3 = computeDelays(times3, { clampMinMs: 150, clampMaxMs: 20000 });
  assertEqualArrays(delays3, [0, 150, 20000], 'computeDelays clamps min/max');

  // Normalization tests
  const n1 = normalizeWord('Red');
  const n2 = normalizeWord('violet');
  const n3 = normalizeWord('X');
  const n4 = normalizeWord('Red triangle');
  const n5 = normalizeWord('Skulls'); // plural to singular
  const n6 = normalizeWord('crimson'); // unknown -> same
  assertEqualArrays([n1, n2, n3, n4, n5, n6], ['red', 'purple', 'cross', 'red triangle', 'skull', 'crimson'], 'normalizeWord basic cases');
}

run();
if (process.exitCode !== 1) {
  console.log('All timing planner tests passed.');
}

