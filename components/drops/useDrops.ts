import { CollectionWithMeta } from '../rmrk/service/scheme'
import {
  DropMintedStatus,
  getDropById,
  getDropMintedStatus,
  getDropStatus,
  getDrops,
} from '@/services/waifu'
import unlockableCollectionById from '@/queries/subsquid/general/unlockableCollectionById.graphql'
import { existentialDeposit } from '@kodadot1/static'
import { chainPropListOf } from '@/utils/config/chain.config'
import { DropItem } from '@/params/types'

export interface Drop {
  collection: CollectionWithMeta
  chain: string
  minted: number
  max: number
  disabled: number
  dropStartTime: Date
  price: string
  alias: string
}

const futureDate = new Date()
futureDate.setDate(futureDate.getDate() * 7) // i weeks in the future

export function useDrops() {
  const drops = ref<Drop[]>([])
  onMounted(async () => {
    const dropsList = await getDrops()

    dropsList.forEach((drop) => {
      const { result: collectionData } = useQuery(
        unlockableCollectionById,
        { id: drop.collection },
        { clientId: drop.chain },
      )

      watchEffect(async () => {
        if (collectionData.value?.collectionEntity) {
          const { collectionEntity } = collectionData.value
          const newDrop = await getFormattedDropItem(collectionEntity, drop)
          drops.value.push(newDrop)
        }
      })
    }, [])
  })

  return drops
}

const getFormattedDropItem = async (collection, drop: DropItem) => {
  const chainMax = collection?.max ?? FALLBACK_DROP_COLLECTION_MAX
  const { count } = await getDropStatus(drop.alias)
  const price = ['paid', 'generative'].includes(drop.type) ? drop.meta : '0'
  return {
    ...drop,
    collection: collection,
    minted: Math.min(count, chainMax),
    max: chainMax,
    dropStartTime: new Date(2023, 5, 6),
    price,
    isMintedOut: count >= chainMax,
    isFree: !Number(price),
  }
}

export const getDropDetails = async (alias: string) => {
  const drop = await useDrop(alias)

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

export async function useDrop(id: string) {
  const drop = await getDropById(id)

  return drop
}

export const useDropStatus = (id: string) => {
  const currentAccountMintedToken = ref<DropMintedStatus | null>(null)
  const mintedDropCount = ref(0)
  const { accountId } = useAuth()

  const fetchDropStatus = async () => {
    const { count } = await getDropStatus(id)
    mintedDropCount.value = count
    currentAccountMintedToken.value = accountId.value
      ? await getDropMintedStatus(id, accountId.value)
      : null
  }
  onBeforeMount(fetchDropStatus)

  watch(accountId, fetchDropStatus)

  return {
    currentAccountMintedToken,
    mintedDropCount,
    fetchDropStatus,
  }
}

export const useDropMinimumFunds = (drop) => {
  const chainProperties = chainPropListOf(drop.chain)

  const { chainBalances } = useTeleport()
  const { urlPrefix } = usePrefix()
  const { fetchMultipleBalance } = useMultipleBalance()

  const currentChain = computed(() => prefixToChainMap[drop.chain])
  const meta = computed(() => Number(drop.meta) || 0)
  const currentChainBalance = computed(
    () =>
      (currentChain.value && Number(chainBalances[currentChain.value]())) || 0,
  )
  const minimumFunds = computed<number>(() => meta.value || 0)
  const transferableDropChainBalance = computed(
    () => currentChainBalance.value - existentialDeposit[urlPrefix.value],
  )
  const hasMinimumFunds = computed(
    () =>
      !minimumFunds.value ||
      transferableDropChainBalance.value >= minimumFunds.value,
  )

  const { formatted: formattedMinimumFunds } = useAmount(
    meta,
    computed(() => chainProperties.tokenDecimals),
    computed(() => chainProperties.tokenSymbol),
    2,
  )

  onBeforeMount(fetchMultipleBalance)

  return {
    minimumFunds,
    hasMinimumFunds,
    formattedMinimumFunds,
  }
}
