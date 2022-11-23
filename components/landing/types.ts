export type CollectionEntity = {
  id: string
  floorPrice: number
  averagePrice: VolumeType
  image: string
  metadata: string
  sold: number
  name: string
  total: number
  buys: number
  unique: number
  uniqueCollectors: number
  volume: VolumeType
}

type VolumeType = number | bigint | string

export interface CollectionEntityWithVolumes extends CollectionEntity {
  volume: VolumeType
  dailyVolume?: VolumeType
  weeklyVolume?: VolumeType
  monthlyVolume?: VolumeType
  threeMonthVolume?: VolumeType
  dailyrangeVolume?: VolumeType
  weeklyrangeVolume?: VolumeType
  monthlyrangeVolume?: VolumeType
  threeMonthlyrangeVolume?: VolumeType
}
