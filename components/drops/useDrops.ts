import { GetDropsQuery, getDropById, getDrops } from '@/services/fxart'
import unlockableCollectionById from '@/queries/subsquid/general/unlockableCollectionById.graphql'
import collectionByIdMinimal from '@/queries/subsquid/general/collectionByIdMinimal.graphql'
import { chainPropListOf } from '@/utils/config/chain.config'
import { DropItem } from '@/params/types'
import orderBy from 'lodash/orderBy'
import type { Prefix } from '@kodadot1/static'
import { prefixToToken } from '@/components/common/shoppingCart/utils'
import { useDropStore } from '@/stores/drop'
import { getChainName } from '@/utils/chain'
import { WritableComputedRef } from 'nuxt/dist/app/compat/capi'
import { parseCETDate } from './utils'

export interface Drop {
  collection: DropItem
  chain: Prefix
  minted: number
  max: number
  disabled: number
  dropStartTime?: Date
  price: string
  alias: string
  name: string
  isMintedOut: boolean
  status: DropStatus
  image?: string
  banner?: string
}

export enum DropStatus {
  MINTING_ENDED = 'minting_ended',
  MINTING_LIVE = 'minting_live',
  COMING_SOON = 'coming_soon', // live but disabled by backend
  SCHEDULED_SOON = 'scheduled_soon', // live in < 24h
  SCHEDULED = 'scheduled', // live in > 24
  UNSCHEDULED = 'unscheduled',
}

const DROP_LIST_ORDER = [
  DropStatus.SCHEDULED_SOON,
  DropStatus.MINTING_LIVE,
  DropStatus.SCHEDULED,
  DropStatus.COMING_SOON,
  DropStatus.MINTING_ENDED,
  DropStatus.UNSCHEDULED,
]

const ONE_DAYH_IN_MS = 24 * 60 * 60 * 1000

export function useDrops(query?: GetDropsQuery) {
  const drops = ref<Drop[]>([])
  const dropsList = ref<DropItem[]>([])
  const count = computed(() => dropsList.value.length)
  const loaded = ref(false)

  onBeforeMount(async () => {
    dropsList.value = await getDrops(query)

    const formattedDrops = await Promise.all(
      dropsList.value.map(async (drop) => getFormattedDropItem(drop, drop)),
    )

    drops.value = formattedDrops

    loaded.value = true
  })

  const sortDrops = computed(() =>
    orderBy(
      drops.value,
      [(drop) => DROP_LIST_ORDER.indexOf(drop.status)],
      ['asc'],
    ),
  )

  return { drops: sortDrops, count, loaded }
}

export const getFormattedDropItem = async (collection, drop: DropItem) => {
  const chainMax = collection?.max ?? FALLBACK_DROP_COLLECTION_MAX

  let count = drop.minted
  if (!count) {
    count = await fetchDropMintedCount(drop)
  }
  const price = drop.price || 0
  let dropStartTime = drop.start_at ? parseCETDate(drop.start_at) : undefined

  if (count >= 5) {
    dropStartTime = new Date(Date.now() - 1e10) // this is a bad hack to make the drop appear as "live" in the UI
  }

  const newDrop = {
    ...drop,
    collection: collection,
    max: chainMax,
    dropStartTime,
    price,
    isMintedOut: count >= chainMax,
    isFree: !Number(price),
    minted: count,
  } as any

  Object.assign(newDrop, { status: getLocalDropStatus(newDrop) })

  return newDrop
}

const getLocalDropStatus = (drop: Omit<Drop, 'status'>): DropStatus => {
  const now = new Date()

  if (drop.minted === drop.max) {
    return DropStatus.MINTING_ENDED
  }

  if (!drop.dropStartTime) {
    return DropStatus.UNSCHEDULED
  }

  if (drop.dropStartTime <= now) {
    if (drop.disabled) {
      return DropStatus.COMING_SOON
    }
    return DropStatus.MINTING_LIVE
  }

  if (drop.dropStartTime.valueOf() - now.valueOf() <= ONE_DAYH_IN_MS) {
    return DropStatus.SCHEDULED_SOON
  }

  return DropStatus.SCHEDULED
}

export const getDropDetails = async (alias: string) => {
  const drop = await getDropById(alias)

  const { data: collectionData } = await useAsyncQuery({
    clientId: drop.chain,
    query: unlockableCollectionById,
    variables: {
      id: drop.collection,
    },
  })

  const { collectionEntity } = collectionData.value

  return getFormattedDropItem(collectionEntity, drop)
}

export function useDrop(alias?: string) {
  const { params } = useRoute()
  const dropStore = useDropStore()

  const drop = computed({
    get: () => dropStore.drop,
    set: (value) => dropStore.setDrop(value),
  })

  const chainName = computed(() => getChainName(drop.value?.chain ?? 'ahp'))
  const token = computed(() => prefixToToken[drop.value?.chain ?? 'ahp'])

  const fetchDrop = async () => {
    drop.value = await getDropById(alias ?? params.id.toString())
  }

  watch(() => params.id, fetchDrop)

  return {
    drop,
    fetchDrop,
    chainName,
    token,
  }
}

