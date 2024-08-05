import { useCollectionEntity } from '../useGenerativeDropMint'
import type { ToMintNft } from '@/components/collection/drop/types'
import { generateId, setDyndataUrl } from '@/services/dyndata'

export type MassMintNFT = Omit<ToMintNft, 'priceUSD'> & {
  image: string
  metadata: string
  nft: number // nft id
  sn?: number // serial numbers
}

export default () => {
  const dropStore = useDropStore()
  const { collectionName } = useCollectionEntity()
  const { drop, amountToMint, toMintNFTs, loading } = storeToRefs(dropStore)
  const { isSub } = useIsChain(usePrefix().urlPrefix)

  // ensure tokenIds are unique on single user session
  const tokenIds = ref<number[]>([])
  const populateTokenIds = async () => {
    for (const _ of Array.from({ length: amountToMint.value })) {
      const tokenId = Number.parseInt(await generateId())
      if (!tokenIds.value.includes(tokenId)) {
        tokenIds.value.push(tokenId)
      }
    }

    if (tokenIds.value.length < amountToMint.value) {
      await populateTokenIds()
    }
  }

  const clearMassMint = () => {
    dropStore.resetMassmint()
    tokenIds.value = []
  }

  const massGenerate = async () => {
    try {
      clearMassMint()
      if (isSub.value) {
        await populateTokenIds()
      }

      toMintNFTs.value = Array.from({ length: amountToMint.value }).map(
        (_, index) => {
          const { image, metadata } = setDyndataUrl({
            chain: drop.value.chain,
            collection: drop.value.collection,
            nft: tokenIds.value[index],
          })

          return {
            name: drop.value.name,
            collectionName: collectionName.value,
            price: drop.value.price?.toString() || '',
            nft: tokenIds.value[index],
            metadata,
            image,
          }
        },
      )

      console.log('[MASSMINT::GENERATE] Generated', toRaw(toMintNFTs.value))
    }
    catch (error) {
      console.log('[MASSMINT::GENERATE] Failed', error)
      loading.value = false
    }
  }

  onBeforeUnmount(clearMassMint)

  return {
    massGenerate,
    clearMassMint,
  }
}
