type ChartData = [Date, number][]

export type CollectionChartData = {
  date: Date
  value: bigint | number
  average?: bigint | number
  count: number
}

export type MappingFunction<T> = (item: CollectionChartData) => T
export const defaultMapper = (item: CollectionChartData) => item.value
export const mapToAverage = (item: CollectionChartData) =>
  item.average ?? BigInt(0)
export const mapToCount = (item: CollectionChartData) => item.count
export const getLabel = (item: CollectionChartData) => item.date

type GetQuartilesArgs = {
  dataset: number[]
  medianDetails: MedianDetails
}
type MedianDetails = {
  median: number
  medianIndex: null | number
}
type RenderedChartData<T = bigint | number> = { x: Date; y: T }[]

interface Quartiles {
  q1: number
  q2: number
  q3: number
}
interface HSpread {
  min: number
  max: number
  iqr: number
  q1: number
  q3: number
  sorted: number[]
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

export const getCollectionChartData = (
  data: CollectionChartData[] = [],
  mapper = defaultMapper
): RenderedChartData =>
  data.map((item) => ({
    x: item.date,
    y: mapper(item),
    count: item.count,
  }))

export const getCollectionMedian = (data: CollectionChartData[] = []) => {
  const dataset = data
    .map((item) => item.value)
    .map(Number)
    .sort((a, b) => b - a)
  const { median } = getMedianDetails(dataset)
  return median
}

export const getMedianPoint = (data: ChartData = []): number => {
  const dataset = data.map((item) => item[1]).sort((a, b) => b - a)
  const { median } = getMedianDetails(dataset)
  return median
}

export const getMovingAverage = (data: RenderedChartData = []): number[] => {
  const dataset = data.map(({ y }) => y) as number[]
  const movingAverageArray: number[] = []
  const average = 3

  for (let i = 0; i < dataset.length - 2; i++) {
    const datapoints = dataset.slice(i, average + i)
    const movingAverage = datapoints.reduce((total, num) => total + num, 0) / 3
    movingAverageArray.push(movingAverage)
  }

  return movingAverageArray
}

// source: https://stackoverflow.com/a/20811670
// https://mathworld.wolfram.com/Outlier.html
export const getHSpread = (data): HSpread => {
  // Copy the values, rather than operating on references to existing values
  const values = data.concat()

  // Then sort
  values.sort(function (a, b) {
    return a - b
  })

  /* Then find a generous IQR. This is generous because if (values.length / 4)
   * is not an int, then really you should average the two elements on either
   * side to find q1.
   */
  const q1 = values[Math.floor(values.length / 4)]
  // Likewise for q3.
  const q3 = values[Math.ceil(values.length * (3 / 4))]
  const iqr = q3 - q1

  // Then find min and max values
  const max = q3 + iqr * 1.5
  const min = q1 - iqr * 1.5

  return { min, max, q1, q3, iqr, sorted: values }
}

export const filterOutliers = (data) => {
  const { min, max, sorted } = getHSpread(data)

  // Then filter anything beyond or beneath these values.
  const filteredValues = sorted.filter(function (x) {
    return x <= max && x >= min
  })

  // Then return
  return filteredValues
}
