import { LEGEND_DATA_DARK, LEGEND_DATA_LIGHT } from '../models';
import { processSignal } from './processSignal';

import { EcgFragment } from '@/types/common';

const samplingRate = 200;

export const getChartData = (
  id: string,
  fragment: EcgFragment,
  isDarkMode: boolean,
) => {
  const labels = fragment.signal.map((_, index) =>
    (index / samplingRate).toFixed(2),
  );
  const processedSignal = processSignal(fragment);
  const LEGEND_DATA = isDarkMode ? LEGEND_DATA_DARK : LEGEND_DATA_LIGHT;

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
