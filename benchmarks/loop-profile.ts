import { linearRegression } from '../src/lib/stats.ts';

const size = 10000;
const x = Array.from({ length: size }, (_, i) => i);
const y = Array.from({ length: size }, (_, i) => i * 2.5 + 1.5 + (Math.random() - 0.5));
const sigma_y = Array.from({ length: size }, () => 0.1);

console.time('baseline loop only');

for (let i = 0; i < 100; i++) {
    const slope = 2.5;
    const intercept = 1.5;

    // Original loop block we want to replace
    const y_pred = x.map(xi => slope * xi + intercept);
    const residuals = y.map((yi, i) => yi - y_pred[i]);
    const y_mean = y.reduce((a,b)=>a+b, 0) / y.length; // simulating mean(y)
    const ss_tot = y.map(yi => (yi - y_mean)**2).reduce((a,b)=>a+b, 0) as number;
    const ss_res = residuals.map(r => r**2).reduce((a,b)=>a+b, 0) as number;
    const R2 = ss_tot > 0 ? 1 - (ss_res / ss_tot) : 1;

    let chi2: number | null = null;
    if(sigma_y && sigma_y.some(s => s && s>0)) {
      chi2 = residuals.map((r, j) => (sigma_y[j] && sigma_y[j]! > 0 ? (r / sigma_y[j]!)**2 : 0)).reduce((a,b)=>a+b, 0) as number;
    }
}
console.timeEnd('baseline loop only');


console.time('optimized loop only');
for (let i = 0; i < 100; i++) {
    const n = x.length;
    const slope = 2.5;
    const intercept = 1.5;

    let sum_y = 0;
    for (let j = 0; j < n; j++) sum_y += y[j];
    const y_mean = sum_y / n;

    let ss_res = 0;
    let ss_tot = 0;
    let chi2: number | null = null;
    let has_sigma = false;

    if (sigma_y) {
      for (let j = 0; j < n; j++) {
        if (sigma_y[j] && sigma_y[j]! > 0) {
          has_sigma = true;
          chi2 = 0;
          break;
        }
      }
    }

    for (let j = 0; j < n; j++) {
        const y_pred_j = slope * x[j] + intercept;
        const r = y[j] - y_pred_j;
        ss_res += r * r;

        const d_tot = y[j] - y_mean;
        ss_tot += d_tot * d_tot;

        if (has_sigma) {
            const sy = sigma_y[j];
            if (sy && sy > 0) {
                chi2! += (r / sy) * (r / sy);
            }
        }
    }
    const R2 = ss_tot > 0 ? 1 - (ss_res / ss_tot) : 1;
}
console.timeEnd('optimized loop only');
