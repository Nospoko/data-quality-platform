export const chartSettings: any = {
  scales: {
    x: {
      border: {
        color: 'black',
        width: 2,
      },
    },
    y: {
      position: 'left',
      ticks: { display: true },
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
