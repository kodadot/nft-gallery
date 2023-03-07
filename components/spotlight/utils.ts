import { Row, SimpleSpotlightNFT } from './types'
import formatBalance from '@/utils/format/balance'
import { getVolume, pairListBuyEvent } from '@/utils/math'
import { useChainStore } from '@/stores/chain'

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
    collections: a.collections,
  }
}

const chainStore = useChainStore()
const tokenDecimals = chainStore.getChainPropertiesTokenDecimals
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
