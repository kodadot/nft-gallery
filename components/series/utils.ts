import { RowSeries, SimpleSeriesNFT, SortType } from './types'
// import formatBalance from '@/utils/formatBalance'
// import * as store from '~/store'
import { after, between, getVolume, pairListBuyEvent } from '@/utils/math'
import { eachDayOfInterval, formatISO, subDays } from 'date-fns'
import { Interaction } from '../rmrk/service/scheme'

export const today = new Date()
export const yesterdayDate: Date = subDays(today, 1)
export const lastweekDate: Date = subDays(today, 7)
export const lastmonthDate: Date = subDays(today, 30)
export const last3monthDate: Date = subDays(today, 90)
export const sub2dayDate: Date = subDays(today, 2)
export const last2weekDate: Date = subDays(today, 14)
export const last2monthDate: Date = subDays(today, 60)
export const last6monthDate: Date = subDays(today, 60)
export const volume = (buyEvents: Interaction[]) => Number(getVolume(buyEvents))

export const dailyVolume = (buyEvents: Interaction[]) =>
  Number(getVolume(buyEvents.filter(after(yesterdayDate))))

export const weeklyVolume = (buyEvents: Interaction[]) =>
  Number(getVolume(buyEvents.filter(after(lastweekDate))))

export const monthlyVolume = (buyEvents: Interaction[]) =>
  Number(getVolume(buyEvents.filter(after(lastmonthDate))))

export const threeMonthlyVolume = (buyEvents: Interaction[]) =>
  Number(getVolume(buyEvents.filter(after(last3monthDate))))

export const dailyrangeVolume = (buyEvents: Interaction[]) =>
  Number(getVolume(buyEvents.filter(between(sub2dayDate, yesterdayDate))))

export const weeklyrangeVolume = (buyEvents: Interaction[]) =>
  Number(getVolume(buyEvents.filter(between(last2weekDate, lastweekDate))))

export const monthlyrangeVolume = (buyEvents: Interaction[]) =>
  Number(getVolume(buyEvents.filter(between(last2monthDate, lastmonthDate))))

export const threeMonthRangeVolume = (buyEvents: Interaction[]) =>
  Number(getVolume(buyEvents.filter(between(last6monthDate, last3monthDate))))

export const nftFn = (a: any): RowSeries => {
  // const metaImage = fetchMetadataImage(a); DO NOT!
  const total = a.nfts.totalCount
  const collectionNfts = a.nfts.nodes
  const sold = a.nfts.nodes.reduce(soldFn, 0)
  const unique = a.nfts.nodes.reduce(uniqueFn, new Set()).size
  // const averagePrice =
  //   a.nfts.nodes.filter(onlyOwned).reduce(sumFn, 0) / (a.nfts.nodes.length || 1)
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

  return {
    id: a.id,
    name: a.name,
    image: '', // NOPE
    metadata: a.metadata,
    volume: volume(buyEvents),
    total,
    sold,
    unique,
    buys,
    uniqueCollectors,
    floorPrice,
    dailyVolume: dailyVolume(buyEvents),
    weeklyVolume: weeklyVolume(buyEvents),
    monthlyVolume: monthlyVolume(buyEvents),
    dailyrangeVolume: dailyrangeVolume(buyEvents),
    weeklyrangeVolume: weeklyrangeVolume(buyEvents),
    monthlyrangeVolume: monthlyrangeVolume(buyEvents),
    rank: sold * (unique / total),
  }
}

// const tokenDecimals = store.getters[
//   'chain/getChainPropertiesTokenDecimals'
// ] as any
// const formatNumber = (val: SimpleSeriesNFT) =>
//   Number(formatBalance(val.price, tokenDecimals, false, true))
// const sumFn = (acc: number, val: SimpleSeriesNFT) => acc + formatNumber(val)
const soldFn = (acc: number, val: SimpleSeriesNFT) =>
  val.issuer !== val.currentOwner ? acc + 1 : acc
const uniqueFn = (acc: Set<string>, val: SimpleSeriesNFT) =>
  acc.add(val.metadata)
// const onlyOwned = ({ issuer, currentOwner }: SimpleSeriesNFT) =>
//   issuer === currentOwner
// const onlyBuyEvents = ({ events }: SimpleSeriesNFT) => events.filter((e: { interaction: string }) => e.interaction === 'BUY')
// const onlyListEvents = (e: { interaction: string }) => e.interaction === 'LIST'
// const reducer = (a: number, b: number): number => Number(a) + Number(b)
const onlyEvents = (nft: SimpleSeriesNFT) => nft.events
export const onlyDate = (datetime: Date) =>
  formatISO(datetime, { representation: 'date' })

export const toSort = (sortBy: SortType): string =>
  `${sortBy.field}_${sortBy.value}`

// -> ["202-11-30", ...]
export function getDateArray(start: Date, end: Date): string[] {
  return eachDayOfInterval({ start, end }).map(onlyDate)
}

export function axisLize(obj = {}) {
  return {
    xAxisList: Object.keys(obj),
    yAxisList: Object.values(obj),
  }
}

export function defaultEvents(start: Date, end: Date) {
  return getDateArray(start, end).reduce((res, date) => {
    res[date] = 0
    return res
  }, {})
}

export function calculateAvgPrice(volume: string, buys: number): string {
  return String(Math.round(parseInt(volume) / buys))
}
