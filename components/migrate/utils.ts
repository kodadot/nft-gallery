import { availablePrefixWithIcon } from '@/utils/chain'
import type { Prefix } from '@kodadot1/static'
import collectionMigrateReady from '@/queries/subsquid/general/collectionMigrateReady.graphql'

export type Steps =
  | 'init'
  | 'step1'
  | 'step1-check-id'
  | 'step2'
  | 'step2-migrate'
  | 'step3'
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

export function calculateIterations(itemCount = '0', batchSize = 200) {
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
