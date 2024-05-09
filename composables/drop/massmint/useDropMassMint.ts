import { ToMintNft } from '@/components/collection/drop/types'
import { DoResult, updateMetadata } from '@/services/fxart'
import { useCollectionEntity } from '../useGenerativeDropMint'
import { ImageDataPayload } from '../useGenerativeIframeData'
import useDropMassMintPreview from './useDropMassMintPreview'

export type MassMintNFT = Omit<ToMintNft, 'priceUSD'> & {
  imageDataPayload?: ImageDataPayload
  metadata?: string
  hash: string
  sn?: number // nft id
  index?: number // serial numbers
  entropyRange: EntropyRange
  canRender: boolean
}

export default () => {
  const { accountId } = useAuth()

  const { payloads, pinMetadata, getPreviewItemsToMintedNfts } =
    useDropMassMintPreview()
  const { mintedAmountForCurrentUser } = useCollectionEntity()
  const dropStore = useDropStore()

  const {
    drop,
    amountToMint,
    previewItem,
    allocatedNFTs,
    toMintNFTs,
    loading,
  } = storeToRefs(dropStore)

  const clearMassmint = () => {
    dropStore.resetMassmint()
  }

  const generateMassPreview = (amount: number, minted: number) => {
    return Array(amount)
      .fill(null)
      .map((_, index) => {
        const entropyRange = getEntropyRange(minted + index)
        return generatePreviewItem({
          entropyRange,
          accountId: accountId.value,
          content: drop.value.content,
        })
      })
  }

  const allocateGenerated = async () => {
    try {
      clearMassmint()

      loading.value = true

      const [item] = getPreviewItemsToMintedNfts([
        previewItem.value as GenerativePreviewItem,
      ])

      const imageDataPayload = payloads.value.get(item.hash)

      const metadata = await pinMetadata({ ...item, imageDataPayload })

      await allocate([
        {
          ...item,
          metadata,
        },
      ])
    } catch (error) {
      loading.value = false
    }
  }

  const massGenerate = async () => {
    try {
      clearMassmint()

      const single = amountToMint.value === 1

      if (single && !previewItem.value) {
        console.log(
          '[MASSMINT::GENERATE] Cant mint no preview item is provided',
        )
        return
      }

      const previewItems = [toRaw(previewItem.value)] as GenerativePreviewItem[]

      if (!single) {
        previewItems.push(
          ...generateMassPreview(
            amountToMint.value - 1,
            mintedAmountForCurrentUser.value + 1,
          ),
        )
      }
      console.log('[MASSMINT::GENERATE] Generating', previewItems)

      toMintNFTs.value = getPreviewItemsToMintedNfts(previewItems)
      console.log('[MASSMINT::GENERATE] Generated', toRaw(toMintNFTs.value))

      await allocate(toMintNFTs.value)
    } catch (error) {
      console.log('[MASSMINT::GENERATE] Failed', error)
      loading.value = false
    }
  }

  const allocate = async (mintNfts: MassMintNFT[]) => {
    try {
      loading.value = true

      const items = mintNfts.map(({ image, hash, metadata }) => ({
        image,
        hash,
        metadata,
      }))

      allocatedNFTs.value = items.map((item) => {
        return {
          id: parseInt(uidMathDate()),
          name: '',
          image: item.image,
        }
      })
      console.log('[MASSMINT::ALLOCATE] Allocating', toRaw(allocatedNFTs.value))

      toMintNFTs.value = toMintNFTs.value.map((toMint, index) => {
        const allocated = allocatedNFTs.value[index]
        return allocated
          ? { ...toMint, name: toMint.collectionName, sn: Number(allocated.id) }
          : toMint
      })
      console.log('[MASSMINT::ALLOCATE] Allocated', toRaw(toMintNFTs.value))
    } catch (error) {
      console.log('[MASSMINT::ALLOCATE] Failed', error)
    } finally {
      loading.value = false
    }
  }

  const submitMint = async (nft: MassMintNFT): Promise<DoResult> => {
    return new Promise((resolve, reject) => {
      try {
        updateMetadata({
          chain: drop.value.chain,
          collection: drop.value.collection,
          nft: nft.sn,
          sn: nft.index,
          hash: nft.hash,
        }).then((result) => resolve(result))
      } catch (e) {
        reject(e)
      }
    })
  }

  onBeforeUnmount(clearMassmint)

  return {
    massGenerate,
    submitMint,
    allocateGenerated,
    clearMassMint: clearMassmint,
  }
}
