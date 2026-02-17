
import { multiply, inv, transpose, Matrix, matrix, mean as mathMean, std, sum } from 'mathjs';
import { levenbergMarquardt } from 'ml-levenberg-marquardt';

export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return mathMean(values);
}

export function weightedMean(values: number[], sigmas: (number | null | undefined)[]): { wMean: number; sigmaWMean: number } {
  if (values.length === 0) return { wMean: 0, sigmaWMean: 0 };

  const validIndices = values.map((v, i) => v !== null && v !== undefined && isFinite(v) && (!sigmas[i] || (sigmas[i] !== null && sigmas[i] !== undefined && isFinite(sigmas[i]!)))).map((valid, i) => valid ? i : -1).filter(i => i !== -1);
  if (validIndices.length === 0) return { wMean: 0, sigmaWMean: 0 };
  
  const filteredValues = validIndices.map(i => values[i]);
  const filteredSigmas = validIndices.map(i => sigmas[i]);

  const hasValidSigmas = filteredSigmas.some(s => s && s > 0);

  if (!hasValidSigmas) {
    const simpleMean = mean(filteredValues);
    const simpleStdErr = stdErrMean(filteredValues);
    return { wMean: simpleMean, sigmaWMean: simpleStdErr };
  }
  
  const weights = filteredSigmas.map(s => (s && s > 0 ? 1 / (s * s) : 0));
  const sumOfWeights = sum(weights);

  if (sumOfWeights === 0) { // Fallback if all weights are zero
    const simpleMean = mean(filteredValues);
    const simpleStdErr = stdErrMean(filteredValues);
    return { wMean: simpleMean, sigmaWMean: simpleStdErr };
  }

  const weightedSum = sum(filteredValues.map((v, i) => v * weights[i]));
  const wMean = weightedSum / sumOfWeights;
  const sigmaWMean = Math.sqrt(1 / sumOfWeights);

  return { wMean, sigmaWMean };
}

export function sampleStdDev(values: number[]): number {
  if (values.length < 2) return 0;
  return std(values, 'unbiased');
}

export function stdErrMean(values: number[]): number {
  const filteredValues = values.filter(v => v !== null && v !== undefined && isFinite(v));
  if (filteredValues.length < 2) return 0;
  return sampleStdDev(filteredValues) / Math.sqrt(filteredValues.length);
}

export interface LinearRegressionResult {
  slope: number;
  intercept: number;
  sigma_slope: number;
  sigma_intercept: number;
  R2: number;
  chi2_reduced: number | null;
}

