import { linearRegression } from '../src/lib/stats.ts';

const size = 500;
const x = Array.from({ length: size }, (_, i) => i);
const y = Array.from({ length: size }, (_, i) => i * 2.5 + 1.5 + (Math.random() - 0.5));
const sigma_y = Array.from({ length: size }, () => 0.1);

console.time('linearRegression');
for (let i = 0; i < 1000; i++) {
  linearRegression(x, y, sigma_y);
}
console.timeEnd('linearRegression');
