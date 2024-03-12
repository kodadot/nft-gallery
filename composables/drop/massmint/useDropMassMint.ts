import {
  AllocatedNFT,
  DoResult,
  allocateCollection,
  allocateClaim as claimAllocation,
} from '@/services/fxart'
import { EntropyRange, GenerativePreviewItem } from '../useGenerativePreview'
import { ImageDataPayload } from '../useGenerativeIframeData'
import { ToMintNft } from '@/components/collection/drop/types'
import { getFakeEmail } from '@/components/collection/drop/utils'
import { TransactionStatus } from '../../useTransactionStatus'
import useDropMassMintPreview from './useDropMassMintPreview'
import useDropMassMintUploader from './useDropMassMintUploader'
import { useCollectionEntity } from '../useGenerativeDropMint'

export type MassMintNFT = Omit<ToMintNft, 'priceUSD'> & {
  imageDataPayload?: ImageDataPayload
  metadata?: string
  hash: string
  sn?: number
  entropyRange: EntropyRange
}

type MassMintParams = {
  isLoading: Ref<boolean>
  status: Ref<TransactionStatus>
  isError: Ref<boolean>
  isTransactionLoading: Ref<boolean>
  onSubmitMints: () => Promise<void>
  onTransactionCancel?: () => void
}

export default ({
  isLoading,
  isTransactionLoading,
  isError,
  status,
  onSubmitMints,
  onTransactionCancel,
}: MassMintParams) => {
  const { accountId } = useAuth()

  const {
    allPinned,
    generatePreviewItem,
    payloads,
    pinMetadata,
    getPreviewItemsToMintedNfts,
  } = useDropMassMintPreview()
  useDropMassMintUploader()
  const { mintedAmountForCurrentUser } = useCollectionEntity()

  const {
    drop,
    amountToMint,
    previewItem,
    allocatedNFTs,
    toMintNFTs,
    mintingSession,
    mintedNFTs,
  } = storeToRefs(useDropStore())

  const isAllocating = ref(false)
  const raffleEmail = ref()

  const clearMassmint = () => {
    isLoading.value = false
    toMintNFTs.value = []
    allocatedNFTs.value = []
    raffleEmail.value = undefined
    mintedNFTs.value = []
    mintingSession.value = { txHash: '', items: [] }
  }

  const allocateRaffleMode = async (
    email: string,
    previewItem: GenerativePreviewItem,
  ) => {
    try {
      clearMassmint()
      isLoading.value = true
      raffleEmail.value = email
      toMintNFTs.value = getPreviewItemsToMintedNfts([previewItem])
    } catch (error) {
      console.log('[MASSMINT::RAFFLE] Failed', error)
      isLoading.value = false
    }
  }

  const generateMassPreview = (amount: number, minted: number) => {
    return Array(amount)
      .fill(null)
      .map((_, index) => {
        const entropyRange = getEntropyRange(minted + index)
        return generatePreviewItem(entropyRange)
      })
  }

  const allocateGenerated = async () => {
    try {
      clearMassmint()

      isLoading.value = true

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
      isLoading.value = false
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

      isLoading.value = true

      const previewItems = single
        ? ([previewItem.value] as GenerativePreviewItem[])
        : generateMassPreview(
            amountToMint.value,
            mintedAmountForCurrentUser.value,
          )

      toMintNFTs.value = getPreviewItemsToMintedNfts(previewItems)
    } catch (error) {
      console.log('[MASSMINT::GENERATE] Failed', error)
      isLoading.value = false
    }
  }

  const allocate = async (mintNfts: MassMintNFT[]) => {
    try {
      isLoading.value = true
      isAllocating.value = true

      const email = raffleEmail.value || getFakeEmail()
      const address = accountId.value

      const items = mintNfts.map(({ image, hash, metadata }) => ({
        image,
        hash,
        metadata,
      }))

      allocatedNFTs.value = await allocateItems({ items, email, address })

      // even thought the user might want x amount of items the worker can return a different amount
      const allocatedNFTsToMint = toMintNFTs.value.slice(
        0,
        allocatedNFTs.value.length,
      )

      toMintNFTs.value = allocatedNFTsToMint.map((toMint, index) => {
        const allocated = allocatedNFTs.value[index]
        return allocated
          ? { ...toMint, name: allocated.name, sn: Number(allocated.id) }
          : toMint
      })
    } catch (error) {
      console.log('[MASSMINT::ALLOCATE] Failed', error)
    } finally {
      isAllocating.value = false
      isLoading.value = false
    }
  }

  const allocateItems = async ({
    items,
    email,
    address,
  }): Promise<AllocatedNFT[]> => {
    const results = [] as Array<AllocatedNFT>

    // @see https://github.com/kodadot/private-workers/pull/86#issuecomment-1975842570 for context
    for (const item of items) {
      const { result } = await allocateCollection(
        {
          email,
          address,
          image: item.image,
          hash: item.hash,
          metadata: item.metadata,
        },
        drop.value.id,
      )
      results.push(result)
    }

    return results
  }

  const submitMint = async (nft: MassMintNFT): Promise<DoResult> => {
    return new Promise((resolve, reject) => {
      try {
        claimAllocation(
          {
            sn: nft.sn,
            txHash: mintingSession.value.txHash,
            address: accountId.value,
          },
          drop.value.id,
        ).then(({ result }) => resolve(result))
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

  watch([status, () => mintingSession.value.txHash], ([curStatus, txHash]) => {
    if (curStatus === TransactionStatus.Cancelled) {
      return onTransactionCancel?.()
    }

    // ensure txHash is set, it's needed when calling /do/:id
    if (curStatus === TransactionStatus.Block && txHash) {
      if (isError.value) {
        isLoading.value = false
        isTransactionLoading.value = false
        return
      }
      onSubmitMints()
    }
  })

  return {
    raffleEmail,
    massGenerate,
    submitMint,
    allocateRaffleMode,
    allocateGenerated,
    clearMassMint: clearMassmint,
  }
}
