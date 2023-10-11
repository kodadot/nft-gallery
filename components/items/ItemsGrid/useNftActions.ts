import { isOwner as checkOwner } from '@/utils/account'
import nftById from '@/queries/subsquid/general/nftById.graphql'
import listCount from '@/queries/subsquid/general/countOfTokenNftsToList.graphql'
import nftListWithSearch from '@/queries/subsquid/general/nftListWithSearch.graphql'

export function useNftActions(nft: NFTWithMetadata | TokenEntity) {
  const { accountId } = useAuth()
  const { urlPrefix, client } = usePrefix()

  const fetchedNft = ref<NFTWithMetadata>()

  const hoverable = ref()
  const isHovered = useElementHover(hoverable)

  const countOfNFTSAbailableToList = ref<number>()

  watch(isHovered, async () => {
    if (
      isHovered.value &&
      isStack.value &&
      countOfNFTSAbailableToList.value === undefined
    ) {
      const { data } = await useAsyncQuery<{ count: { totalCount: number } }>({
        query: listCount,
        variables: {
          token: nft.id,
          owner: accountId.value,
          denyList: getDenyList(urlPrefix.value),
        },
        clientId: client.value,
      })

      countOfNFTSAbailableToList.value = data.value.count.totalCount
    }
  })

  const getNftId = computed(() => {
    return isTokenEntity(nft) ? nft.cheapest?.id : nft.id
  })

  const nftForShoppingCart = computed(() => {
    return isTokenEntity(nft) ? nft.cheapest : nft
  })

  const isStack = computed(() => isTokenEntity(nft) && nft.supply > 1)

  const userIsOwner = computed<boolean>(() => {
    const currentOwner = isTokenEntity(nft)
      ? nft.cheapest?.currentOwner
      : nft.currentOwner
    return checkOwner(currentOwner, accountId.value)
  })

  const isAvailableToBuy = computed(() => {
    const nftItem = isTokenEntity(nft) ? nft.cheapest : nft
    return nftItem && Number(nftItem.price) > 0
  })

  const fetchNft = async () => {
    if (!fetchedNft.value) {
      const { data } = await useAsyncQuery<{ nftEntity: NFTWithMetadata }>({
        query: nftById,
        variables: {
          id: getNftId.value,
        },
        clientId: client.value,
      })
      fetchedNft.value = data.value.nftEntity
    }
    return fetchedNft.value
  }

  const prepareListingQuery = () => {
    const variables = {
      first: 10000, // some large number
      search: [
        {
          token: { id_eq: nft.id }, // assuming NFT id comes from props
          currentOwner_eq: accountId.value,
          burned_eq: false,
        },
      ],
    }

    if (countOfNFTSAbailableToList.value === 0) {
      // Add condition for price_gt
      variables.search[0]['price_gt'] = '0'
    } else if (
      countOfNFTSAbailableToList.value &&
      countOfNFTSAbailableToList.value > 0
    ) {
      // Add condition for price_eq
      variables.search[0]['price_eq'] = '0'
    }

    return {
      query: nftListWithSearch,
      variables,
    }
  }

  const getNftsForListingCart = async (): Promise<NFTWithMetadata[]> => {
    if (!isTokenEntity(nft)) {
      return [nft]
    }

    if (!isStack.value) {
      return [await fetchNft()]
    }

    const { query, variables } = prepareListingQuery()
    const { data } = await useAsyncQuery<{ nFTEntities: NFTWithMetadata[] }>({
      query: query,
      variables: variables,
      clientId: client.value,
    })

    return data.value.nFTEntities
  }

  return {
    userIsOwner,
    isAvailableToBuy,
    fetchNft,
    prepareListingQuery,
    nftForShoppingCart,
    isStack,
    getNftId,
    hoverable,
    getNftsForListingCart,
    countOfNFTSAbailableToList,
  }
}
