import {
  AllocateCollectionResult,
  BatchAllocateResponseNft,
  DoResult,
  allocateCollection,
  allocateClaim as claimAllocation,
} from '@/services/fxart'
import { EntropyRange, GenerativePreviewItem } from './useGenerativePreview'
import { DropItem } from '@/params/types'
import { ImageDataPayload } from './useGenerativeIframeData'
import { MintingSession, ToMintNft } from '@/components/collection/drop/types'
import isEqual from 'lodash/isEqual'
import nftEntitiesByIDs from '@/queries/subsquid/general/nftEntitiesByIDs.graphql'
import { getFakeEmail } from '@/components/collection/drop/utils'
import { TransactionStatus } from '../useTransactionStatus'
import useDropMassMintPreview from './useDropMassMintPreview'

export type MassMintNFT = ToMintNft & {
  imageDataPayload?: ImageDataPayload
  metadata?: string
  hash: string
  sn?: number
  entropyRange: EntropyRange
}

type MassMintParams = {
  drop: DropItem
  collectionName: Ref<string | undefined>
  defaultName: Ref<string>
  description: Ref<string | undefined>
  price: Ref<string | undefined>
  priceUSD: Ref<string | undefined>
  isLoading: Ref<boolean>
  mintedCount: Ref<number>
  status: Ref<TransactionStatus>
  isError: Ref<boolean>
  isTransactionLoading: Ref<boolean>
  submitMints: (session: Ref<MintingSession>) => Promise<void>
  mintSubmit: (session: Ref<MintingSession>) => Promise<void>
}

export default ({
  drop,
  collectionName,
  defaultName,
  description,
  price,
  priceUSD,
  mintedCount,
  isLoading,
  isTransactionLoading,
  isError,
  status,
  submitMints,
  mintSubmit,
}: MassMintParams) => {
  const { accountId } = useAuth()
  const { client } = usePrefix()
  const { listNftByNftWithMetadata, openListingCartModal } =
    useListingCartModal(true)

  const amountToMint = ref(1)
  const isAllocating = ref(false)
  const toMintNfts = ref<MassMintNFT[]>([])
  const allocatedNfts = ref<BatchAllocateResponseNft[]>([])
  const mintingSession = ref<MintingSession>({ txHash: '', items: [] })
  const mintedNFTsWithMetadata = ref<NFTWithMetadata[]>([])
  const previewItem = ref<GenerativePreviewItem>()
  const raffleEmail = ref()

  const {
    getEntropyRange,
    allPinned,
    generatePreviewItem,
    pinning,
    payloads,
    pinMetadata,
  } = useDropMassMintPreview({
    toMintNfts,
    drop,
    description,
    collectionName,
    defaultName,
    mintingSession,
  })

  const canMint = computed(() => Boolean(allocatedNfts.value.length))

  const clear = () => {
    isLoading.value = false
    toMintNfts.value = []
    pinning.value = new Map()
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
      toMintNfts.value = getPreviewItemsToMintedNfts([previewItem])
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

  const getPreviewItemsToMintedNfts = (
    previewItems: GenerativePreviewItem[],
  ) => {
    return previewItems.map((item, index) => {
      return {
        name: `${defaultName.value as string} #${mintedCount.value + (index + 1)}`,
        collectionName: collectionName.value as string,
        image: item.image,
        price: price.value as string,
        priceUSD: priceUSD.value as string,
        hash: item.hash,
        entropyRange: item.entropyRange,
      }
    })
  }

  const mintGenerated = async (previewItem: GenerativePreviewItem) => {
    try {
      clear()
      isLoading.value = true

      const [item] = getPreviewItemsToMintedNfts([previewItem])

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

  const massGenerate = ({
    amount,
    minted,
    withPreviewItems = [],
  }: {
    withPreviewItems?: GenerativePreviewItem[]
    amount: number
    minted: number
  }) => {
    try {
      clear()
      isLoading.value = true

      const single = amount === 1
      const previewItems = single
        ? [...withPreviewItems].flat()
        : generateMassPreview(amount, minted)

      toMintNfts.value = getPreviewItemsToMintedNfts(previewItems)
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
      const allocatedNftsToMint = toMintNfts.value.slice(
        0,
        allocatedNfts.value.length,
      )

      toMintNfts.value = allocatedNftsToMint.map((toMint, index) => {
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
        drop.id,
      )
      results.push(result)
    }

    return results
  }

  const subscribeForNftsWithMetadata = (nftIds: string[]) => {
    subscribeToNfts(nftIds, async (data) => {
      const ids = data.map((item) => item.id)
      const readyToFetch = isEqual(ids.sort(), nftIds.sort())

      if (readyToFetch) {
        const { data } = await useAsyncQuery<{
          nftEntities: NFTWithMetadata[]
        }>({
          query: nftEntitiesByIDs,
          variables: {
            ids: nftIds,
          },
          clientId: client.value,
        })

        mintedNFTsWithMetadata.value = data.value.nftEntities
      }
    })
  }

  const canListMintedNfts = computed(() =>
    Boolean(mintedNFTsWithMetadata.value.length),
  )

  const listMintedNFts = () => {
    mintedNFTsWithMetadata.value.forEach(listNftByNftWithMetadata)
    openListingCartModal()
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
          drop.id,
        ).then(({ result }) => resolve(result))
      } catch (e) {
        reject(e)
      }
    })
  }

  watch(allPinned, async (pinned) => {
    if (pinned) {
      await allocate(toMintNfts.value)
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
      submitMints(mintingSession)
    }
  })

  return {
    amountToMint,
    toMintNfts,
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
