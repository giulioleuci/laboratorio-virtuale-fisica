import { mean, sum } from 'mathjs';

const size = 10000;
const x = Array.from({ length: size }, (_, i) => i);
const y = Array.from({ length: size }, (_, i) => i * 2.5 + 1.5 + (Math.random() - 0.5));
const sigma_y = Array.from({ length: size }, () => 0.1);

console.time('mathjs ops');
for (let i = 0; i < 100; i++) {
    const slope = 2.5;
    const intercept = 1.5;

    const y_pred = x.map(xi => slope * xi + intercept);
    const residuals = y.map((yi, j) => yi - y_pred[j]);
    const y_mean = mean(y) as number;
    const ss_tot = sum(y.map(yi => (yi - y_mean)**2)) as number;
    const ss_res = sum(residuals.map(r => r**2)) as number;
    const R2 = ss_tot > 0 ? 1 - (ss_res / ss_tot) : 1;

    let chi2: number | null = null;
    if(sigma_y && sigma_y.some(s => s && s>0)) {
      chi2 = sum(residuals.map((r, j) => (sigma_y[j] && sigma_y[j]! > 0 ? (r / sigma_y[j]!)**2 : 0))) as number;
    }
}
console.timeEnd('mathjs ops');
