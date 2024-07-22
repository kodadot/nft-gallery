import { MintedCollection, TokenToMint } from '@/composables/transaction/types'
import useSubscriptionGraphql from '@/composables/useSubscriptionGraphql'
import { NFTToMint } from '@/components/massmint/types'

export const createTokensToMint = (
  nfts: NFTToMint[],
  collection: MintedCollection,
): TokenToMint[] => {
  const { decimals } = useChain()
  return nfts.map((nft) => ({
    file: nft.file,
    name: nft.name,
    description: nft.description || '',
    edition: 1,
    secondFile: null,
    selectedCollection: collection,
    price:
      nft.price === undefined ? 0 : nft.price * Math.pow(10, decimals.value),
    nsfw: false,
    postfix: true,
    tags: [],
  }))
}
export const subscribeToCollectionLengthUpdates = (collectionId: string) => {
  const collectionUpdated = ref(false)
  const numOfNftsInCollections = ref<number>()

  useSubscriptionGraphql({
    query: `  collection: collectionEntityById(id: "${collectionId}") {
        id
        nfts(
          orderBy: [updatedAt_DESC]
          where: { burned_eq: false }
        ) {
          id

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
