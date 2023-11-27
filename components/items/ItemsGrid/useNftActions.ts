import nftById from '@/queries/subsquid/general/nftById.graphql'
import listCount from '@/queries/subsquid/general/countOfTokenNftsToList.graphql'
import nftListWithSearch from '@/queries/subsquid/ahk/nftListWithSearch.graphql'
import { TokenId } from '@/components/rmrk/service/scheme'

export type NFTWitToken = NFTWithMetadata & TokenId
export const isStack = (entity: TokenEntity) => entity.supply > 1

export const isAvailableToBuy = (entity: TokenEntity) =>
  Number(entity.cheapest.price) > 0

const tokensNftsCache = new Map<string, NFTWithMetadata[]>()

export const fetchNft = async (nftId: string): Promise<NFTWithMetadata> => {
  const { client } = usePrefix()

  const { data } = await useAsyncQuery<{ nftEntity: NFTWithMetadata }>({
    query: nftById,
    variables: {
      id: nftId,
    },
    clientId: client.value,
  })

  return data.value.nftEntity
}

export const prepareListingQuery = (
  entities: TokenEntity[],
  isThereAnythingToList: boolean,
) => {
  const { accountId } = useAuth()

  const tokenSearchTerm = { id_in: entities.map((n) => n.id) }

  const variables = {
    first: 10000, // some large number
    search: [
      {
        token: tokenSearchTerm,
        currentOwner_eq: accountId.value,
        burned_eq: false,
      },
    ],
  }

  const searchKey = isThereAnythingToList ? 'price_eq' : 'price_gt'
  variables.search[0][searchKey] = '0'

  return {
    query: nftListWithSearch,
    variables,
  }
}

const getCachedAndMissingEntities = (
  entities: TokenEntity[],
): { cachedResults: NFTWithMetadata[]; missingEntities: TokenEntity[] } => {
  const cachedResults: NFTWithMetadata[] = []
  const missingEntities: TokenEntity[] = []

  entities.forEach((entity) => {
    if (tokensNftsCache.has(entity.id)) {
      cachedResults.push(...tokensNftsCache.get(entity.id)!)
    } else {
      missingEntities.push(entity)
    }
  })

  return { cachedResults, missingEntities }
}

const fetchMissingEntities = async (
  missingEntities: TokenEntity[],
): Promise<NFTWitToken[]> => {
  const { query, variables } = prepareListingQuery(
    missingEntities,
    await checkIfAnythingToList(missingEntities),
  )
  const { client } = usePrefix()

  const { data } = await useAsyncQuery<{ nFTEntities: NFTWitToken[] }>({
    query: query,
    variables: variables,
    clientId: client.value,
  })

  return data.value.nFTEntities
}

const groupFetchedResults = (
  fetchedResults: NFTWitToken[],
): { [entityId: string]: NFTWitToken[] } => {
  const grouped: { [entityId: string]: NFTWitToken[] } = {}

  fetchedResults.forEach((fetchedResult) => {
    const entityId = fetchedResult.token?.id
    if (entityId) {
      if (!grouped[entityId]) {
        grouped[entityId] = []
      }
      grouped[entityId].push(fetchedResult)
    }
  })

  return grouped
}

export const getTokensNfts = async (
  entities: TokenEntity[],
): Promise<NFTWithMetadata[]> => {
  const { cachedResults, missingEntities } =
    getCachedAndMissingEntities(entities)

  if (missingEntities.length === 0) {
    return cachedResults
  }

  const fetchedResults = await fetchMissingEntities(missingEntities)

  const groupedResults = groupFetchedResults(fetchedResults)

  Object.entries(groupedResults).forEach(([entityId, nfts]) => {
    const existingDataForEntity = tokensNftsCache.get(entityId) ?? []
    tokensNftsCache.set(entityId, [...existingDataForEntity, ...nfts])
  })

  return [...cachedResults, ...fetchedResults]
}

export const checkIfAnythingToList = async (entities: TokenEntity[]) => {
  const { client, urlPrefix } = usePrefix()
  const { accountId } = useAuth()
  const { data } = await useAsyncQuery<{ count: { totalCount: number } }>({
    query: listCount,
    variables: {
      token: entities.map(({ id }) => id),
      owner: accountId.value,
      denyList: getDenyList(urlPrefix.value),
    },
    clientId: client.value,
  })

  return data.value.count.totalCount > 0
}

export function useNftActions(entity: TokenEntity) {
  const { isCurrentOwner } = useAuth()

  const cheapestNFT = ref<NFTWithMetadata>()

  const fetchCheapestNFT = async () => {
    cheapestNFT.value = await fetchNft(entity.cheapest.id)
    return cheapestNFT.value
  }

  const isThereAnythingToList = ref<boolean>()
  const isStackComputed = computed(() => isStack(entity))
  const isOwner = computed(() => isCurrentOwner(entity.cheapest.currentOwner))
  const isAvailableToBuyComputed = computed(() => isAvailableToBuy(entity))
  const nftForShoppingCart = computed(() =>
    isTokenEntity(entity) ? entity.cheapest : entity,
  )

  const getNFTForBuying = async () => cheapestNFT.value ?? fetchCheapestNFT()

  onMounted(async () => {
    if (isStackComputed.value && isThereAnythingToList.value === undefined) {
      isThereAnythingToList.value = await checkIfAnythingToList([entity])
    }
  })

  return {
    isOwner,
    cheapestNFT,
    isAvailableToBuy: isAvailableToBuyComputed,
    getNFTForBuying,
    nftForShoppingCart,
    isStack: isStackComputed,
    isThereAnythingToList,
  }
}
