import { processSignal } from './processSignal';

import { EcgFragment } from '@/types/common';

const LEGEND_DATA = [
  { color: 'blue', label: 'lead 1' },
  { color: 'orange', label: 'lead 2' },
  { color: 'green', label: 'lead 3' },
];
const samplingRate = 200;

export const getChartData = (id: string, fragment: EcgFragment) => {
  const labels = fragment.signal.map((_, index) =>
    (index / samplingRate).toFixed(2),
  );
  const processedSignal = processSignal(fragment);

  const datasets = processedSignal.signal[0].map((_, index) => ({
    label: `lead ${index + 1}`,
    data: processedSignal.signal.map((signal) => signal[index]),
    fill: false,
    borderColor: LEGEND_DATA[index].color,
    tension: 0,
    pointRadius: 0,
    borderWidth: 1,
  }));

  return {
    id,
    fragment,
    data: { labels, datasets },
  };
};
