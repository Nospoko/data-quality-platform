import { ChartOptions, Plugin, TooltipPositioner } from 'chart.js';

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
};

export const getChartSettings = (theme: string): MyChartOptions => {
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
    },
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false,
      },
    },
    events: ['mousedown', 'mousemove', 'mouseup', 'mouseleave'],
  };
};

export type ChartRanges = Record<string, [number, number]>;

type SideConf = {
  initial: number;
  x: number | undefined;
  label: string;
  rangeLabel: string;
  side: 'left' | 'right';
};

type RangeConf = {
  [label: string]: {
    left: SideConf;
    right: SideConf;
    color: string;
  };
};

const rangeColors = ['red', 'green', 'blue'];
const rangeLineWidth = 3;

export const rangeLinesPlugin = (
  ranges: ChartRanges,
  updateRanges: (newRanges: ChartRanges) => void,
): Plugin<'line'> => {
  let nearestLine: SideConf | null = null;
  let isDragging = false;
  let isUpdatePending = false;

  const rangesConf = Object.entries(ranges).reduce(
    (conf: RangeConf, [label, range], index) => {
      conf[label] = {
        left: {
          initial: range[0],
          x: undefined,
          label: `${range[0]}`,
          rangeLabel: label,
          side: 'left',
        },
        right: {
          initial: range[1],
          x: undefined,
          label: `${range[1]}`,
          rangeLabel: label,
          side: 'right',
        },
        color: rangeColors[index % rangeColors.length],
      };

      return conf;
    },
    {},
  );

  /**
   * Get the nearest line to the cursor, or null if not close to any lines
   *
   * @param {number} x `MouseEvent.offsetX`
   */
  const getNearestLine = (x: number): SideConf | null => {
    for (const label in rangesConf) {
      const { left, right } = rangesConf[label];

      if (left.x !== undefined && x >= left.x - 6 && x <= left.x + 6) {
        return left;
      }

      if (right.x !== undefined && x >= right.x - 6 && x <= right.x + 6) {
        return right;
      }
    }

    return null;
  };

  /**
   * Update ranges after Drag-n-drop
   */
  const performUpdateRanges = () => {
    const newRanges = Object.entries(rangesConf).reduce(
      (acc: ChartRanges, [label, { left, right }]) => {
        acc[label] = [+left.label, +right.label];
        return acc;
      },
      {},
    );

    updateRanges(newRanges);

    isUpdatePending = false;
  };

  // ChartJS plugin
  return {
    id: 'segmentation-ranges',

    // handle lines Dran-n-Drop
    afterEvent(chart, args) {
      const event = args.event.native as MouseEvent;

      if (!isDragging) {
        const nearest = getNearestLine(event.offsetX);

        if (nearest !== nearestLine) {
          args.changed = true;
        }

        if (nearest) {
          document.body.style.cursor = 'ew-resize';
          nearestLine = nearest;
        } else {
          document.body.style.cursor = '';
          nearestLine = null;
        }
      }

      switch (event.type) {
        case 'mousedown':
          if (nearestLine) {
            isDragging = true;
          }
          break;

        case 'mousemove':
          if (isDragging && nearestLine) {
            let newX = event.offsetX;
            if (newX < chart.chartArea.left) {
              newX = chart.chartArea.left;
            }
            if (newX > chart.chartArea.right) {
              newX = chart.chartArea.right;
            }

            nearestLine.x = newX;

            const nearest = chart.getElementsAtEventForMode(
              event,
              'nearest',
              { intersect: false },
              true,
            );

            if (nearest.length > 0) {
              const newPointLabel = chart.data.labels?.[
                nearest[0].index
              ] as string;
              nearestLine.label = newPointLabel;
              isUpdatePending = true;
            }

            args.changed = true;
          }
          break;

        case 'mouseup':
          isUpdatePending && performUpdateRanges();
          isDragging = false;
          break;

        case 'mouseleave':
          isUpdatePending && performUpdateRanges();
          isDragging = false;
          nearestLine = null;
          document.body.style.cursor = '';
          args.changed = true;
          break;
      }
    },

    // draw the lines
    afterDatasetDraw(chart) {
      const { ctx, data, scales, chartArea } = chart;

      Object.values(rangesConf).forEach(({ left, right, color }) => {
        // find X coordinate for the boundaries
        if (left.x === undefined) {
          left.x = scales.x.getPixelForValue(
            findClosestLabelIndex(data.labels as string[], left.initial),
          );
        }
        if (right.x === undefined) {
          right.x = scales.x.getPixelForValue(
            findClosestLabelIndex(data.labels as string[], right.initial),
          );
        }

        // draw left boundary
        const isOverLeft = nearestLine === left;
        ctx.beginPath();
        ctx.lineWidth = isOverLeft ? rangeLineWidth * 2 : rangeLineWidth;
        ctx.strokeStyle = color;
        ctx.moveTo(left.x, chartArea.bottom);
        ctx.lineTo(left.x, chartArea.top - 2);
        ctx.stroke();
        if (isOverLeft) {
          ctx.fillStyle = color;
          ctx.fillText(left.label, left.x, chartArea.top);
        }

        // draw right boundary
        const isOverRight = nearestLine === right;
        ctx.beginPath();
        ctx.lineWidth = isOverRight ? rangeLineWidth * 2 : rangeLineWidth;
        ctx.strokeStyle = color;
        ctx.moveTo(right.x, chartArea.bottom);
        ctx.lineTo(right.x, chartArea.top - 2);
        ctx.stroke();
        if (isOverRight) {
          ctx.fillStyle = color;
          ctx.fillText(right.label, right.x, chartArea.top);
        }

        // draw label
        ctx.font = 'bold';
        ctx.fillStyle = color;
        ctx.fillText(
          left.rangeLabel,
          Math.floor((left.x + right.x) / 2),
          chartArea.top,
        );

        ctx.save();
      });
    },
  };
};

/**
 * Given an array of labels e.g. `["1.00", "1.46", "2.05", ...]` and a number `val`,
 * return the index of the label that is closest to the `val` (if `val = 1.5` return `1`).
 *
 * @param {string[]} arr array of labels `[number.toFixed(2)]`
 * @param {number} val search for label that is or closest to `val.toFixed(2)`
 * @param {?number} [startFrom=0] (Optional) index in `arr` to start searching from
 * @returns {number}
 */
const findClosestLabelIndex = (arr: string[], val: number, startFrom = 0) => {
  // regular binary search
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
