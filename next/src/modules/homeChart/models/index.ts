export const CONVERSION_FACTOR = 304.0;
export const SEGMENT_START = 540;
export const SEGMENT_END = 660;

export const RANGE_SMALL = [-2, 2];
export const RANGE_LARGE = [-4, 4];

export const chartSettings: any = {
  scales: {
    x: {
      border: {
        color: 'black',
        width: 2,
      },
      ticks: {
        callback: (value: number) => {
          const delimiter = value / 40;
          const normalizedTick = (delimiter * 0.2).toFixed(1);

          return value % 40 === 0 ? normalizedTick : null;
        },
      },
    },
    y: {
      position: 'left',
      border: {
        color: 'black',
        width: 2,
      },
    },
    y1: {
      position: 'center',
      ticks: { display: false },
      border: {
        color: 'black',
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
