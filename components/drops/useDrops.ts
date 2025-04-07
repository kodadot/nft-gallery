import { getDropAttributes } from './utils'
import { chainPropListOf } from '@/utils/config/chain.config'
import { prefixToToken } from '@/components/common/shoppingCart/utils'
import { useDropStore } from '@/stores/drop'
import { getChainName } from '@/utils/chain'

export enum DropStatus {
  MINTING_ENDED = 'minting_ended',
  MINTING_LIVE = 'minting_live',
  COMING_SOON = 'coming_soon', // live but disabled by backend
  SCHEDULED_SOON = 'scheduled_soon', // live in < 24h
  SCHEDULED = 'scheduled', // live in > 24
  UNSCHEDULED = 'unscheduled',
}

export function useDrop(alias?: string) {
  const { params } = useRoute()
  const dropStore = useDropStore()

  const drop = computed({
    get: () => dropStore.drop,
    set: value => dropStore.setDrop(value),
  })

  const chainName = computed(() => getChainName(drop.value?.chain ?? 'ahp'))
  const token = computed(() => prefixToToken[drop.value?.chain ?? 'ahp'])

  const fetchDrop = async () => {
    const dropAttributes = await getDropAttributes(alias ?? params.id.toString())

    if (dropAttributes) {
      drop.value = dropAttributes
    }
  }

  watch(() => params.id, fetchDrop)

  return {
    drop,
    fetchDrop,
    chainName,
    token,
  }
}

export const useDropMinimumFunds = (amount = ref(1)) => {
  const { drop } = useDrop()
  const { urlPrefix } = usePrefix()
  const { itemDeposit } = useDeposit(urlPrefix)

  const chainProperties = computed(() =>
    chainPropListOf(drop.value?.chain ?? 'ahp'),
  )
  const { existentialDeposit } = useChain()
  const { fetchMultipleBalance, transferableCurrentChainBalance }
    = useMultipleBalance()

  const price = computed<number>(() => Number(drop.value?.price) || 0)
  const minimumFunds = computed<number>(() => amount.value * (price.value + itemDeposit.value))
  const hasMinimumFunds = computed(
    () =>
      !minimumFunds.value
      || (transferableCurrentChainBalance.value ?? 0) >= minimumFunds.value,
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
  }
  else if (hexId.length === 3) {
    const firstDigit = hexId.substring(0, 1)
    constructedNumber
      = hexId.padEnd(4, '0').split('').splice(1, 3).join('') + firstDigit
  }
  else if (hexId.length === 4) {
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
