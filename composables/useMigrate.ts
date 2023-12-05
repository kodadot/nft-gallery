import type { Prefix } from '@kodadot1/static'
import { availablePrefixWithIcon } from '@/utils/chain'
import format from '@/utils/format/balance'
import collectionMigrateReady from '@/queries/subsquid/general/collectionMigrateReady.graphql'

export type Steps =
  | 'init'
  | 'step1'
  | 'step1-check-id'
  | 'step2'
  | 'step2-migrate'
  | 'step3'
  | 'step3-burn'
  | 'step3-burn-collection'
  | 'step4'

export const iconIdle = {
  icon: 'circle',
  class: 'has-text-grey',
}
export const iconLoading = {
  icon: 'spinner-third',
  class: 'fa-spin',
}
export const iconSuccess = {
  icon: 'check',
  class: 'has-text-k-green',
}

export const BATCH_SIZE = 200

export function calculateIterations(itemCount = '0', batchSize = BATCH_SIZE) {
  const items = parseInt(itemCount || '0')

  if (items <= 0 || batchSize <= 0) {
    return 0
  }

  return Math.ceil(items / batchSize)
}

type CollectionsReady = {
  collectionEntities?: {
    id: string
    name: string
    metadata: string
    meta?: {
      id: string
      image: string
      animationUrl: string
      name: string
      description: string
    }
    nftsOwned?: {
      id: string
    }[]
    nfts?: {
      id: string
      name?: string
      currentOwner?: string
      meta?: {
        id: string
        image: string
      }
    }[]
  }[]
}

export async function useCollectionReady(prefix = '', account = '') {
  const { accountId } = useAuth()
  const { client } = usePrefix()

  const { data } = await useAsyncQuery<CollectionsReady>({
    query: collectionMigrateReady,
    variables: {
      account: account || accountId.value,
    },
    clientId: prefix || client.value,
  })

  const collections = computed(() => {
    if (data.value?.collectionEntities?.length) {
      return data.value?.collectionEntities
    }

    return []
  })

  return {
    collections,
  }
}

const parseDeposit = (deposit, decimals) => {
  return parseFloat(format(deposit, decimals, false))
}

export function useMigrateDeposit(
  prefix: ComputedRef<Prefix>,
  itemCount: number,
  account = '',
) {
  const {
    balance,
    itemDeposit,
    existentialDeposit,
    metadataDeposit,
    totalCollectionDeposit,
    chainSymbol,
    chain,
  } = useDeposit(prefix)
  const fiatStore = useFiatStore()
  const preferencesStore = usePreferencesStore()

  const route = useRoute()
  const collectionOwner = route.query.collectionOwner?.toString()

  const chainDecimals = computed(() => {
    if (chain.value?.tokenDecimals) {
      return chain.value.tokenDecimals
    }

    return 12
  })

  const chainItemDeposit = computed(() =>
    parseDeposit(
      (metadataDeposit.value + itemDeposit.value + existentialDeposit.value) *
        itemCount,
      chainDecimals.value,
    ),
  )

  const chainTokenPrice = computed(() =>
    Number(fiatStore.getCurrentTokenValue(chainSymbol.value) ?? 0),
  )

  const kodadotFee = computed(() =>
    parseDeposit(
      ((preferencesStore.hasSupport ? BASE_FEE : 0) / chainTokenPrice.value) *
        Math.pow(10, chainDecimals.value),
      chainDecimals.value,
    ),
  )

  const chainNetworkFee = computedAsync(async () => {
    if (account) {
      const fee = await getTransitionFee(account, [''], chainDecimals.value)
      return parseDeposit(parseInt(fee) * itemCount, chainDecimals.value)
    }

    return 0
  })

  const totalChain = computed(() => {
    let total =
      chainNetworkFee.value + chainItemDeposit.value + kodadotFee.value

    if (!collectionOwner) {
      total += parseFloat(totalCollectionDeposit.value)
    }

    if (isNaN(total)) {
      return 0
    }

    return parseFloat(total.toString()).toFixed(4)
  })

  const totalChainUsd = computed(() => {
    const amount =
      parseFloat(totalChain.value.toString()) * chainTokenPrice.value
    return parseFloat(amount.toString()).toFixed(1)
  })

  return {
    balance,
    chainItemDeposit,
    chainNetworkFee,
    chainSymbol,
    kodadotFee,
    totalChain,
    totalChainUsd,
    totalCollectionDeposit,
  }
}

const source = availablePrefixWithIcon().filter(
  (item) => item.value === 'ksm' || item.value === 'rmrk',
)
const destination = availablePrefixWithIcon().filter(
  (item) => item.value === 'ahp' || item.value === 'ahk',
)

// set shared state here
const useSourceSelected = () =>
  useState('sourceSelected', () =>
    availablePrefixWithIcon().find((item) => item.value === 'ksm'),
  )
const useDestinationSelected = () =>
  useState('destinationSelected', () =>
    availablePrefixWithIcon().find((item) => item.value === 'ahp'),
  )

export const toReview = ({
  collectionId,
  itemCount,
  collectionOwner = '',
  setDestination = '',
}) => {
  const sourceSelected = useSourceSelected()
  const destinationSelected = useDestinationSelected()
  const { accountId } = useAuth()

  navigateTo({
    path: '/migrate/review',
    query: {
      accountId: accountId.value,
      collectionId: collectionId,
      source: sourceSelected.value?.value,
      destination: setDestination || destinationSelected.value?.value,
      itemCount,
      collectionOwner,
    },
  })
}

// default composables
export default function useMigrate() {
  const sourceSelected = useSourceSelected()
  const destinationSelected = useDestinationSelected()
  const { urlPrefix, setUrlPrefix } = usePrefix()

  watchEffect(() => {
    const chain = sourceSelected.value?.value

    if (chain !== urlPrefix.value) {
      setUrlPrefix(chain as Prefix)
    }

    if (chain === 'ahk') {
      destinationSelected.value = destination.find(
        (item) => item.value === 'ahp',
      )
    }

    if (chain === 'ahp') {
      destinationSelected.value = destination.find(
        (item) => item.value === 'ahk',
      )
    }
  })

  return {
    source,
    sourceSelected,
    destination,
    destinationSelected,
  }
}
