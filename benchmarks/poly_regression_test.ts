import { multiply, inv, transpose, Matrix, matrix, mean as mathMean, std, sum } from 'mathjs';

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return mathMean(values) as number;
}

function polynomialRegression(x: number[], y: number[], degree: number) {
  const n = x.length;
  if (n <= degree) return null;

  const Y = matrix(y).resize([n, 1]);
  const X_cols = Array.from({ length: degree + 1 }, (_, p) => x.map(xi => xi ** p));
  const X = transpose(matrix(X_cols));

  const XT = transpose(X);
  const XTX = multiply(XT, X);
  const covMatrix = inv(XTX);
  const XTY = multiply(XT, Y);
  const coeffsMatrix = multiply(covMatrix, XTY) as Matrix;

  const coeffs = coeffsMatrix.toArray().flat() as number[];
  const y_pred_for_residuals = x.map(xi => sum(coeffs.map((c, p) => c * (xi ** p))) as number);
  const residuals = y.map((yi, i) => yi - y_pred_for_residuals[i]);

  const ss_res = sum(residuals.map(r => r**2)) as number;
  const y_mean = mean(y);
  const ss_tot = sum(y.map(yi => (yi - y_mean)**2)) as number;

  const R2 = ss_tot > 0 ? 1 - (ss_res / ss_tot) : 1;

  const sigma_coeffs = Array.from({ length: degree + 1 }, (_, i) => Math.sqrt((covMatrix.get([i, i]) as number) * (ss_res / (n - (degree + 1)))));

  return { coeffs, sigma_coeffs, R2 };
}

function polynomialRegressionFast(x: number[], y: number[], degree: number) {
  const n = x.length;
  if (n <= degree) return null;

  const Y = matrix(y).resize([n, 1]);
  const X_cols = Array.from({ length: degree + 1 }, (_, p) => x.map(xi => xi ** p));
  const X = transpose(matrix(X_cols));

  const XT = transpose(X);
  const XTX = multiply(XT, X);
  const covMatrix = inv(XTX);
  const XTY = multiply(XT, Y);
  const coeffsMatrix = multiply(covMatrix, XTY) as Matrix;

  const coeffs = coeffsMatrix.toArray().flat() as number[];

  let ss_res = 0;
  let ss_tot = 0;
  let sum_y = 0;

  for (let i = 0; i < n; i++) {
    sum_y += y[i];
  }
  const y_mean = sum_y / n;

  for (let i = 0; i < n; i++) {
    const xi = x[i];
    const yi = y[i];

    let y_pred = 0;
    // We compute polynomial value manually or using horner's method
    let current_term = 1;
    for (let p = 0; p <= degree; p++) {
      y_pred += coeffs[p] * current_term;
      current_term *= xi;
    }

    const r = yi - y_pred;
    ss_res += r * r;
    const d_tot = yi - y_mean;
    ss_tot += d_tot * d_tot;
  }

  const R2 = ss_tot > 0 ? 1 - (ss_res / ss_tot) : 1;

  const sigma_coeffs = Array.from({ length: degree + 1 }, (_, i) => Math.sqrt((covMatrix.get([i, i]) as number) * (ss_res / (n - (degree + 1)))));

  return { coeffs, sigma_coeffs, R2 };
}

const size = 10000;
const x = new Array(size).fill(0).map((_, i) => i);
const y = new Array(size).fill(0).map((_, i) => i * i + 2 * i + 1 + Math.random() * 10);
const degree = 2;

for (let i = 0; i < 10; i++) polynomialRegression(x, y, degree);
const start = performance.now();
for (let i = 0; i < 50; i++) polynomialRegression(x, y, degree);
const end = performance.now();
console.log(`Original: ${(end - start) / 50} ms`);

for (let i = 0; i < 10; i++) polynomialRegressionFast(x, y, degree);
const startFast = performance.now();
for (let i = 0; i < 50; i++) polynomialRegressionFast(x, y, degree);
const endFast = performance.now();
console.log(`Fast: ${(endFast - startFast) / 50} ms`);

const r1 = polynomialRegression(x, y, degree);
const r2 = polynomialRegressionFast(x, y, degree);
if (r1 && r2) {
  console.log("Difference in R2:", Math.abs(r1.R2 - r2.R2));
}
