import i18n from '@/utils/config/i18n'
import { Column, Row, SimpleSpotlightNFT } from './types'
import formatBalance from '@/utils/formatBalance'
import * as store from '~/store'
import { getVolume, pairListBuyEvent } from '@/utils/math'

export const columns: Column[] = [
  { field: 'id', label: i18n.t('spotlight.id') },
  { field: 'sold', label: i18n.t('spotlight.sold'), numeric: true },
  { field: 'unique', label: i18n.t('spotlight.unique'), numeric: true },
  { field: 'total', label: i18n.t('spotlight.total'), numeric: true },
  {
    field: 'averagePrice',
    label: i18n.t('spotlight.averagePrice'),
    numeric: true,
  },
  { field: 'count', label: i18n.t('spotlight.count'), numeric: true },
  { field: 'collectors', label: i18n.t('spotlight.collectors'), numeric: true },
  { field: 'rank', label: i18n.t('spotlight.score'), numeric: true },
]

export const nftFn = (a: any): Row => {
  const sold = a.nfts.nodes.reduce(soldFn, 0)
  const unique = a.nfts.nodes.reduce(uniqueFn, new Set()).size
  const total = a.nfts.totalCount
  const uniqueCollectors = a.nfts.nodes.reduce(
    uniqueCollectorFn,
    new Set()
  ).size
  const buyEvents = a.nfts.nodes.map(onlyEvents).map(pairListBuyEvent).flat()
  const volume = Number(getVolume(buyEvents))

  return {
    id: a.issuer,
    total,
    sold,
    unique,
    averagePrice:
      a.nfts.nodes.filter(onlyOwned).reduce(sumFn, 0) /
      (a.nfts.nodes.length || 1),
    count: 1,
    collectors: 0, // a.nfts.nodes.reduce(uniqueCollectorFn, new Set()),
    volume,
    rank: sold * (unique / total),
    uniqueCollectors,
  }
}

const tokenDecimals = store.getters[
  'chain/getChainPropertiesTokenDecimals'
] as any
const formatNumber = (val: SimpleSpotlightNFT) =>
  Number(formatBalance(val.price, tokenDecimals, false, true))
const sumFn = (acc: number, val: SimpleSpotlightNFT) => {
  return acc + formatNumber(val)
}
const uniqueCollectorFn = (acc: Set<string>, val: SimpleSpotlightNFT) =>
  val.issuer !== val.currentOwner ? acc.add(val.currentOwner) : acc
const uniqueFn = (acc: Set<string>, val: SimpleSpotlightNFT) =>
  acc.add(val.metadata)
const soldFn = (acc: number, val: SimpleSpotlightNFT) =>
  val.issuer !== val.currentOwner ? acc + 1 : acc
const onlyOwned = ({ issuer, currentOwner }: SimpleSpotlightNFT) =>
  issuer === currentOwner
const onlyEvents = (nft: SimpleSpotlightNFT) => nft.events