export function linearRegression(x: number[], y: number[], sigma_y: (number | null | undefined)[] | null = null, forceInterceptZero = false): LinearRegressionResult | null {
  const n = x.length;
  if (n < 2) return null;

  if (forceInterceptZero) {
    let sum_xy_w = 0;
    let sum_x2_w = 0;
    
    const weights = sigma_y ? sigma_y.map(s => s && s > 0 ? 1 / (s*s) : 1) : Array(n).fill(1);
    
    for (let i = 0; i < n; i++) {
        sum_xy_w += weights[i] * x[i] * y[i];
        sum_x2_w += weights[i] * x[i] * x[i];
    }

    if (sum_x2_w === 0) return null;
    const slope = sum_xy_w / sum_x2_w;
    const sigma_slope = Math.sqrt(1 / sum_x2_w);
    
    const y_pred = x.map(xi => slope * xi);
    const residuals = y.map((yi, i) => yi - y_pred[i]);
    const y_mean = mean(y);
    const ss_tot = sum(y.map(yi => (yi - y_mean)**2));
    const ss_res = sum(residuals.map(r => r**2));
    const R2 = ss_tot > 0 ? 1 - ss_res / ss_tot : 1;

    let chi2 = null;
    if(sigma_y && sigma_y.some(s => s && s>0)) {
      chi2 = sum(residuals.map((r, i) => (sigma_y[i] && sigma_y[i]! > 0 ? (r / sigma_y[i]!)**2 : 0)));
    }

    return { slope, intercept: 0, sigma_slope, sigma_intercept: 0, R2, chi2_reduced: chi2 ? chi2 / (n - 1) : null };
  }

  const Y = matrix(y).resize([n, 1]);
  const X_cols = [Array(n).fill(1), x];
  const X = transpose(matrix(X_cols));

  const W_vals = sigma_y ? sigma_y.map(s => s && s > 0 ? 1 / (s * s) : 1) : Array(n).fill(1);
  const W = matrix(Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => i === j ? W_vals[i] : 0)));

  try {
    const XT = transpose(X);
    const XTW = multiply(XT, W);
    const XTWX = multiply(XTW, X);
    const covMatrix = inv(XTWX);
    const XTWY = multiply(XTW, Y);
    const coeffs = multiply(covMatrix, XTWY) as Matrix;

    const [intercept, slope] = coeffs.toArray().flat();
    const sigma_intercept = Math.sqrt(covMatrix.get([0, 0]));
    const sigma_slope = Math.sqrt(covMatrix.get([1, 1]));

    const y_pred = x.map(xi => slope * xi + intercept);
    const residuals = y.map((yi, i) => yi - y_pred[i]);
    const y_mean = mean(y);
    const ss_tot = sum(y.map(yi => (yi - y_mean)**2));
    const ss_res = sum(residuals.map(r => r**2));
    const R2 = ss_tot > 0 ? 1 - (ss_res / ss_tot) : 1;
    
    let chi2 = null;
    if(sigma_y && sigma_y.some(s => s && s>0)) {
      chi2 = sum(residuals.map((r, i) => (sigma_y[i] && sigma_y[i]! > 0 ? (r / sigma_y[i]!)**2 : 0)));
    }

    return { slope, intercept, sigma_slope, sigma_intercept, R2, chi2_reduced: chi2 && (n-2 > 0) ? chi2 / (n - 2) : null };
  } catch (e) {
    throw new Error(`Linear regression failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export interface PolyRegressionResult {
  coeffs: number[];
  sigma_coeffs: number[];
  R2: number;
}

export function polynomialRegression(x: number[], y: number[], degree: number): PolyRegressionResult | null {
  const n = x.length;
  if (n <= degree) return null;

  const Y = matrix(y).resize([n, 1]);
  const X_cols = Array.from({ length: degree + 1 }, (_, p) => x.map(xi => xi ** p));
  const X = transpose(matrix(X_cols));

  try {
    const XT = transpose(X);
    const XTX = multiply(XT, X);
    const covMatrix = inv(XTX);
    const XTY = multiply(XT, Y);
    const coeffsMatrix = multiply(covMatrix, XTY) as Matrix;

    const coeffs = coeffsMatrix.toArray().flat();
    const y_pred_for_residuals = x.map(xi => sum(coeffs.map((c, p) => c * (xi ** p))));
    const residuals = y.map((yi, i) => yi - y_pred_for_residuals[i]);
    
    const ss_res = sum(residuals.map(r => r**2));
    const y_mean = mean(y);
    const ss_tot = sum(y.map(yi => (yi - y_mean)**2));
    
    const R2 = ss_tot > 0 ? 1 - (ss_res / ss_tot) : 1;

    // Simplified sigma calculation from diagonal of covariance matrix
    const sigma_coeffs = Array.from({ length: degree + 1 }, (_, i) => Math.sqrt(covMatrix.get([i, i]) * (ss_res / (n - (degree + 1)))));

    return { coeffs, sigma_coeffs, R2 };
  } catch (e) {
    throw new Error(`Polynomial regression failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export const G_CONST = 9.80665;

export interface ExponentialRegressionResult {
  a: number;
  b: number;
  sigma_a: number;
  sigma_b: number;
  R2: number;
}

export function exponentialRegression(x: number[], y: number[], sigma_y: (number | null | undefined)[] | null = null): ExponentialRegressionResult | null {
  const n = x.length;
  if (n < 2) return null;

  const y_log = y.map(yi => Math.log(yi));
  const sigma_y_log = sigma_y ? sigma_y.map((s, i) => s ? s / y[i] : null) : null;

  const linearFit = linearRegression(x, y_log, sigma_y_log);
  if (!linearFit) return null;

  const a = Math.exp(linearFit.intercept);
  const b = linearFit.slope;
  const sigma_a = a * linearFit.sigma_intercept;
  const sigma_b = linearFit.sigma_slope;
  const R2 = linearFit.R2;

  return { a, b, sigma_a, sigma_b, R2 };
}

export interface RationalRegressionResult {
  coeffs: number[];
  R2: number;
}

export function rationalRegression(x: number[], y: number[]): RationalRegressionResult | null {
  const n = x.length;
  if (n < 4) return null;

  const fn = ([a, b, c, d]: number[]) => (t: number) => (a * t + b) / (c * t + d);
  const initialValues = [1, 1, 1, 1];
  const data = { x, y };

  try {
    const result = levenbergMarquardt(data, fn, { initialValues });
    const coeffs = result.parameterValues;
    const y_pred = x.map(fn(coeffs));
    const y_mean = mean(y);
    const ss_tot = sum(y.map((yi) => (yi - y_mean) ** 2));
    const ss_res = sum(y.map((yi, i) => (yi - y_pred[i]) ** 2));
    const R2 = ss_tot > 0 ? 1 - ss_res / ss_tot : 1;

    return { coeffs, R2 };
  } catch (e) {
    throw new Error(`Rational regression failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}
