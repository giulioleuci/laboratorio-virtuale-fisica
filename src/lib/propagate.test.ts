import { test, describe } from 'node:test';
import assert from 'node:assert';
import { propagateError, calculateAndPropagate } from './propagate.ts';

describe('propagateError', () => {
  test('should calculate error for a single variable', () => {
    const partials = {
      x: () => 1,
    };
    const values = { x: 10 };
    const sigmas = { x: 0.1 };
    const result = propagateError(partials, values, sigmas);
    assert.strictEqual(result, 0.1);
  });

  test('should calculate error for multiple variables', () => {
    // f(x, y) = x + y
    // df/dx = 1, df/dy = 1
    // sigma = sqrt((1*sx)^2 + (1*sy)^2)
    const partials = {
      x: () => 1,
      y: () => 1,
    };
    const values = { x: 10, y: 20 };
    const sigmas = { x: 0.3, y: 0.4 };
    const result = propagateError(partials, values, sigmas);
    assert.strictEqual(result, 0.5); // sqrt(0.3^2 + 0.4^2) = sqrt(0.09 + 0.16) = sqrt(0.25) = 0.5
  });

  test('should handle missing keys in values or sigmas', () => {
    const partials = {
      x: () => 1,
      y: () => 1,
    };
    const values = { x: 10 } as any;
    const sigmas = { x: 0.1, y: 0.2 };
    const result = propagateError(partials, values, sigmas);
    assert.strictEqual(result, 0.1); // Only x should be counted
  });

  test('should handle non-finite values in partials or sigmas', () => {
    const partials = {
      x: () => Infinity,
      y: () => 1,
      z: () => 1,
    };
    const values = { x: 10, y: 20, z: 30 };
    const sigmas = { x: 0.1, y: 0.2, z: Infinity };
    const result = propagateError(partials, values, sigmas);
    assert.strictEqual(result, 0.2); // Only y should be counted (x partial is Inf, z sigma is Inf)
  });

  test('should handle zero sigma', () => {
    const partials = {
      x: () => 10,
    };
    const values = { x: 10 };
    const sigmas = { x: 0 };
    const result = propagateError(partials, values, sigmas);
    assert.strictEqual(result, 0);
  });
});

describe('calculateAndPropagate', () => {
  test('should calculate addition: x + y', () => {
    const formula = 'x + y';
    const variables = {
      x: { value: 10, sigma: 0.3 },
      y: { value: 20, sigma: 0.4 },
    };
    const result = calculateAndPropagate(formula, variables);
    assert.ok(result);
    assert.strictEqual(result.value, 30);
    assert.strictEqual(result.sigma, 0.5);
  });

  test('should calculate multiplication: x * y', () => {
    const formula = 'x * y';
    const variables = {
      x: { value: 10, sigma: 0.1 },
      y: { value: 20, sigma: 0.2 },
    };
    // df/dx = y = 20
    // df/dy = x = 10
    // sigma = sqrt((20 * 0.1)^2 + (10 * 0.2)^2) = sqrt(2^2 + 2^2) = sqrt(8)
    const result = calculateAndPropagate(formula, variables);
    assert.ok(result);
    assert.strictEqual(result.value, 200);
    assert.strictEqual(result.sigma, Math.sqrt(8));
  });

  test('should calculate power: x^2', () => {
    const formula = 'x^2';
    const variables = {
      x: { value: 3, sigma: 0.1 },
    };
    // df/dx = 2x = 6
    // sigma = 6 * 0.1 = 0.6
    const result = calculateAndPropagate(formula, variables);
    assert.ok(result);
    assert.strictEqual(result.value, 9);
    // 6 * 0.1 might be 0.6000000000000001
    assert.ok(Math.abs(result.sigma - 0.6) < 1e-15);
  });

  test('should throw error for invalid formula', () => {
    const formula = 'x +';
    const variables = {
      x: { value: 10, sigma: 0.1 },
    };
    assert.throws(() => {
      calculateAndPropagate(formula, variables);
    }, /Error in calculation and propagation/);
  });
});
