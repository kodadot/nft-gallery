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

type MedianDetails = {
  median: number
  medianIndex: null | number
}
type RenderedChartData<T = bigint | number> = { x: Date; y: T }[]

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

// source: https://stackoverflow.com/a/64452666
// https://mathworld.wolfram.com/Outlier.html
export const getHSpread = (data): HSpread => {
  const values = data.concat().sort((a, b) => a - b)

  const quartile = (q) => {
    const sorted = values
    const pos = (sorted.length - 1) * q
    const base = Math.floor(pos)
    const rest = pos - base

    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base])
    }

    return sorted[base]
  }

  const q1 = quartile(0.25)
  const q3 = quartile(0.75)
  const iqr = q3 - q1
  const max = q3 + iqr * 1.5
  const min = q1 - iqr * 1.5

  return { min, max, q1, q3, iqr, sorted: values }
}

export const filterOutliers = (data) => {
  const { min, max, sorted } = getHSpread(data)

  // Then filter anything beyond or beneath these values.
  const filteredValues = sorted.filter((x) => {
    return x <= max && x >= min
  })

  // Then return
  return filteredValues
}
