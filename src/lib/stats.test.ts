import { test, describe } from 'node:test';
import assert from 'node:assert';
import { mean } from './stats.ts';

describe('mean', () => {
  test('should return 0 for an empty array', () => {
    assert.strictEqual(mean([]), 0);
  });

  test('should return 0 for a single zero value', () => {
    assert.strictEqual(mean([0]), 0);
  });

  test('should return the value for a single positive value', () => {
    assert.strictEqual(mean([5]), 5);
  });

  test('should return the value for a single negative value', () => {
    assert.strictEqual(mean([-5]), -5);
  });

  test('should return the correct mean for multiple positive values', () => {
    assert.strictEqual(mean([1, 2, 3]), 2);
  });

  test('should return the correct mean for multiple negative values', () => {
    assert.strictEqual(mean([-1, -2, -3]), -2);
  });

  test('should return 0 for symmetric positive and negative values', () => {
    assert.strictEqual(mean([-1, 1]), 0);
    assert.strictEqual(mean([-10, 10]), 0);
  });

  test('should handle floating point precision correctly', () => {
    // 0.1 + 0.2 is famously 0.30000000000000004 in JS, so the mean is ~0.15000000000000002
    // We expect the result to be close to 0.15
    const result = mean([0.1, 0.2]);
    assert.ok(Math.abs(result - 0.15) < 1e-10, `Expected result to be close to 0.15, but got ${result}`);
  });

  test('should handle arrays with large numbers', () => {
    const largeNumber = 1e10;
    assert.strictEqual(mean([largeNumber, largeNumber, largeNumber]), largeNumber);
  });
});
