import { addHours } from 'date-fns'
import { formatToNow } from '@/utils/format/time'

type NFTOffer = {
  id: string
  price: string
  expiration: string
  blockNumber: string
  status: string
  caller: string
  desired: {
    id: string
    currentOwner: string
  }
}

export type NFTOfferItem = {
  time: string
} & NFTOffer

const BLOCKS_PER_HOUR = 300
const currentBlock = ref(0)

export default function ({ byNftId, where = {}, limit = 100 }: {
  byNftId?: string
  where?: Record<string, unknown>
  limit?: number
}) {
  if (byNftId) {
    Object.assign(where, {
      desired: { id_eq: byNftId },
    })
  }

  const {
    data,
    loading: fetching,
    refetch,
  } = useGraphql<{ offers: NFTOffer[] }>({
    queryName: 'offersList',
    variables: {
      where: where,
      limit: limit,
    },
  })

  const offers = computed<NFTOfferItem[]>(() => {
    return data.value?.offers.map(offer => ({
      ...offer,
      time: currentBlock.value ? formatToNow(addHours(new Date(), (Number(offer.expiration) - currentBlock.value) / BLOCKS_PER_HOUR), false) : '',
    })) || []
  })

  async function getCurrentBlock() {
    const api = await useApi().apiInstance.value
    const { number } = await api.rpc.chain.getHeader()
    return number.toNumber()
  }

  const loading = computed(() => offers.value.length ? !currentBlock.value : !currentBlock.value || fetching.value)

  if (!currentBlock.value) {
    getCurrentBlock().then(b => currentBlock.value = b)
  }

  return {
    offers,
    refetch,
    loading,
  }
}
