import { polynomialRegression } from '../src/lib/stats.ts';

const size = 10000;
const x = new Array(size).fill(0).map((_, i) => i);
const y = new Array(size).fill(0).map((_, i) => i * i + 2 * i + 1 + Math.random() * 10);
const degree = 2;

// warmup
for (let i = 0; i < 10; i++) {
    polynomialRegression(x, y, degree);
}

const iterations = 50;
const start = performance.now();
for (let i = 0; i < iterations; i++) {
    polynomialRegression(x, y, degree);
}
const end = performance.now();

console.log(`Average time per iteration: ${(end - start) / iterations} ms`);
