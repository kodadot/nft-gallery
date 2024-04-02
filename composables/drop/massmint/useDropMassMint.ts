import { DoResult, updateMetadata } from '@/services/fxart'
import { ImageDataPayload } from '../useGenerativeIframeData'
import { ToMintNft } from '@/components/collection/drop/types'
import useDropMassMintPreview from './useDropMassMintPreview'
import useDropMassMintUploader from './useDropMassMintUploader'
import { useCollectionEntity } from '../useGenerativeDropMint'

export type MassMintNFT = Omit<ToMintNft, 'priceUSD'> & {
  imageDataPayload?: ImageDataPayload
  metadata?: string
  hash: string
  sn?: number
  entropyRange: EntropyRange
  canRender: boolean
}

export default () => {
  const { accountId } = useAuth()

  useDropMassMintUploader()

  const { allPinned, payloads, pinMetadata, getPreviewItemsToMintedNfts } =
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

  const massGenerate = () => {
    try {
      clearMassmint()

      const single = amountToMint.value === 1

      if (single && !previewItem.value) {
        console.log(
          '[MASSMINT::GENERATE] Cant mint no preview item is provided',
        )
        return
      }

      loading.value = true

      const previewItems = single
        ? ([previewItem.value] as GenerativePreviewItem[])
        : generateMassPreview(
            amountToMint.value,
            mintedAmountForCurrentUser.value,
          )

      toMintNFTs.value = getPreviewItemsToMintedNfts(previewItems)
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
      console.log('[MASSMINT::ALLOCATE] Allocating', allocatedNFTs.value)

      toMintNFTs.value = toMintNFTs.value.map((toMint, index) => {
        const allocated = allocatedNFTs.value[index]
        return allocated
          ? { ...toMint, name: toMint.collectionName, sn: Number(allocated.id) }
          : toMint
      })
      console.log('[MASSMINT::ALLOCATE] Allocated', toMintNFTs.value)
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
          metadata: nft.metadata,
        }).then((result) => resolve(result))
      } catch (e) {
        reject(e)
      }
    })
  }

  watch(allPinned, async (pinned) => {
    if (pinned) {
      await allocate(toMintNFTs.value)
    }
  })

  onBeforeUnmount(clearMassmint)

  return {
    massGenerate,
    submitMint,
    allocateGenerated,
    clearMassMint: clearMassmint,
  }
}
