import { ChartEvent, ChartOptions, TooltipPositioner } from 'chart.js';

import { ThemeType } from '@/types/common';

export const CONVERSION_FACTOR = 304.0;
export const SEGMENT_START = 540;
export const SEGMENT_END = 660;
export const RANGE_SMALL = [-2, 2];
export const RANGE_LARGE = [-4, 4];

/**
 * Legend data for displaying lines with customizable colors and labels.
 *
 * @typedef {Object} LegendItem
 * @property {string} color - The color of the line in CSS-compatible format (e.g., 'blue', '#FFA500', 'rgb(0, 128, 0)').
 * @property {string} label - The label or name associated with the line.
 */

/**
 * The light line colors configuration.
 *
 * @type {LightTheme}
 */
export const LEGEND_DATA_LIGHT = [
  { color: 'blue', label: 'lead 1' },
  { color: 'orange', label: 'lead 2' },
  { color: 'green', label: 'lead 3' },
];

/**
 * The dark line colors configuration.
 *
 * @type {LegendItem[]}
 */
export const LEGEND_DATA_DARK = [
  { color: 'blue', label: 'lead 1' },
  { color: 'orange', label: 'lead 2' },
  { color: 'green', label: 'lead 3' },
];

/**
 * Represents the dark theme configuration with customizable colors.
 *
 * @typedef {Object} DarkTheme
 * @property {string} primaryScaleColor - The color of the primary scale
 * @property {string} secondaryScaleColor - The color of the secondary scale
 * @property {string} gridColor - The color of the grid
 * @property {string} backgroundColorMain - The main background color
 * @property {string} backgroundColorZoom - The background color for zooming
 */

/**
 * The light theme configuration with customizable colors.
 *
 * @type {LightTheme}
 */
export const lightTheme = {
  primaryScaleColor: 'black',
  secondaryScaleColor: 'rgba(0, 0, 0, 0.3)',
  gridColor: 'rgba(0, 0, 0, 0.1)',
  backgroundColorMain: '#fff',
  backgroundColorZoom: '#fff',
};

/**
 * The dark theme configuration with customizable colors.
 *
 * @type {DarkTheme}
 */
export const darkTheme = {
  primaryScaleColor: 'white',
  secondaryScaleColor: 'rgba(255, 255, 255, 0.3)',
  gridColor: 'rgba(255, 255, 255, 0.1)',
  backgroundColorMain: '#141414',
  backgroundColorZoom: '#282828',
};

type MyChartOptions = ChartOptions<'line'> & {
  scales: {
    x: {
      border: {
        color: string;
        width: number;
      };
      ticks: {
        callback: (value: number) => string | null;
      };
      grid: {
        color: string;
      };
    };
    y: {
      position: 'left';
      border: {
        color: string;
        width: number;
      };
      grid: {
        color: string;
      };
    };
    y1: {
      position: 'center';
      ticks: { display: false };
      border: {
        color: string;
        width: number;
      };
      grid: { display: false };
    };
  };
  maintainAspectRatio: boolean;
  plugins: {
    legend: { display: boolean };
    tooltip: {
      enabled: boolean;
      position?: TooltipPositioner;
    };
  };
  events: ChartEvent[];
};

export const getChartSettings = (
  theme: string,
  ranges?: Record<string, [number, number]>,
  labels?: string[],
): MyChartOptions => {
  const colorCollection = theme === ThemeType.DARK ? darkTheme : lightTheme;

  return {
    scales: {
      x: {
        border: {
          color: colorCollection.primaryScaleColor,
          width: 2,
        },
        ticks: {
          callback: (value: number) => {
            const delimiter = value / 40;
            const normalizedTick = (delimiter * 0.2).toFixed(1);

            return value % 40 === 0 ? normalizedTick : null;
          },
        },
        grid: {
          color: colorCollection.gridColor,
        },
      },
      y: {
        position: 'left',
        border: {
          color: colorCollection.primaryScaleColor,
          width: 2,
        },
        grid: {
          color: colorCollection.gridColor,
        },
      },
      y1: {
        position: 'center',
        ticks: { display: false },
        border: {
          color: colorCollection.secondaryScaleColor,
          width: 2,
        },
        grid: { display: false },
      },
      ...(ranges && labels && getRangesScales(ranges, labels)),
    },
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false,
      },
    },
    events: [],
  };
};

type RangeConf = Record<
  string,
  { left: number; center: number; right: number; color: string }
>;

// hard-code ranges for ECG
export const mockEcgRanges = {
  P: [0.6, 0.9],
  Q: [1.6, 1.9],
  R: [2.8, 3.2],
  S: [3.6, 3.9],
  T: [4.6, 4.9],
} as Record<string, [number, number]>;

const rangeColors = ['red', 'green', 'blue'];

const getRangesScales = (
  ranges: Record<string, [number, number]>,
  labels: string[],
  yStart = 2,
) => {
  const labelIndexToRangeLabel: Record<number, string> = {};

  const rangeConf = Object.entries(ranges).reduce(
    (acc: RangeConf, [label, range], index) => {
      const left = findClosestLabelIndex(labels, range[0]);
      const right = findClosestLabelIndex(labels, range[1], left);
      const center = Math.floor((left + right) / 2);

      acc[label] = {
        left,
        center,
        right,
        color: rangeColors[index % rangeColors.length],
      };

      labelIndexToRangeLabel[center] = label;

      return acc;
    },
    {},
  );

  const scales: ChartOptions<'line'>['scales'] = {};

  let yIndex = yStart;

  // add scales for range lines
  Object.keys(ranges).forEach((label) => {
    scales[`y${++yIndex}`] = {
      position: { x: rangeConf[label].left },
      border: { color: rangeConf[label].color, width: 3 },
      ticks: { display: false },
      grid: { display: false },
    };

    scales[`y${++yIndex}`] = {
      position: { x: rangeConf[label].right },
      border: { color: rangeConf[label].color, width: 3 },
      ticks: { display: false },
      grid: { display: false },
    };
  });

  // add scale for range labels
  scales[`y${++yIndex}`] = {
    position: 'top',
    ticks: {
      callback: (val) => labelIndexToRangeLabel[val],
      color: (ctx) =>
        typeof ctx.tick.label === 'string'
          ? rangeConf[ctx.tick.label]?.color
          : undefined,
    },
  };

  return scales;
};

const findClosestLabelIndex = (arr: string[], val: number, startFrom = 0) => {
  let lo = startFrom;
  let hi = arr.length;
  const target = val.toFixed(2);
  do {
    const mid = Math.floor(lo + (hi - lo) / 2);
    const cur = arr[mid];
    if (cur === target) {
      return mid;
    }
    if (+cur > val) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  } while (lo < hi);
  return lo;
};
