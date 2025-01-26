import type { DocumentNode } from 'graphql'
import { addHours } from 'date-fns'
import swapsList from '@/queries/subsquid/general/swapsList.graphql'
import offersList from '@/queries/subsquid/general/offersList.graphql'

export enum TradeStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  WITHDRAWN = 'WITHDRAWN',
  ACCEPTED = 'ACCEPTED',
}

export type TradeToken = {
  id: string
  name: string
  sn: string
  currentOwner: string
  image: string
  collection: {
    id: string
  }
  meta: Record<string, unknown>
}

export type TradeConsidered = {
  id: string
  name: string
  currentOwner: string
  image: string
}

type BaseTrade = {
  id: string
  price: string
  expiration: string
  blockNumber: string
  status: TradeStatus
  caller: string
  offered: TradeToken
  desired: TradeToken | null
  considered: TradeConsidered
}

export enum TradeDesiredType {
  TOKEN,
  COLLECTION,
}

export enum TradeType {
  SWAP,
  OFFER,
}

export type Swap = BaseTrade & {
  surcharge: string | null
}

type Offer = BaseTrade

type Trade = Swap | Offer

export type TradeNftItem<T = Trade> = T & {
  expirationDate?: Date
  type: TradeType
  desiredType: TradeDesiredType
  isEntireCollectionDesired: boolean
  isExpired: boolean
}

export const TRADES_QUERY_MAP: Record<TradeType, { queryDocument: DocumentNode, dataKey: string }> = {
  [TradeType.SWAP]: {
    queryDocument: swapsList,
    dataKey: 'swaps',
  },
  [TradeType.OFFER]: {
    queryDocument: offersList,
    dataKey: 'offers',
  },
}

const BLOCKS_PER_HOUR = 300

export default function ({ where = {}, limit = 100, disabled = computed(() => false), type = TradeType.SWAP }: {
  where?: MaybeRef<Record<string, unknown>>
  limit?: number
  disabled?: ComputedRef<boolean>
  type?: TradeType
}) {
  const { queryDocument, dataKey } = TRADES_QUERY_MAP[type]

  const { client } = usePrefix()
  const currentBlock = useCurrentBlock()

  const variables = computed(() => ({
    where: unref(where),
    limit: limit,
  }))

  const {
    result: data,
    loading: fetching,
  } = useQuery<{ offers: Offer[] } | { swpas: Swap[] }>(
    queryDocument,
    variables,
    computed(() => ({
      enabled: !disabled.value,
      clientId: client.value,
    })),
  )

  const items = computed<TradeNftItem[]>(() => {
    return data.value?.[dataKey]?.map((trade) => {
      const desiredType = trade.desired ? TradeDesiredType.TOKEN : TradeDesiredType.COLLECTION

      return {
        ...trade,
        expirationDate: currentBlock.value ? addHours(new Date(), (Number(trade.expiration) - currentBlock.value) / BLOCKS_PER_HOUR) : undefined,
        offered: trade.nft,
        desiredType: desiredType,
        isEntireCollectionDesired: desiredType === TradeDesiredType.COLLECTION,
        // Check block number to handle trades that are expired but not yet updated in indexer
        // @see https://github.com/kodadot/stick/blob/9eac12938c47bf0e66e93760231208e4249d8637/src/mappings/utils/cache.ts#L127
        isExpired: trade.status === TradeStatus.EXPIRED || currentBlock.value > Number(trade.expiration),
        type,
      } as TradeNftItem
    }) || []
  })

  const loading = computed(() => !currentBlock.value || fetching.value)

  return {
    items,
    loading,
  }
}
