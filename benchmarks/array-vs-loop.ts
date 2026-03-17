export {};
const size = 10000;
const x = Array.from({ length: size }, (_, i) => i);
const y = Array.from({ length: size }, (_, i) => i * 2.5 + 1.5 + (Math.random() - 0.5));
const sigma_y = Array.from({ length: size }, () => 0.1);
const slope = 2.5;
const intercept = 1.5;

console.time('arrays');
for(let k=0; k<1000; k++) {
    const y_pred = x.map(xi => slope * xi + intercept);
    const residuals = y.map((yi, i) => yi - y_pred[i]);
    const y_mean = y.reduce((a, b) => a + b, 0) / y.length;
    const ss_tot = y.map(yi => (yi - y_mean)**2).reduce((a,b)=>a+b, 0);
    const ss_res = residuals.map(r => r**2).reduce((a,b)=>a+b, 0);
    let chi2 = null;
    if(sigma_y && sigma_y.some(s => s && s>0)) {
      chi2 = residuals.map((r, i) => (sigma_y[i] && sigma_y[i]! > 0 ? (r / sigma_y[i]!)**2 : 0)).reduce((a,b)=>a+b, 0);
    }
}
console.timeEnd('arrays');

console.time('loop');
for(let k=0; k<1000; k++) {
    const n = x.length;

    let sum_y = 0;
    for (let i = 0; i < n; i++) sum_y += y[i];
    const y_mean = sum_y / n;

    let ss_res = 0;
    let ss_tot = 0;
    let chi2: number | null = null;
    let has_sigma = false;

    if (sigma_y) {
      for (let i = 0; i < n; i++) {
        if (sigma_y[i] && sigma_y[i]! > 0) {
          has_sigma = true;
          chi2 = 0;
          break;
        }
      }
    }

    for (let i = 0; i < n; i++) {
        const y_pred_i = slope * x[i] + intercept;
        const r = y[i] - y_pred_i;
        ss_res += r * r;

        const d_tot = y[i] - y_mean;
        ss_tot += d_tot * d_tot;

        if (has_sigma) {
            const sy = sigma_y[i];
            if (sy && sy > 0) {
                chi2! += (r / sy) * (r / sy);
            }
        }
    }
}
console.timeEnd('loop');
