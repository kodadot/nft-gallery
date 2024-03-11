import {
  AllocateCollectionResult,
  BatchAllocateResponseNft,
  DoResult,
  allocateCollection,
  allocateClaim as claimAllocation,
} from '@/services/fxart'
import { EntropyRange, GenerativePreviewItem } from '../useGenerativePreview'
import { ImageDataPayload } from '../useGenerativeIframeData'
import { MintingSession, ToMintNft } from '@/components/collection/drop/types'
import { getFakeEmail } from '@/components/collection/drop/utils'
import { TransactionStatus } from '../../useTransactionStatus'
import useDropMassMintPreview from './useDropMassMintPreview'
import useDropMassMintUploader from './useDropMassMintUploader'
import useDropMassMintListing from './useDropMassMintListing'

export type MassMintNFT = ToMintNft & {
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
  submitMints: (params: {
    session: Ref<MintingSession>
    toMintNFTs: MassMintNFT[]
  }) => Promise<void>
  mintSubmit: (session: Ref<MintingSession>) => Promise<void>
  onTransactionCancel?: () => void
}

export default ({
  isLoading,
  isTransactionLoading,
  isError,
  status,
  submitMints,
  mintSubmit,
  onTransactionCancel,
}: MassMintParams) => {
  const { accountId } = useAuth()

  const dropStore = useDropStore()
  const { drop, amountToMint, previewItem, toMintNFTs, mintingSession } =
    storeToRefs(dropStore)

  const isAllocating = ref(false)
  const allocatedNfts = ref<BatchAllocateResponseNft[]>([])
  const raffleEmail = ref()

  const {
    getEntropyRange,
    allPinned,
    generatePreviewItem,
    payloads,
    pinMetadata,
    getPreviewItemsToMintedNfts,
  } = useDropMassMintPreview()

  useDropMassMintUploader()

  const { canListMintedNfts, subscribeForNftsWithMetadata, listMintedNFts } =
    useDropMassMintListing()

  const canMint = computed(() => Boolean(allocatedNfts.value.length))

  const clear = () => {
    isLoading.value = false
    toMintNFTs.value = []
    allocatedNfts.value = []
    raffleEmail.value = undefined
    mintingSession.value = { txHash: '', items: [] }
  }

  const allocateRaffleMode = async (
    email: string,
    previewItem: GenerativePreviewItem,
  ) => {
    try {
      clear()
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

  const mint = () => mintSubmit(mintingSession)

  const mintGenerated = async () => {
    try {
      clear()

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
      clear()

      const single = amountToMint.value === 1

      if (single && !previewItem.value) {
        console.log('[MASSMINT::GENERATE] Cant')
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
      console.log(toMintNFTs.value)
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

      allocatedNfts.value = await allocateItems({ items, email, address })

      // even thought the user might want x amount of items the worker can return a different amount
      const allocatedNftsToMint = toMintNFTs.value.slice(
        0,
        allocatedNfts.value.length,
      )

      toMintNFTs.value = allocatedNftsToMint.map((toMint, index) => {
        const allocated = allocatedNfts.value[index]
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
  }): Promise<AllocateCollectionResult[]> => {
    const results = [] as Array<AllocateCollectionResult>

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
    // ensure txHash is set, it's needed when calling /do/:id
    if (curStatus === TransactionStatus.Block && txHash) {
      if (isError.value) {
        isLoading.value = false
        isTransactionLoading.value = false
        return
      }
      submitMints({ session: mintingSession, toMintNFTs: toMintNFTs.value })
    }

    if (curStatus === TransactionStatus.Cancelled) {
      onTransactionCancel?.()
    }
  })

  return {
    raffleEmail,
    canMint,
    canListMintedNfts,
    allocatedNfts,
    mintingSession,
    previewItem,
    subscribeForNftsWithMetadata,
    massGenerate,
    listMintedNFts,
    submitMint,
    allocateRaffleMode,
    mint,
    payloads,
    mintGenerated,
    clearMassMint: clear,
  }
}
