import { addHours } from 'date-fns'

type TradeStatus = 'ACTIVE' | 'EXPIRED' | 'WITHDRAWN' | 'ACCEPTED'

type TradeToken = {
  id: string
  name: string
  sn: string
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
  desired: TradeToken
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
}

export const TRADES_QUERY_MAP: Record<TradeType, { queryName: string, dataKey: string }> = {
  [TradeType.SWAP]: {
    queryName: 'swapsList',
    dataKey: 'swaps',
  },
  [TradeType.OFFER]: {
    queryName: 'offersList',
    dataKey: 'offers',
  },
}

const BLOCKS_PER_HOUR = 300
const currentBlock = ref(0)

export default function ({ where = {}, limit = 100, disabled = computed(() => false), type = TradeType.SWAP }: {
  where?: MaybeRef<Record<string, unknown>>
  limit?: number
  disabled?: ComputedRef<boolean>
  type?: TradeType
}) {
  const variables = computed(() => ({
    where: unref(where),
    limit: limit,
  }))

  const { queryName, dataKey } = TRADES_QUERY_MAP[type]

  const {
    data,
    loading: fetching,
    refetch,
  } = useGraphql<{ offers: BaseTrade[] }>({
    queryName,
    variables: variables.value,
    disabled,
  })

  const items = computed<TradeNftItem[]>(() => {
    return data.value?.[dataKey]?.map((trade) => {
      return {
        ...trade,
        expirationDate: currentBlock.value ? addHours(new Date(), (Number(trade.expiration) - currentBlock.value) / BLOCKS_PER_HOUR) : undefined,
        offered: trade.nft,
        type,
      } as TradeNftItem
    }) || []
  })

  async function getCurrentBlock() {
    const api = await useApi().apiInstance.value
    const { number } = await api.rpc.chain.getHeader()
    return number.toNumber()
  }

  const loading = computed(() => !currentBlock.value || fetching.value)

  if (!currentBlock.value) {
    getCurrentBlock().then(b => currentBlock.value = b)
  }

  if (isRef(where)) {
    watch([where, disabled], () => {
      if (!disabled.value) {
        refetch(variables.value)
      }
    })
  }

  return {
    items,
    refetch,
    loading,
  }
}
