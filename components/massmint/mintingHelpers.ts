import { CreatedNFT, Interaction } from '@kodadot1/minimark/v1'
import {
  MintedCollection,
  TokenToList,
  TokenToMint,
} from '@/composables/transaction/types'
import useSubscriptionGraphql from '@/composables/useSubscriptionGraphql'
import { toNFTId } from '../rmrk/service/scheme'
import { NFTToMint } from './types'

export const createTokensToMint = (
  nfts: NFTToMint[],
  collection: MintedCollection
): TokenToMint[] => {
  return nfts.map((nft) => ({
    file: nft.file,
    name: nft.name,
    description: nft.description || '',
    edition: 1,
    secondFile: null,
    selectedCollection: collection,
    price: nft.price === undefined ? 0 : nft.price * Math.pow(10, 12),
    nsfw: false,
    postfix: true,
    tags: [],
  }))
}
export const subscribeToCollectionUpdates = (collectionId: string) => {
  const collectionUpdated = ref(false)
  const numOfNftsInCollections = ref<number>()

  useSubscriptionGraphql({
    query: `  collection: collectionEntityById(id: "${collectionId}") {
        id
        name
        nfts(
          orderBy: [updatedAt_DESC]
          where: { burned_eq: false }
        ) {
          id
          name
          sn
    
        }
      }`,
    onChange: ({ data }) => {
      const collection = data.collection
      const currentNumberOfNts = collection.nfts.length
      if (numOfNftsInCollections.value === undefined) {
        numOfNftsInCollections.value = currentNumberOfNts
        return
      }

      if (currentNumberOfNts > numOfNftsInCollections.value) {
        collectionUpdated.value = true
      }
    },
  })

  return collectionUpdated
}

export const listForSell = (mintedNFts: TokenToList[]) => {
  const { blockNumber, transaction, isLoading, status } = useTransaction()
  const { urlPrefix } = usePrefix()
  const { $i18n } = useNuxtApp()

  transaction({
    interaction: Interaction.LIST,
    urlPrefix: urlPrefix.value,
    token: mintedNFts,
    successMessage: $i18n.t('transaction.price.success') as string,
    errorMessage: $i18n.t('transaction.price.error') as string,
  })
  return {
    blockNumber,
    isLoading,
    status,
  }
}

export const getListForSellItems = (
  createdNFTs: CreatedNFT[],
  tokens: TokenToMint[],
  blockNumber: string
) => {
  const { $consola } = useNuxtApp()
  return createdNFTs
    .map((nft: CreatedNFT) => {
      const matchingToken = tokens.find(
        (token) =>
          token.name === nft?.name &&
          token.selectedCollection?.id === nft.collection
      )

      if (matchingToken === undefined) {
        $consola.error('matching token not found', nft)
        return undefined
      }
      if (matchingToken.price === undefined) {
        return undefined
      }
      const nftId = toNFTId(nft, blockNumber)
      if (nftId === undefined) {
        return undefined
      }
      return {
        nftId,
        price: matchingToken.price,
      }
    })
    .filter(Boolean) as TokenToList[]
}

export const mintKusama = (tokens) => {
  const { blockNumber, transaction, isLoading, status } = useTransaction()
  const { urlPrefix } = usePrefix()
  const createdNFTs = ref<CreatedNFT[]>()
  transaction({
    interaction: Interaction.MINTNFT,
    urlPrefix: urlPrefix.value,
    token: tokens,
  }).then((result) => {
    if (typeof result === 'object' && result?.createdNFTs) {
      createdNFTs.value = result?.createdNFTs.value as CreatedNFT[]
    }
  })

  return {
    blockNumber,
    isLoading,
    status,
    createdNFTs,
  }
}

export const kusamaMintAndList = (tokens) => {
  const status = ref('')
  const isLoading = ref(true)
  const collectionUpdated = ref(false)
  const itemsToList = ref<TokenToList[]>()
  const blockNumber = ref<string>()

  const listForSellResults = reactive<{
    isLoading: boolean
    status: string
    blockNumber: string | undefined
  }>({
    isLoading: true,
    status: '',
    blockNumber: undefined,
  })

  const {
    blockNumber: mintBlockNumber,
    createdNFTs,
    status: mintStatus,
  } = mintKusama(tokens)
  watch([mintBlockNumber, createdNFTs, mintStatus], () => {
    status.value = mintStatus.value
    if (mintBlockNumber.value && createdNFTs.value) {
      itemsToList.value = getListForSellItems(
        createdNFTs.value,
        tokens,
        mintBlockNumber.value
      )
    }
  })

  watch(itemsToList, () => {
    if (itemsToList.value) {
      const {
        blockNumber: listBlockNumber,
        isLoading: isLoadingList,
        status: listStatus,
      } = listForSell(itemsToList.value)
      listForSellResults.blockNumber = listBlockNumber.value
      listForSellResults.isLoading = isLoadingList.value
      listForSellResults.status = listStatus.value
    }
  })

  watchEffect(() => {
    if (listForSellResults.blockNumber !== undefined) {
      status.value = listForSellResults.status
      isLoading.value = listForSellResults.isLoading
      collectionUpdated.value = true
      blockNumber.value = listForSellResults.blockNumber
    }
  })

  return {
    status,
    isLoading,
    collectionUpdated,
    blockNumber,
  }
}
