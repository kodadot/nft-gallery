import { useCollectionEntity } from '../useGenerativeDropMint'
import type { ToMintNft } from '@/components/collection/drop/types'
import type { DoResult } from '@/services/fxart'
import { updateMetadata } from '@/services/fxart'

export type MassMintNFT = Omit<ToMintNft, 'priceUSD'> & {
  metadata?: string
  nft: number // nft id
  sn?: number // serial numbers
}

export default () => {
  const dropStore = useDropStore()
  const { collectionName } = useCollectionEntity()

  const { drop, amountToMint, toMintNFTs, loading } = storeToRefs(dropStore)

  const clearMassmint = () => {
    dropStore.resetMassmint()
  }

  const massGenerate = async () => {
    try {
      clearMassmint()

      toMintNFTs.value = Array.from({ length: amountToMint.value }).map(() => {
        return {
          name: drop.value.name,
          collectionName: collectionName.value,
          price: drop.value.price?.toString() || '',
          nft: parseInt(uidMathDate()),
        }
      })

      console.log('[MASSMINT::GENERATE] Generated', toRaw(toMintNFTs.value))
    }
    catch (error) {
      console.log('[MASSMINT::GENERATE] Failed', error)
      loading.value = false
    }
  }

  const submitMint = async (nft: MassMintNFT): Promise<DoResult> => {
    return new Promise((resolve, reject) => {
      try {
        updateMetadata({
          chain: drop.value.chain,
          collection: drop.value.collection,
          nft: nft.nft,
          sn: nft.sn,
        }).then(result => resolve(result))
      }
      catch (e) {
        reject(e)
      }
    })
  }

  onBeforeUnmount(clearMassmint)

  return {
    massGenerate,
    submitMint,
    clearMassMint: clearMassmint,
  }
}
