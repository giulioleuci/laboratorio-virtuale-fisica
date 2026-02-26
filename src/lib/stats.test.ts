import { test, describe } from 'node:test';
import assert from 'node:assert';
import { sampleStdDev } from './stats.ts';

describe('sampleStdDev', () => {
  test('should return 0 for empty array', () => {
    assert.strictEqual(sampleStdDev([]), 0);
  });

  test('should return 0 for single element array', () => {
    assert.strictEqual(sampleStdDev([5]), 0);
  });

  test('should calculate correct standard deviation for multiple elements', () => {
    // values: [2, 4, 4, 4, 5, 5, 7, 9]
    // mean: 40/8 = 5
    // variance: ((2-5)^2 + 3*(4-5)^2 + 2*(5-5)^2 + (7-5)^2 + (9-5)^2) / (8-1)
    // = (9 + 3 + 0 + 4 + 16) / 7
    // = 32 / 7 approx 4.571428571428571
    // std dev: sqrt(32/7) approx 2.138089935299395
    const values = [2, 4, 4, 4, 5, 5, 7, 9];
    const result = sampleStdDev(values);
    // tolerance of 1e-10
    assert.ok(Math.abs(result - 2.138089935299395) < 1e-10, `Expected close to 2.138089935299395 but got ${result}`);
  });

  test('should calculate correct standard deviation for simple case', () => {
    // values: [1, 2, 3]
    // mean: 2
    // variance: ((1-2)^2 + (2-2)^2 + (3-2)^2) / 2 = 1
    // std dev: 1
    assert.strictEqual(sampleStdDev([1, 2, 3]), 1);
  });

  test('should return 0 for identical elements', () => {
      // values: [10, 10, 10]
      // mean: 10
      // variance: 0
      // std dev: 0
      assert.strictEqual(sampleStdDev([10, 10, 10]), 0);
  });

  test('should handle negative numbers', () => {
    // [-1, 1]
    // mean: 0
    // variance: ((-1-0)^2 + (1-0)^2) / (2-1) = 2
    // std dev: sqrt(2)
    const result = sampleStdDev([-1, 1]);
    const expected = Math.sqrt(2);
    assert.ok(Math.abs(result - expected) < 1e-10, `Expected close to ${expected} but got ${result}`);
  });

  test('should handle large numbers', () => {
      // values: [1000000, 1000002]
      // mean: 1000001
      // variance: ((1000000-1000001)^2 + (1000002-1000001)^2) / 1 = 1 + 1 = 2
      // std dev: sqrt(2)
      const result = sampleStdDev([1000000, 1000002]);
      const expected = Math.sqrt(2);
      assert.ok(Math.abs(result - expected) < 1e-10, `Expected close to ${expected} but got ${result}`);
  });
});
