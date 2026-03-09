import { rationalRegression } from '../src/lib/stats.ts';

const size = 10000;
const x = new Array(size).fill(0).map((_, i) => i);
const y = new Array(size).fill(0).map((_, i) => (2 * i + 1) / (3 * i + 2) + Math.random() * 0.1);

// warmup
for (let i = 0; i < 10; i++) {
    rationalRegression(x, y);
}

const iterations = 50;
const start = performance.now();
for (let i = 0; i < iterations; i++) {
    rationalRegression(x, y);
}
const end = performance.now();

console.log(`Average time per iteration: ${(end - start) / iterations} ms`);
