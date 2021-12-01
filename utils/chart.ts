type ChartData = [Date, string | number][];

export const getChartData = (data: ChartData = []) =>
  data.map((item) => ({
    x: item[0],
    y: item[1],
  }));
