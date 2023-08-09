import { getLimits } from '@/modules/dashboardPage/utils/getRange';

test('getLimits returns correct range for small signals', () => {
  const smallSignal = [0.1, -0.5, 0.8, -1.0, 0.3];
  const result = getLimits(smallSignal);
  expect(result).toEqual([-2, 2]);
});

test('getLimits returns correct range for large signals', () => {
  const largeSignal = [10, -25, 35, -45, 50];
  const result = getLimits(largeSignal);
  expect(result).toEqual([-4, 4]);
});
