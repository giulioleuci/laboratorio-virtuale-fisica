import { test, describe } from 'node:test';
import assert from 'node:assert';
import { mean, weightedMean } from './stats.ts';

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

describe('weightedMean', () => {
  test('should return 0 for an empty array', () => {
    const result = weightedMean([], []);
    assert.strictEqual(result.wMean, 0);
    assert.strictEqual(result.sigmaWMean, 0);
  });

  test('should return the value and 0 sigma for a single value with no sigma', () => {
    const result = weightedMean([10], [null]);
    assert.strictEqual(result.wMean, 10);
    assert.strictEqual(result.sigmaWMean, 0);
  });

  test('should return the correct weighted mean for valid inputs', () => {
    // values: [10, 20], sigmas: [1, 2]
    // weights: [1/1^2, 1/2^2] = [1, 0.25]
    // sumOfWeights: 1.25
    // weightedSum: 10*1 + 20*0.25 = 10 + 5 = 15
    // wMean: 15 / 1.25 = 12
    // sigmaWMean: sqrt(1 / 1.25) = sqrt(0.8) approx 0.894427191
    const result = weightedMean([10, 20], [1, 2]);
    assert.strictEqual(result.wMean, 12);
    assert.ok(Math.abs(result.sigmaWMean - Math.sqrt(0.8)) < 1e-10);
  });

  test('should handle missing sigmas by falling back to regular mean', () => {
    // If no valid sigmas are provided, it should use regular mean and standard error
    const values = [10, 20, 30];
    const sigmas = [null, undefined, 0]; // 0 is not a valid sigma (>0 required)
    const result = weightedMean(values, sigmas);

    // Regular mean: (10+20+30)/3 = 20
    // Sample std dev of [10, 20, 30]: 10
    // Std error: 10 / sqrt(3) approx 5.773502692
    assert.strictEqual(result.wMean, 20);
    assert.ok(Math.abs(result.sigmaWMean - (10 / Math.sqrt(3))) < 1e-10);
  });

  test('should filter out invalid values', () => {
    const values = [10, NaN, Infinity, 20];
    const sigmas = [1, 1, 1, 1];
    const result = weightedMean(values, sigmas);

    // Only 10 and 20 are valid. With equal sigmas, mean is 15.
    // sumOfWeights: 1/1^2 + 1/1^2 = 2
    // weightedSum: 10*1 + 20*1 = 30
    // wMean: 15
    // sigmaWMean: sqrt(1/2) approx 0.707106781
    assert.strictEqual(result.wMean, 15);
    assert.ok(Math.abs(result.sigmaWMean - Math.sqrt(0.5)) < 1e-10);
  });

  test('should handle mixed valid/invalid sigmas', () => {
    const values = [10, 20, 30];
    const sigmas = [1, null, 1];
    const result = weightedMean(values, sigmas);

    // Only 10 and 30 have valid sigmas.
    // sumOfWeights: 1/1^2 + 1/1^2 = 2
    // weightedSum: 10*1 + 30*1 = 40
    // wMean: 20
    // sigmaWMean: sqrt(1/2) approx 0.707106781
    assert.strictEqual(result.wMean, 20);
    assert.ok(Math.abs(result.sigmaWMean - Math.sqrt(0.5)) < 1e-10);
  });

  test('should return 0 if all values are invalid', () => {
    const result = weightedMean([NaN, undefined!], [1, 1]);
    assert.strictEqual(result.wMean, 0);
    assert.strictEqual(result.sigmaWMean, 0);
  });

  test('should handle floating point precision', () => {
    const result = weightedMean([0.1, 0.2], [0.01, 0.01]);
    // Equal weights, should be 0.15
    assert.ok(Math.abs(result.wMean - 0.15) < 1e-10);
    // sigmaWMean: sqrt(1 / (1/0.01^2 + 1/0.01^2)) = sqrt(1 / (10000 + 10000)) = sqrt(1/20000)
    assert.ok(Math.abs(result.sigmaWMean - Math.sqrt(1/20000)) < 1e-10);
  });
});
