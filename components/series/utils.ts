import { RowSeries, SimpleSeriesNFT, SortType } from './types'
import formatBalance from '@/utils/formatBalance'
import * as store from '~/store'
import { getVolume, pairListBuyEvent, after, between } from '@/utils/math'
import { startOfToday, subDays } from 'date-fns'

export const nftFn = (a: any): RowSeries => {
  // const metaImage = fetchMetadataImage(a); DO NOT!
  const total = a.nfts.totalCount
  const collectionNfts = a.nfts.nodes
  const sold = a.nfts.nodes.reduce(soldFn, 0)
  const unique = a.nfts.nodes.reduce(uniqueFn, new Set()).size
  const averagePrice =
    a.nfts.nodes.filter(onlyOwned).reduce(sumFn, 0) / (a.nfts.nodes.length || 1)
  const uniqueCollectors = [
    ...new Set(a.nfts.nodes.map((nft: SimpleSeriesNFT) => nft.currentOwner)),
  ].length
  const floorPrice = Math.min(
    ...collectionNfts
      .map((nft: SimpleSeriesNFT) => Number(nft.price))
      .filter((price: number) => price > 0)
  )

  const buyEvents = collectionNfts.map(onlyEvents).map(pairListBuyEvent).flat()
  const buys = buyEvents.length
  const volume = Number(getVolume(buyEvents))
  const dailyVolume = Number(getVolume(buyEvents.filter(after(yesterdayDate))))
  const weeklyVolume = Number(getVolume(buyEvents.filter(after(lastweekDate))))
  const monthlyVolume = Number(
    getVolume(buyEvents.filter(after(lastmonthDate)))
  )
  const dailyrangeVolume = Number(
    getVolume(buyEvents.filter(between(sub2dayDate, yesterdayDate)))
  )
  const weeklyrangeVolume = Number(
    getVolume(buyEvents.filter(between(last2weekDate, lastweekDate)))
  )
  const monthlyrangeVolume = Number(
    getVolume(buyEvents.filter(between(last2monthDate, lastmonthDate)))
  )

  return {
    id: a.id,
    name: a.name,
    image: '', // NOPE
    metadata: a.metadata,
    volume,
    total,
    sold,
    unique,
    buys,
    uniqueCollectors,
    averagePrice,
    floorPrice,
    dailyVolume,
    weeklyVolume,
    monthlyVolume,
    dailyrangeVolume,
    weeklyrangeVolume,
    monthlyrangeVolume,
    rank: sold * (unique / total),
  }
}

const tokenDecimals = store.getters[
  'chain/getChainPropertiesTokenDecimals'
] as any
const formatNumber = (val: SimpleSeriesNFT) =>
  Number(formatBalance(val.price, tokenDecimals, false, true))
const sumFn = (acc: number, val: SimpleSeriesNFT) => acc + formatNumber(val)
const soldFn = (acc: number, val: SimpleSeriesNFT) =>
  val.issuer !== val.currentOwner ? acc + 1 : acc
const uniqueFn = (acc: Set<string>, val: SimpleSeriesNFT) =>
  acc.add(val.metadata)
const onlyOwned = ({ issuer, currentOwner }: SimpleSeriesNFT) =>
  issuer === currentOwner
// const onlyBuyEvents = ({ events }: SimpleSeriesNFT) => events.filter((e: { interaction: string }) => e.interaction === 'BUY')
// const onlyListEvents = (e: { interaction: string }) => e.interaction === 'LIST'
// const reducer = (a: number, b: number): number => Number(a) + Number(b)
const onlyEvents = (nft: SimpleSeriesNFT) => nft.events

export const toSort = (sortBy: SortType): string =>
  `${sortBy.field}_${sortBy.value}`

const today = startOfToday()
const yesterdayDate: Date = subDays(today, 1)
const lastweekDate: Date = subDays(today, 7)
const lastmonthDate: Date = subDays(today, 30)
const sub2dayDate: Date = subDays(today, 2)
const last2weekDate: Date = subDays(today, 14)
const last2monthDate: Date = subDays(today, 60)
