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
