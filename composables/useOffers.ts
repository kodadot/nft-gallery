import { addHours } from 'date-fns'

type NFTOfferStatus = 'ACTIVE' | 'EXPIRED' | 'WITHDRAWN' | 'ACCEPTED'

type NFTOffer = {
  id: string
  price: string
  expiration: string
  blockNumber: string
  status: NFTOfferStatus
  caller: string
  desired: {
    id: string
    name: string
    sn: string
    currentOwner: string
  }
}

export type NFTOfferItem = {
  expirationDate?: Date
} & NFTOffer

const BLOCKS_PER_HOUR = 300
const currentBlock = ref(0)

export default function ({ where = {}, limit = 100, disabled = computed(() => false) }: {
  where?: MaybeRef<Record<string, unknown>>
  limit?: number
  disabled?: ComputedRef<boolean>
}) {
  const variables = computed(() => ({
    where: unref(where),
    limit: limit,
  }))

  const {
    data,
    loading: fetching,
    refetch,
  } = useGraphql<{ offers: NFTOffer[] }>({
    queryName: 'offersList',
    variables: variables.value,
    disabled,
  })

  const offers = computed<NFTOfferItem[]>(() => {
    return data.value?.offers.map((offer) => {
      return {
        ...offer,
        expirationDate: currentBlock.value ? addHours(new Date(), (Number(offer.expiration) - currentBlock.value) / BLOCKS_PER_HOUR) : undefined,
      }
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
    offers,
    refetch,
    loading,
  }
}
