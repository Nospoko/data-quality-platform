import {
  convertToMv,
  shiftSignal,
} from '@/modules/dashboard/utils/processSignal';

test('Converts signal values to millivolts', () => {
  const signal = [100, 200, 300, 400];
  const expectedOutput = [0.33, 0.66, 0.99, 1.32];
  const convertedSignal = convertToMv(signal);

  expect(convertedSignal).toEqual(expectedOutput);
});

test('Shifts signal values by subtracting mean', () => {
  const signal = [-2.65, -0.66, 0];
  const mean = { 0: -1.36, 1: -1.06, 2: -1.19 };
  const expectedOutput = [-1.2899999999999998, 0.4, 1.19];
  const shiftedSignal = shiftSignal(signal, mean);

  expect(shiftedSignal).toEqual(expectedOutput);
});
