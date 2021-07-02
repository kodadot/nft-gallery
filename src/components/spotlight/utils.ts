import i18n from '@/i18n';
import { Column, Row, SimpleSpotlightNFT } from './types';
import formatBalance from '@/utils/formatBalance'
import store from '@/store'

export const columns: Column[] = [
  { field: 'id', label: i18n.t('spotlight.id') },
  { field: 'sold', label: i18n.t('spotlight.sold'), numeric: true },
  { field: 'unique', label: i18n.t('spotlight.unique'), numeric: true },
  { field: 'total', label: i18n.t('spotlight.total'), numeric: true },
  { field: 'averagePrice', label: i18n.t('spotlight.averagePrice'), numeric: true },
  { field: 'count', label: i18n.t('spotlight.count'), numeric: true },
  { field: 'collectors', label: i18n.t('spotlight.collectors'), numeric: true },
  { field: 'rank', label: i18n.t('spotlight.rank'), numeric: true },
]


export const nftFn = (a: any): Row => ({
  id: a.issuer,
  total: a.nfts.totalCount,
  sold: a.nfts.nodes.reduce(soldFn, 0),
  unique: a.nfts.nodes.reduce(uniqueFn, new Set()).size,
  averagePrice: a.nfts.nodes.reduce(averageFn, 0),
  count: 1,
  collectors: 1,
  rank: 1
})

const formatNumber = (val: SimpleSpotlightNFT) => Number(formatBalance(val.price, store.getters.getChainProperties.tokenDecimals, false, true))
const averageFn = (acc: number, val: SimpleSpotlightNFT) => (acc + formatNumber(val)) / 2;
const uniqueFn = (acc: Set<string>, val: SimpleSpotlightNFT) => acc.add(val.metadata)
const soldFn = (acc: number, val: SimpleSpotlightNFT) => val.issuer !== val.currentOwner ? acc + 1 : acc
