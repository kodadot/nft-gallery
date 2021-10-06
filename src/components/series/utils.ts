import i18n from '@/i18n'
import { Column, RowSeries, SimpleSeriesNFT } from './types'
import formatBalance from '@/utils/formatBalance'
import store from '@/store'

export const columns: Column[] = [
  { field: 'id', label: i18n.t('spotlight.id') },
  { field: 'rank', label: i18n.t('spotlight.score'), numeric: true },
  { field: 'unique', label: i18n.t('spotlight.unique'), numeric: true },
  { field: 'averagePrice', label: 'Floor price', numeric: true },
  { field: 'sold', label: i18n.t('spotlight.sold'), numeric: true },
  { field: 'uniqueCollectors', label: i18n.t('spotlight.unique'), numeric: true },
  { field: 'total', label: i18n.t('spotlight.total'), numeric: true }
]

export const nftFn = (a: any): RowSeries => {
  // const metaImage = fetchMetadataImage(a); DO NOT!
  const total = a.nfts.totalCount
  const collectionNfts = a.nfts.nodes
  const sold = a.nfts.nodes.reduce(soldFn, 0)
  const unique = a.nfts.nodes.reduce(uniqueFn, new Set()).size
  const averagePrice = a.nfts.nodes.filter(onlyOwned).reduce(sumFn, 0) / (a.nfts.nodes.length || 1)
  const uniqueCollectors = [...new Set(a.nfts.nodes.map((nft: SimpleSeriesNFT) => nft.currentOwner))].length
  const floorPrice = Math.min(
    ...collectionNfts.map((nft: SimpleSeriesNFT) => Number(nft.price)).filter((price: number) => price > 0)
  )

  const volume = collectionNfts
    .map(onlyBuyEvents)
    .map((item: any, key: number) => {
      return (
        item.length && collectionNfts[key]?.events?.find(onlyListEvents).meta
      )
    })
    .reduce(reducer, 0)

  const dailyVolume = collectionNfts
    .map((nft: SimpleSeriesNFT) =>
      nft.events.filter((e: { interaction: string; timestamp: Date }) => {
        return (
          e.interaction === 'BUY' && new Date(e.timestamp) <= yesterdayDate
        )
      })
    )
    .map((item: any, key: number) => {
      return (
        item.length && collectionNfts[key]?.events?.find(onlyListEvents).meta
      )
    })
    .reduce(reducer, 0)

  const weeklyVolume = collectionNfts
    .map((nft: SimpleSeriesNFT) =>
      nft.events.filter((e: { interaction: string; timestamp: Date }) => {
        return (
          e.interaction === 'BUY' && new Date(e.timestamp) <= lastweekDate
        )
      })
    )
    .map((item: any, key: number) => {
      return (
        item.length && collectionNfts[key]?.events?.find(onlyListEvents).meta
      )
    })
    .reduce(reducer, 0)

  const monthlyVolume = collectionNfts
    .map((nft: SimpleSeriesNFT) =>
      nft.events.filter((e: { interaction: string; timestamp: Date }) => {
        return e.interaction === 'BUY' && new Date(e.timestamp) <= lastmonthDate
      })
    )
    .map((item: any, key: number) => {
      return (
        item.length && collectionNfts[key]?.events?.find(onlyListEvents).meta
      )
    })
    .reduce(reducer, 0)

  return {
    id: a.id,
    name: a.name,
    image: '', // NOPE
    metadata: a.metadata,
    volume,
    total,
    sold,
    unique,
    uniqueCollectors,
    averagePrice,
    floorPrice,
    dailyVolume,
    weeklyVolume,
    monthlyVolume,
    rank: sold * (unique / total)
  }
}

const formatNumber = (val: SimpleSeriesNFT) =>
  Number(
    formatBalance(
      val.price,
      store.getters.getChainProperties.tokenDecimals,
      false,
      true
    )
  )
const sumFn = (acc: number, val: SimpleSeriesNFT) => acc + formatNumber(val)
const soldFn = (acc: number, val: SimpleSeriesNFT) => val.issuer !== val.currentOwner ? acc + 1 : acc
const uniqueFn = (acc: Set<string>, val: SimpleSeriesNFT) => acc.add(val.metadata)
const onlyOwned = ({ issuer, currentOwner }: SimpleSeriesNFT) => issuer === currentOwner
const onlyBuyEvents = ({ events }: SimpleSeriesNFT) => events.filter((e: { interaction: string }) => e.interaction === 'BUY')
const onlyListEvents = (e: { interaction: string }) => e.interaction === 'LIST'
const reducer = (a: number, b: number): number => Number(a) + Number(b)

const yesterdayDate: Date = new Date(Date.now() - (1000 * 60 * 60 * 24 * 1))
const lastweekDate: Date = new Date(Date.now() - (1000 * 60 * 60 * 24 * 7))
const lastmonthDate: Date = new Date(Date.now() - (1000 * 60 * 60 * 24 * 30))
