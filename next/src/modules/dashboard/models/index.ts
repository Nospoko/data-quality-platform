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
    segmentation?: {
      ranges: ChartRanges;
      updateRanges: (newRanges: ChartRanges) => void;
    };
  };
};

export const getChartSettings = (
  theme: string,
  ranges?: ChartRanges,
  updateRanges?: (newRanges: ChartRanges) => void,
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
    },
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false,
      },
      ...(ranges &&
        updateRanges && {
          segmentation: {
            ranges,
            updateRanges,
          },
        }),
    },
    events: ['mousedown', 'mousemove', 'mouseup', 'mouseleave'],
  };
};

export type ChartRanges = Record<string, [number, number]>;

type SideConf = {
  initial: number;
  position: number;
  x: number | undefined;
  lineLabel: string;
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

export const defaltRanges: ChartRanges = {
  P: [0.6, 0.9],
  Q: [1.6, 1.9],
  R: [2.8, 3.2],
  S: [3.6, 3.9],
  T: [4.6, 4.9],
};

const rangeColors = ['red', 'green', 'blue'];
const opacityColors = {
  red: 'rgba(255, 0, 0, 0.1)',
  green: 'rgba(0, 255, 0, 0.1)',
  blue: 'rgba(0, 0, 255, 0.1)',
};
const rangeLineWidth = 3;

export const segmentationPlugin = (): Plugin<'line'> => {
  let savedRanges: ChartRanges | null = null;
  let rangesConf: RangeConf | null = null;
  let nearestLine: SideConf | null = null;
  let nearestRange: string | null = null;
  let isDragging = false;
  let isUpdatePending = false;
  let deleteRangeLabel: string | null = null;
  /** @var `[xStart, xEnd, yStart, yEnd]` */
  let deleteRangeBtnCoords: [number, number, number, number] | null = null;
  let isOverDelBtn = false;

  /**
   * Transorm ranges to plugin's internal ranges settings object
   *
   * @param {ChartRanges} rangesObj
   * @returns {RangeConf}
   */
  const loadRanges = (rangesObj: ChartRanges): RangeConf =>
    Object.entries(rangesObj).reduce(
      (conf: RangeConf, [label, range], index) => {
        conf[label] = {
          left: {
            initial: range[0],
            position: 0,
            x: undefined,
            lineLabel: `${range[0]}`,
            rangeLabel: label,
            side: 'left',
          },
          right: {
            initial: range[1],
            position: 0,
            x: undefined,
            lineLabel: `${range[1]}`,
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
   * @returns {[string|null, SideConf|null]} `[rangeLabel, line]`
   */
  const getNearest = (x: number): [string | null, SideConf | null] => {
    if (!rangesConf) {
      return [null, null];
    }

    for (const label in rangesConf) {
      const { left, right } = rangesConf[label];

      if (left.x === undefined || right.x === undefined) {
        continue;
      }

      if (x >= left.x - 6 && x <= left.x + 6) {
        return [label, left];
      }

      if (x >= right.x - 6 && x <= right.x + 6) {
        return [label, right];
      }

      const leftPoint = Math.min(left.x, right.x);
      const rightPoint = leftPoint + Math.abs(right.x - left.x);

      if (x >= leftPoint - 6 && x <= rightPoint + 6) {
        return [label, null];
      }
    }

    return [null, null];
  };

  /**
   * Update ranges after Drag-n-drop
   */
  const performUpdateRanges = (
    updaterFn?: (newRanges: ChartRanges) => void,
    rangeToDelete?: string | null,
  ) => {
    if (!rangesConf || !updaterFn) {
      console.warn(
        'segmentation plugin:',
        !rangesConf ? 'No rangesConf;' : '',
        !updaterFn ? 'No updaterFn;' : '',
      );
      isUpdatePending = false;
      return;
    }

    const newRanges = Object.entries(rangesConf).reduce(
      (acc: ChartRanges, [label, { left, right }]) => {
        if (rangeToDelete === label) {
          return acc;
        }

        const leftBoundary = Math.min(+left.lineLabel, +right.lineLabel);
        const rightBoundary = Math.max(+left.lineLabel, +right.lineLabel);

        acc[label] = [leftBoundary, rightBoundary];
        return acc;
      },
      {},
    );

    updaterFn(newRanges);

    isUpdatePending = false;
  };

  // ChartJS plugin
  return {
    id: 'segmentation',

    // load initial ranges from chart options
    afterInit(chart, args, options) {
      savedRanges = options.ranges as ChartRanges;
      if (savedRanges) {
        rangesConf = loadRanges(savedRanges);
      } else {
        console.warn('segmentation plugin: No initial ranges provided');
      }
    },

    // handle lines Dran-n-Drop
    afterEvent(chart, args, options) {
      const event = args.event.native as MouseEvent;

      if (!isDragging) {
        const [rangeLabel, line] = args.inChartArea
          ? getNearest(event.offsetX)
          : [null, null];

        if (line !== nearestLine || rangeLabel !== nearestRange) {
          args.changed = true;
        }

        nearestRange = rangeLabel;
        nearestLine = line;

        chart.canvas.style.cursor = line ? 'ew-resize' : '';

        if (
          deleteRangeBtnCoords &&
          event.offsetX >= deleteRangeBtnCoords[0] &&
          event.offsetX <= deleteRangeBtnCoords[1] &&
          event.offsetY >= deleteRangeBtnCoords[2] &&
          event.offsetY <= deleteRangeBtnCoords[3]
        ) {
          isOverDelBtn = true;
          chart.canvas.style.cursor = 'pointer';
        } else {
          isOverDelBtn = false;
        }
      }

      switch (event.type) {
        case 'mousedown':
          if (isOverDelBtn) {
            performUpdateRanges(options.updateRanges, deleteRangeLabel);
            isOverDelBtn = false;
            deleteRangeLabel = null;
            deleteRangeBtnCoords = null;
          }

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

            const newVal = chart.scales.x.getValueForPixel(newX);

            if (newVal !== undefined) {
              const newPointLabel = chart.data.labels?.[newVal];
              nearestLine.lineLabel = newPointLabel as string;
              nearestLine.position = newVal;
              isUpdatePending = true;
            }

            args.changed = true;
          }
          break;

        case 'mouseleave':
          nearestLine = null;
          document.body.style.cursor = '';
          args.changed = true;
        case 'mouseup':
          isUpdatePending && performUpdateRanges(options.updateRanges);
          isDragging = false;
          break;
      }
    },

    // check options.ranges change; draw the ranges
    afterDatasetDraw(chart, args, options) {
      const { ctx, data, scales, chartArea } = chart;

      if (options.ranges !== savedRanges) {
        savedRanges = options.ranges as ChartRanges;
        rangesConf = loadRanges(savedRanges);
      }

      if (!rangesConf) {
        console.warn('segmentation plugin: No ragesConf');
        return;
      }

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

        const isOverRange = nearestRange === left.rangeLabel;

        // draw left boundary
        ctx.beginPath();
        ctx.lineWidth = isOverRange ? rangeLineWidth * 2 : rangeLineWidth;
        ctx.strokeStyle = color;
        ctx.moveTo(left.x, chartArea.bottom);
        ctx.lineTo(left.x, chartArea.top - 2);
        ctx.stroke();
        if (isOverRange) {
          ctx.fillStyle = color;
          ctx.fillText(left.lineLabel, left.x, chartArea.top);
        }

        // draw right boundary
        ctx.beginPath();
        ctx.lineWidth = isOverRange ? rangeLineWidth * 2 : rangeLineWidth;
        ctx.strokeStyle = color;
        ctx.moveTo(right.x, chartArea.bottom);
        ctx.lineTo(right.x, chartArea.top - 2);
        ctx.stroke();
        if (isOverRange) {
          ctx.fillStyle = color;
          ctx.fillText(right.lineLabel, right.x, chartArea.top);
        }

        // fill range
        if (isOverRange) {
          ctx.fillStyle = opacityColors[color];
          ctx.fillRect(
            Math.min(left.x, right.x) + rangeLineWidth,
            chartArea.top,
            Math.abs(right.x - left.x) - rangeLineWidth * 2,
            chartArea.height,
          );
        }

        const rangeCenterX = Math.floor((left.x + right.x) / 2);

        // draw label
        ctx.font = 'bold';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.fillText(left.rangeLabel, rangeCenterX, chartArea.top);

        // draw delete button
        if (isOverRange && left.rangeLabel !== 'R') {
          ctx.fillStyle = 'black';
          ctx.roundRect(rangeCenterX - 22, chartArea.bottom - 20, 44, 20, 5);
          ctx.fill();
          ctx.fillStyle = 'white';
          ctx.fillText('Delete', rangeCenterX, chartArea.bottom - 7);

          deleteRangeBtnCoords = [
            rangeCenterX - 22,
            rangeCenterX + 22,
            chartArea.bottom - 20,
            chartArea.bottom,
          ];
          deleteRangeLabel = left.rangeLabel;
        }

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
