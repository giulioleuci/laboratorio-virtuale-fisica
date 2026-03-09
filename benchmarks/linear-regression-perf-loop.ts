import { mean, matrix, transpose, multiply, inv, Matrix } from 'mathjs';

const size = 1000;
const x = Array.from({ length: size }, (_, i) => i);
const y = Array.from({ length: size }, (_, i) => i * 2.5 + 1.5 + (Math.random() - 0.5));
const sigma_y = Array.from({ length: size }, () => 0.1);

function meanLocal(values: number[]): number {
  if (values.length === 0) return 0;
  return mean(values) as number;
}

function linearRegressionNew(x: number[], y: number[], sigma_y: (number | null | undefined)[] | null = null) {
  const n = x.length;
  if (n < 2) return null;

  const Y = matrix(y).resize([n, 1]);
  const X_cols = [Array(n).fill(1), x];
  const X = transpose(matrix(X_cols));

  const W_vals = sigma_y ? sigma_y.map(s => s && s > 0 ? 1 / (s * s) : 1) : Array(n).fill(1);
  const W = matrix(Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => i === j ? W_vals[i] : 0)));

  const XT = transpose(X);
  const XTW = multiply(XT, W);
  const XTWX = multiply(XTW, X);
  const covMatrix = inv(XTWX);
  const XTWY = multiply(XTW, Y);
  const coeffs = multiply(covMatrix, XTWY) as Matrix;

  const [intercept, slope] = coeffs.toArray().flat() as number[];
  const sigma_intercept = Math.sqrt(covMatrix.get([0, 0]) as number);
  const sigma_slope = Math.sqrt(covMatrix.get([1, 1]) as number);

  // OPTIMIZED PART
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
      const sy = sigma_y![i];
      if (sy && sy > 0) {
        chi2! += (r / sy) * (r / sy);
      }
    }
  }

  const R2 = ss_tot > 0 ? 1 - (ss_res / ss_tot) : 1;

  return { slope, intercept, sigma_slope, sigma_intercept, R2, chi2_reduced: chi2 && (n-2 > 0) ? chi2 / (n - 2) : null };
}

console.time('linearRegression new');
for (let i = 0; i < 50; i++) {
  linearRegressionNew(x, y, sigma_y);
}
console.timeEnd('linearRegression new');
