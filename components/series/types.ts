export type TimeRange = 'All' | 'Quarter' | 'Month' | 'Week'

export interface TimeRangeOption {
  value: TimeRange
  label: string
}

export type SortType = {
  field: string
  value: 'ASC' | 'DESC'
}

type VolumeType = number | bigint | string

export type BuyHistory = {
  xAxisList: string[]
  yAxisList: number[]
}

export type RowSeries = {
  id: string
  unique: number
  image: string
  metadata: string
  sold: number
  total: number
  buys: number
  volume: VolumeType
  dailyVolume: VolumeType
  weeklyVolume: VolumeType
  monthlyVolume: VolumeType
  threeMonthVolume: VolumeType
  dailyrangeVolume: VolumeType
  weeklyrangeVolume: VolumeType
  monthlyrangeVolume: VolumeType
  threeMonthlyrangeVolume: VolumeType
  averagePrice: string
  floorPrice: number
  highestPrice: number
  rank: number
  uniqueCollectors: number
  name: string
  buyHistory: BuyHistory
  emoteCount: number
}
