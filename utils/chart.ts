type ChartData = [Date, number][];
type GetQuartilesArgs = {
  dataset: number[];
  medianDetails: MedianDetails;
};
type MedianDetails = {
  median: number;
  medianIndex: null | number;
};
type RenderedChartData = { x: Date; y: number }[];
interface Quartiles {
  q1: number;
  q2: number;
  q3: number;
}
interface HSpread extends Quartiles {
  min: number;
  max: number;
}

const getMedianDetails = (dataset: number[]): MedianDetails => {
  const length = dataset.length
  const medianIndex = null
  if (length % 2 === 0) {
    return {
      median: (dataset[length / 2] + dataset[length / 2 - 1]) / 2,
      medianIndex,
    }
  } else {
    const median = dataset[Math.floor(length / 2)]
    return { median, medianIndex: Math.floor(length / 2) }
  }
}

const getQuartiles = ({
  dataset,
  medianDetails,
}: GetQuartilesArgs): Quartiles => {
  let q1 = 0
  let q3 = 0

  // If there is a median index, this means that the dataset length is an odd number
  if (medianDetails.medianIndex) {
    q1 = getMedianDetails(dataset.slice(0, medianDetails.medianIndex)).median
    q3 = getMedianDetails(
      dataset.slice(medianDetails.medianIndex + 1, dataset.length)
    ).median
  } else {
    q1 = getMedianDetails(dataset.slice(0, dataset.length / 2)).median
    q3 = getMedianDetails(
      dataset.slice(dataset.length / 2, dataset.length)
    ).median
  }

  return { q1, q2: medianDetails.median, q3 }
}

export const getChartData = (data: ChartData = []): RenderedChartData =>
  data.map((item) => ({
    x: item[0],
    y: item[1],
  }))

export const getMedianPoint = (data: ChartData = []): number => {
  const dataset = data.map((item) => item[1]).sort((a, b) => b - a)
  const { median } = getMedianDetails(dataset)
  return median
}

export const getHSpread = (data: ChartData = []): HSpread => {
  const dataset = data.map((item) => item[1]).sort((a, b) => b - a)
  const medianDetails = getMedianDetails(dataset)
  const min = Math.min(...dataset)
  const max = Math.max(...dataset)
  const { q1, q2, q3 } = getQuartiles({ dataset, medianDetails })
  return { min, max, q1, q2, q3 }
}

export const getMovingAverage = (data: ChartData = []): number[] => {
  const dataset = data.map((item) => item[1])
  const movingAverageArray: number[] = []
  const average = 3

  for (let i = 0; i < dataset.length - 2; i++) {
    const datapoints = dataset.slice(i, average + i)
    const movingAverage = datapoints.reduce((total, num) => total + num, 0) / 3
    movingAverageArray.push(movingAverage)
  }

  return movingAverageArray
}
