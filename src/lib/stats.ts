
import { multiply, inv, transpose, Matrix, matrix, diag, mean as mathMean, std, sum } from 'mathjs';
import { levenbergMarquardt } from 'ml-levenberg-marquardt';

export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return mathMean(values) as number;
}

export function weightedMean(values: number[], sigmas: (number | null | undefined)[]): { wMean: number; sigmaWMean: number } {
  const n = values.length;
  if (n === 0) return { wMean: 0, sigmaWMean: 0 };

  let sumOfWeights = 0;
  let weightedSum = 0;
  let hasValidSigmas = false;
  const filteredValues: number[] = [];

  for (let i = 0; i < n; i++) {
    const v = values[i];
    const s = sigmas[i];

    if (v !== null && v !== undefined && isFinite(v) && (!s || isFinite(s))) {
      filteredValues.push(v);
      if (s !== null && s !== undefined && s > 0) {
        const w = 1 / (s * s);
        sumOfWeights += w;
        weightedSum += v * w;
        hasValidSigmas = true;
      }
    }
  }

  if (filteredValues.length === 0) return { wMean: 0, sigmaWMean: 0 };

  if (!hasValidSigmas || sumOfWeights === 0) {
    return { wMean: mean(filteredValues), sigmaWMean: stdErrMean(filteredValues) };
  }

  return { wMean: weightedSum / sumOfWeights, sigmaWMean: Math.sqrt(1 / sumOfWeights) };
}

export function sampleStdDev(values: number[]): number {
  if (values.length < 2) return 0;
  return std(values, 'unbiased') as number;
}

export function stdErrMean(values: number[]): number {
  const filteredValues = values.filter(v => v !== null && v !== undefined && isFinite(v));
  if (filteredValues.length < 2) return 0;
  return sampleStdDev(filteredValues) / Math.sqrt(filteredValues.length);
}

export function calculateRegressionMetrics(y: number[], getPred: (i: number) => number, sigma_y: (number | null | undefined)[] | null = null): { R2: number; ss_res: number; chi2: number | null } {
  let ss_res = 0;
  let ss_tot = 0;
  let chi2: number | null = null;
  const y_mean = mean(y);
  const n = y.length;

  for (let i = 0; i < n; i++) {
    const r = y[i] - getPred(i);
    ss_res += r * r;

    const d_tot = y[i] - y_mean;
    ss_tot += d_tot * d_tot;

    if (sigma_y) {
      const sy = sigma_y[i];
      if (sy && sy > 0) {
        if (chi2 === null) chi2 = 0;
        chi2 += (r / sy) * (r / sy);
      }
    }
  }

  const R2 = ss_tot > 0 ? 1 - ss_res / ss_tot : 1;
  return { R2, ss_res, chi2 };
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

  const weights = sigma_y ? sigma_y.map(s => s && s > 0 ? 1 / (s * s) : 1) : null;

  if (forceInterceptZero) {
    let sum_xy_w = 0;
    let sum_x2_w = 0;
    
    for (let i = 0; i < n; i++) {
        const w = weights ? weights[i] : 1;
        sum_xy_w += w * x[i] * y[i];
        sum_x2_w += w * x[i] * x[i];
    }

    if (sum_x2_w === 0) return null;
    const slope = sum_xy_w / sum_x2_w;
    const sigma_slope = Math.sqrt(1 / sum_x2_w);
    
    const { R2, ss_res, chi2 } = calculateRegressionMetrics(y, i => slope * x[i], sigma_y);

    return { slope, intercept: 0, sigma_slope, sigma_intercept: 0, R2, chi2_reduced: chi2 !== null ? chi2 / (n - 1) : null };
  }

  const Y = matrix(y).resize([n, 1]);
  const X_cols = [Array(n).fill(1), x];
  const X = transpose(matrix(X_cols));

  try {
    const XT = transpose(X);
    let covMatrix: Matrix;
    let coeffs: Matrix;

    if (weights) {
      const W = (diag as any)(weights);
      const XTW = multiply(XT, W);
      const XTWX = multiply(XTW, X);
      covMatrix = inv(XTWX);
      const XTWY = multiply(XTW, Y);
      coeffs = multiply(covMatrix, XTWY) as Matrix;
    } else {
      const XTX = multiply(XT, X);
      covMatrix = inv(XTX);
      const XTY = multiply(XT, Y);
      coeffs = multiply(covMatrix, XTY) as Matrix;
    }

    const [intercept, slope] = coeffs.toArray().flat() as number[];
    const sigma_intercept = Math.sqrt(covMatrix.get([0, 0]) as number);
    const sigma_slope = Math.sqrt(covMatrix.get([1, 1]) as number);

    const { R2, ss_res, chi2 } = calculateRegressionMetrics(y, i => slope * x[i] + intercept, sigma_y);

    return { slope, intercept, sigma_slope, sigma_intercept, R2, chi2_reduced: chi2 !== null && (n - 2 > 0) ? chi2 / (n - 2) : null };
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

    const coeffs = coeffsMatrix.toArray().flat() as number[];

    const { R2, ss_res } = calculateRegressionMetrics(y, i => {
      let y_pred = 0;
      let current_term = 1;
      const xi = x[i];
      for (let p = 0; p <= degree; p++) {
        y_pred += coeffs[p] * current_term;
        current_term *= xi;
      }
      return y_pred;
    });

    // Simplified sigma calculation from diagonal of covariance matrix
    const sigma_coeffs = Array.from({ length: degree + 1 }, (_, i) => Math.sqrt((covMatrix.get([i, i]) as number) * (ss_res / (n - (degree + 1)))));

    return { coeffs, sigma_coeffs, R2 };
  } catch (e) {
    throw new Error(`Polynomial regression failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}

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

    const evalFn = fn(coeffs);
    const { R2 } = calculateRegressionMetrics(y, i => evalFn(x[i]));

    return { coeffs, R2 };
  } catch (e) {
    throw new Error(`Rational regression failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}
