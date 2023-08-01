import { ChartEvent, ChartOptions, TooltipPositioner } from 'chart.js';

import { ThemeType } from '@/types/common';

export const CONVERSION_FACTOR = 304.0;
export const SEGMENT_START = 540;
export const SEGMENT_END = 660;
export const RANGE_SMALL = [-2, 2];
export const RANGE_LARGE = [-4, 4];

export const lightTheme = {
  primaryScaleColor: 'black',
  secondaryScaleColor: 'rgba(0, 0, 0, 0.3)',
  gridColor: 'rgba(0, 0, 0, 0.1)',
};

export const darkTheme = {
  primaryScaleColor: 'white',
  secondaryScaleColor: 'rgba(255, 255, 255, 0.3)',
  gridColor: 'rgba(255, 255, 255, 0.1)',
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
    events: [],
  };
};