export const fetchDropMintedCount = async (
  drop: Pick<DropItem, 'collection' | 'chain'>,
) => {
  if (!drop.collection || !drop.chain) {
    return 0
  }

  const { data } = await useAsyncQuery<{
    collectionEntityById: { nftCount: number | undefined }
  }>({
    query: collectionByIdMinimal,
    variables: {
      id: drop.collection,
    },
    clientId: drop.chain,
  })

  return data.value?.collectionEntityById.nftCount
}

const subscribeDropMintedCount = (
  drop: Pick<DropItem, 'collection'>,
  onChange: (count: number | undefined) => void,
) => {
  return useSubscriptionGraphql({
    query: `
      collectionEntityById(id: "${drop.collection}") {
        nftCount
      }
     `,
    onChange: ({ data }) => {
      onChange(data.collectionEntityById?.nftCount)
    },
  })
}

export const useDropStatus = (
  drop: WritableComputedRef<{ collection: string; chain: Prefix }>,
) => {
  const dropStore = useDropStore()

  const dropStatusSubscription = ref<{
    collection: string | undefined
    unsubscribe: () => void
  }>({
    collection: undefined,
    unsubscribe: () => {},
  })

  const mintsCount = computed({
    get: () => dropStore.mintsCount,
    set: (value) => dropStore.setMintedDropCount(value),
  })

  const subscribeDropStatus = () => {
    watch(
      () => drop.value,
      (drop) => {
        if (drop) {
          if (drop.collection !== dropStatusSubscription.value.collection) {
            dropStatusSubscription.value.unsubscribe?.()
          }

          dropStatusSubscription.value.collection = drop.collection
          dropStatusSubscription.value.unsubscribe = subscribeDropMintedCount(
            drop,
            (count) => {
              mintsCount.value = count ?? 0
            },
          )
        }
      },
    )

    onUnmounted(() => dropStatusSubscription.value.unsubscribe?.())
  }

  return {
    mintsCount,
    subscribeDropStatus,
  }
}

export const useDropMinimumFunds = (amount = ref(1)) => {
  const { drop } = useDrop()

  const chainProperties = computed(() =>
    chainPropListOf(drop.value?.chain ?? 'ahp'),
  )
  const { existentialDeposit } = useChain()
  const { fetchMultipleBalance, transferableCurrentChainBalance } =
    useMultipleBalance()

  const meta = computed<number>(() => Number(drop.value?.meta) || 0)
  const price = computed<number>(() => Number(drop.value?.price) || 0)
  const minimumFunds = computed<number>(() =>
    price.value ? amount.value * price.value : meta.value,
  )
  const hasMinimumFunds = computed(
    () =>
      !minimumFunds.value ||
      (transferableCurrentChainBalance.value ?? 0) >= minimumFunds.value,
  )
  const tokenDecimals = computed(() => chainProperties.value.tokenDecimals)
  const tokenSymbol = computed(() => chainProperties.value.tokenSymbol)

  const { formatted: formattedMinimumFunds } = useAmount(
    minimumFunds,
    tokenDecimals,
    tokenSymbol,
  )

  const { formatted: formattedExistentialDeposit } = useAmount(
    existentialDeposit,
    tokenDecimals,
    tokenSymbol,
  )

  onBeforeMount(fetchMultipleBalance)

  return {
    minimumFunds,
    hasMinimumFunds,
    formattedMinimumFunds,
    formattedExistentialDeposit,
  }
}

// Convert the collection to hex
// Construct the number - if is length 2 - pad it right with two zeros
// If the length is 3 - pad it right with one zero and put the first digit in the end
// If the lenght is 4 - swap the pair - aka first two letters go last
// When you have number from step two construct the full format - 0x00${theMagic}0000
const convertCollectionIdToMagicId = (id: string) => {
  const hexId = Number(id).toString(16)
  let constructedNumber
  if (hexId.length === 2) {
    constructedNumber = hexId.padEnd(4, '00')
  } else if (hexId.length === 3) {
    const firstDigit = hexId.substring(0, 1)
    constructedNumber =
      hexId.padEnd(4, '0').split('').splice(1, 3).join('') + firstDigit
  } else if (hexId.length === 4) {
    constructedNumber = hexId.substring(2) + hexId.substring(0, 2)
  }
  return `0x00${constructedNumber}0000`
}

export const useHolderOfCollectionDrop = () => {
  const { apiInstance } = useApi()

  const isNftClaimed = async (
    sn: string,
    holderOfCollectionId: string,
    collectionId: string,
  ) => {
    const api = await apiInstance.value

    const claimed = await api.query.nfts.attribute(
      holderOfCollectionId,
      sn,
      { Pallet: null },
      convertCollectionIdToMagicId(collectionId),
    )

    const wasUsed = claimed.toHuman()

    return wasUsed !== null
  }

  return { isNftClaimed }
}

export const useRelatedActiveDrop = (collectionId: string, chain: Prefix) => {
  const { drops } = useDrops({
    chain: [chain],
  })

  const relatedActiveDrop = computed(() =>
    drops.value.find(
      (drop) =>
        drop?.collection.collection === collectionId &&
        !drop.disabled &&
        drop.status === DropStatus.MINTING_LIVE,
    ),
  )

  const relatedEndedDrop = computed(() =>
    drops.value.find(
      (drop) =>
        drop?.collection.collection === collectionId &&
        drop.status === DropStatus.MINTING_ENDED,
    ),
  )

  return {
    relatedActiveDrop,
    relatedEndedDrop,
  }
}
