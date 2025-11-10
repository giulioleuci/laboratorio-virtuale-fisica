import { derivative, parse } from 'mathjs';
import type { Partials } from './types';

export function propagateError(
  partials: Partials,
  values: { [key: string]: number },
  sigmas: { [key: string]: number }
): number {
  let variance = 0;
  for (const key in partials) {
    if (Object.prototype.hasOwnProperty.call(values, key) && Object.prototype.hasOwnProperty.call(sigmas, key)) {
      const partialDerivative = partials[key](values);
      const sigma = sigmas[key];
      if (typeof partialDerivative === 'number' && typeof sigma === 'number' && isFinite(partialDerivative) && isFinite(sigma)) {
        variance += (partialDerivative ** 2) * (sigma ** 2);
      }
    }
  }
  return Math.sqrt(variance);
}

export function calculateAndPropagate(
  formula: string,
  variables: { [key: string]: { value: number; sigma: number } }
): { value: number; sigma: number } | null {
  try {
    const node = parse(formula);
    const values = Object.entries(variables).reduce((acc, [k, v]) => ({ ...acc, [k]: v.value }), {});
    const sigmas = Object.entries(variables).reduce((acc, [k, v]) => ({ ...acc, [k]: v.sigma }), {});

    const value = node.evaluate(values);

    const partials: Partials = {};
    for (const name in variables) {
      partials[name] = (scope) => derivative(node, name).evaluate(scope);
    }

    const sigma = propagateError(partials, values, sigmas);

    return { value, sigma };
  } catch (error) {
    console.error("Error in calculation and propagation:", error);
    return null;
  }
}
