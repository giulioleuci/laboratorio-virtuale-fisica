import { calculateAndPropagate } from '../src/lib/propagate.ts';

const formula = 'x1 + x2 + x3 + x4 + x5 + x6 + x7 + x8 + x9 + x10';
const variables: { [key: string]: { value: number; sigma: number } } = {};
for (let i = 1; i <= 10; i++) {
  variables[`x${i}`] = { value: i, sigma: 0.1 * i };
}

// Warmup
for (let i = 0; i < 1000; i++) {
  calculateAndPropagate(formula, variables);
}

const iterations = 10000;
const start = performance.now();
for (let i = 0; i < iterations; i++) {
  calculateAndPropagate(formula, variables);
}
const end = performance.now();

console.log(`Average time per iteration (10 variables): ${(end - start) / iterations} ms`);

// Test with more variables to see the impact of O(n^2) object creation
const largeFormula = Array.from({ length: 100 }, (_, i) => `x${i}`).join(' + ');
const largeVariables: { [key: string]: { value: number; sigma: number } } = {};
for (let i = 0; i < 100; i++) {
  largeVariables[`x${i}`] = { value: i, sigma: 0.1 * i };
}

// Warmup
for (let i = 0; i < 100; i++) {
  calculateAndPropagate(largeFormula, largeVariables);
}

const largeIterations = 1000;
const startLarge = performance.now();
for (let i = 0; i < largeIterations; i++) {
  calculateAndPropagate(largeFormula, largeVariables);
}
const endLarge = performance.now();

console.log(`Average time per iteration (100 variables): ${(endLarge - startLarge) / largeIterations} ms`);
