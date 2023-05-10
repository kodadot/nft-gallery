import { CreatedNFT, Interaction } from '@kodadot1/minimark/v1'
import { TokenToList, TokenToMint } from '@/composables/transaction/types'
import useSubscriptionGraphql from '@/composables/useSubscriptionGraphql'
import { Ref } from 'vue'
import { toNFTId } from '../rmrk/service/scheme'
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
        return
      }
      if (matchingToken.price === undefined) {
        return
      }
      const nftId = toNFTId(nft, blockNumber)
      if (nftId === undefined) {
        return
      }
      return {
        nftId,
        price: matchingToken.price,
      }
    })
    .filter(Boolean) as TokenToList[]
}

export const mintKusama = async (tokens) => {
  const { blockNumber, transaction, isLoading, status } = useTransaction()
  const { urlPrefix } = usePrefix()
  const { createdNFTs } = (await transaction({
    interaction: Interaction.MINTNFT,
    urlPrefix: urlPrefix.value,
    token: tokens,
  })) as {
    createdNFTs: Ref<CreatedNFT[]>
  }

  return {
    blockNumber,
    isLoading,
    status,
    createdNFTs,
  }
}

export const kusamaMintAndList = (tokens) => {
  const status = ref('')
  const isLoading = ref(false)
  const collectionUpdated = ref(true)
  const itemsToList = ref<TokenToList[]>()
  const blockNumber = ref<string>()

  const listForSellResults = {
    isLoading: ref(false),
    status: ref(''),
    blockNumber: ref<string>(),
  }

  onMounted(async () => {
    const { blockNumber: mintBlockNumber, createdNFTs } = await mintKusama(
      tokens
    )
    watch([mintBlockNumber, createdNFTs], () => {
      if (mintBlockNumber.value && createdNFTs.value) {
        itemsToList.value = getListForSellItems(
          createdNFTs.value,
          tokens,
          mintBlockNumber.value
        )

        const {
          blockNumber: listBlockNumber,
          isLoading: isLoadingList,
          status: listStatus,
        } = listForSell(itemsToList.value)
        listForSellResults.blockNumber.value = listBlockNumber.value
        listForSellResults.isLoading.value = isLoadingList.value
        listForSellResults.status.value = listStatus.value
      }
    })

    watchEffect(() => {
      if (listForSellResults.isLoading.value === false) {
        status.value = listForSellResults.status.value
        isLoading.value = listForSellResults.isLoading.value
        collectionUpdated.value = true
        blockNumber.value = listForSellResults.blockNumber.value
      }
    })
  })

  return {
    status,
    isLoading,
    collectionUpdated,
    blockNumber,
  }
}
