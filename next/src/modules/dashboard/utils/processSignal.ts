import { CONVERSION_FACTOR, SEGMENT_END, SEGMENT_START } from '../models';

import { EcgFragment } from '@/types/common';

type Mean = { 0: number; 1: number; 2: number };
type Signals = number[][];

/**
 * Converts a signal value to millivolts.
 *
 * @param {number} value - The signal value.
 * @returns {number} - The signal value converted to millivolts.
 */
export function convertToMv(signal: number[]): number[] {
  return signal.map(
    (value) => Math.round((value / CONVERSION_FACTOR) * 100) / 100,
  );
}

/**
 * Converts an array of signal arrays to millivolts and calculates the mean.
 *
 * @param {Signals} signals - The array of signal arrays.
 * @returns {Object} - The object containing converted signals and the mean.
 */
export function convertToMvAndCalculateMean(signals: Signals): {
  convertedSignals: Signals;
  mean: Mean;
} {
  const total = { 0: 0, 1: 0, 2: 0 };

  const convertedSignals = signals.map((signalArray, i) => {
    const convertedSignal = convertToMv(signalArray);
    if (i >= SEGMENT_START && i <= SEGMENT_END) {
      convertedSignal.forEach((v, j) => {
        total[j] += v;
      });
    }
    return convertedSignal;
  });
  const segmentLength = SEGMENT_END - SEGMENT_START;
  const mean = {
    0: Math.round((total[0] / segmentLength) * 100) / 100,
    1: Math.round((total[1] / segmentLength) * 100) / 100,
    2: Math.round((total[2] / segmentLength) * 100) / 100,
  };
  return {
    convertedSignals,
    mean,
  };
}

/**
 * Shifts a signal array values by subtracting a provided mean.
 *
 * @param {number[]} signal - The signal array.
 * @param {Mean} mean - The mean to subtract from the signal values.
 * @returns {number[]} - The array of shifted signal values.
 */
export function shiftSignal(signal: number[], mean: Mean): number[] {
  return signal.map((value, i) => value - mean[i]);
}

/**
 * Processes the ECG signal data by converting it to millivolts
 * and shifting the signal values.
 *
 * @param {EcgFragment} data - The ECG signal data to be processed.
 * @returns {EcgFragment} - The processed ECG signal data.
 */
export function processSignal(data: EcgFragment): EcgFragment {
  const { convertedSignals, mean } = convertToMvAndCalculateMean(data.signal);
  const processedSignalData: EcgFragment = {
    ...data,
    signal: convertedSignals.map((signal) => shiftSignal(signal, mean)),
  };

  return processedSignalData;
}
