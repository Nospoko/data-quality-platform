import { RANGE_LARGE, RANGE_SMALL } from '../models';

/**
 * Calculates the limits of a signal array.
 *
 * @param {number[]} signal -  An array of numbers representing the signal.
 * @returns {number[]} - An array of limits based on the maximum absolute value in the signal.
 */
export function getLimits(signal: number[]): number[] {
  const signalMin = Math.min(...signal);
  const signalMax = Math.max(...signal);
  const maxOfSignals = Math.max(Math.abs(signalMin), Math.abs(signalMax));

  return maxOfSignals < 2 ? RANGE_SMALL : RANGE_LARGE;
}
