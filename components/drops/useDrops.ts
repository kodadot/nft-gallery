import { CollectionWithMeta } from '../rmrk/service/scheme'
import {
  type DropMintedStatus,
  GetDropsQuery,
  getDropById,
  getDropMintedStatus,
  getDropStatus,
  getDrops,
} from '@/services/fxart'
import unlockableCollectionById from '@/queries/subsquid/general/unlockableCollectionById.graphql'
import { chainPropListOf } from '@/utils/config/chain.config'
import { DropItem } from '@/params/types'
import { FUTURE_DROP_DATE } from '@/utils/drop'
import orderBy from 'lodash/orderBy'

export interface Drop {
  collection: CollectionWithMeta
  chain: string
  minted: number
  max: number
  disabled: number
  dropStartTime: Date
  price: string
  alias: string
  isMintedOut: boolean
  status: DropStatus
  image?: string
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
  DropStatus.MINTING_LIVE,
  DropStatus.SCHEDULED_SOON,
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

    dropsList.value.map(async (drop) => {
      const newDrop = await getFormattedDropItem(drop, drop)

      drops.value.push(newDrop)
      loaded.value = true
    })
  })

  const sortDrops = computed(() =>
    orderBy(
      drops.value,
      [(drop) => DROP_LIST_ORDER.indexOf(drop.status), 'alias'],
      ['asc', 'asc'],
    ),
  )

  return { drops: sortDrops, count, loaded }
}

const getFormattedDropItem = async (collection, drop: DropItem) => {
  const chainMax = collection?.max ?? FALLBACK_DROP_COLLECTION_MAX
  const { count } = await getDropStatus(drop.alias)
  const price = drop.price || 0
  const newDrop = {
    ...drop,
    collection: collection,
    max: chainMax,
    dropStartTime: count >= 5 ? Date.now() - 1e10 : FUTURE_DROP_DATE, // this is a bad hack to make the drop appear as "live" in the UI
    price,
    isMintedOut: count >= chainMax,
    isFree: !Number(price),
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

  if (now.valueOf() - drop.dropStartTime.valueOf() <= ONE_DAYH_IN_MS) {
    return DropStatus.SCHEDULED_SOON
  }

  return DropStatus.SCHEDULED
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

  const { existentialDeposit } = useChain()
  const { fetchMultipleBalance, currentChainBalance } = useMultipleBalance()

  const transferableDropChainBalance = computed(
    () => (Number(currentChainBalance.value) || 0) - existentialDeposit.value,
  )
  const meta = computed<number>(() => Number(drop.meta) || 0)
  const price = computed<number>(() => Number(drop.price) || 0)
  const minimumFunds = computed<number>(() => price.value || meta.value)
  const hasMinimumFunds = computed(
    () =>
      !minimumFunds.value ||
      transferableDropChainBalance.value >= minimumFunds.value,
  )
  const tokenDecimals = computed(() => chainProperties.tokenDecimals)
  const tokenSymbol = computed(() => chainProperties.tokenSymbol)

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
