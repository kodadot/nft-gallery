import { createUnlockableMetadata } from '@/components/collection/unlockable/utils'
import {
  BatchAllocateResponseNft,
  BatchMintBody,
  batchAllocate,
} from '@/services/fxart'
import { pinFileToIPFS } from '@/services/nftStorage'
import useGenerativePreview from './useGenerativePreview'
import { DropItem } from '@/params/types'
import useGenerativeIframeData, {
  ImageDataPayload,
} from './useGenerativeIframeData'
import { MintingSession, ToMintNft } from '@/components/collection/drop/types'
import isEqual from 'lodash/isEqual'
import nftEntitiesByIDs from '@/queries/subsquid/general/nftEntitiesByIDs.graphql'

export type MassMintNFT = ToMintNft & {
  imageDataPayload?: ImageDataPayload
  metadata?: string
  hash: string
  sn?: number
  entropyRange: [number, number]
}

type MassMintParams = {
  drop: DropItem
  collectionName: Ref<string | undefined>
  defaultName: Ref<string>
  description: Ref<string | undefined>
  price: Ref<string | undefined>
  priceUSD: Ref<string | undefined>
  isLoading: Ref<boolean>
  isAllocatingRaffle: Ref<boolean>
}

export default ({
  drop,
  collectionName,
  defaultName,
  description,
  price,
  priceUSD,
}: MassMintParams) => {
  const { toast } = useToast()
  const { $i18n } = useNuxtApp()
  const { accountId } = useAuth()
  const { generateHash, getEntropyRange } = useGenerativePreview()
  const { client } = usePrefix()
  const { listNftByNftWithMetadata, openListingCartModal } =
    useListingCartModal()

  const amountToMint = ref(1)

  const isLoading = ref(false)
  const isAllocating = ref(false)
  const toMintNfts = ref<MassMintNFT[]>([])
  const allocatedNfts = ref<BatchAllocateResponseNft[]>([])
  const mintingSession = ref<MintingSession>({ txHash: '', items: [] })
  const mintedNFTsWithMetadata = ref<NFTWithMetadata[]>([])

  const pinning = ref(new Map<string, boolean>())

  const onMessage = (payload: ImageDataPayload) => {
    if (payload.image === 'data:,') {
      return regenerateNfTWithHash(payload.hash)
    }

    handleNewImageDataPayload(payload)
    pinNFTWithHash(payload.hash)
  }

  const { getCaptureImageFile } = useGenerativeIframeData({ onMessage })

  const allPinned = computed(
    () =>
      toMintNfts.value.length !== 0 &&
      toMintNfts.value.map((item) => item.metadata).every(Boolean),
  )

  const canMint = computed(() => Boolean(allocatedNfts.value.length))

  const handleNewImageDataPayload = (payload: ImageDataPayload) => {
    toMintNfts.value = toMintNfts.value.map((toMintNft) => {
      if (toMintNft.hash === payload.hash) {
        return { ...toMintNft, imageDataPayload: payload }
      }
      return toMintNft
    })
  }

  const tryCapture = async ({
    image,
    data,
  }: {
    image: string
    data: ImageDataPayload
  }) => {
    try {
      const imgFile = await getCaptureImageFile({ image, data })
      const imageHash = await pinFileToIPFS(imgFile)
      return imageHash
    } catch (error) {
      toast($i18n.t('drops.capture'))
      throw error
    }
  }

  const generateMassPreview = (amount: number, minted: number) => {
    return Array(amount)
      .fill(null)
      .map((_, index) => {
        const entropyRange = getEntropyRange(minted + index)
        return getPreviewItem(entropyRange)
      })
  }

  const getPreviewItem = (entropyRange: [number, number]) => {
    const hash = generateHash(entropyRange)
    const image = `${drop.content}/?hash=${hash}`
    return { hash, image, entropyRange }
  }

  const pinMetadata = (item: MassMintNFT): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const image = item.image
        const imageCid = await tryCapture({
          image,
          data: item.imageDataPayload as ImageDataPayload,
        })
        const metadata = await createUnlockableMetadata(
          imageCid,
          description.value || '',
          collectionName.value || defaultName.value,
          'text/html',
          image,
        )

        resolve(metadata)
      } catch (error) {
        reject(error)
      }
    })
  }

  const clear = () => {
    toMintNfts.value = []
    pinning.value = new Map()
    allocatedNfts.value = []
  }

  const massGenerate = (amount: number, minted: number) => {
    try {
      clear()

      isLoading.value = true

      const previewItems = generateMassPreview(amount, minted)

      toMintNfts.value = previewItems.map((item) => {
        return {
          name: defaultName.value as string,
          collectionName: collectionName.value as string,
          image: item.image,
          price: price.value as string,
          priceUSD: priceUSD.value as string,
          hash: item.hash,
          entropyRange: item.entropyRange,
        }
      })
    } catch (error) {
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }

  const pinNFTWithHash = async (hash: string) => {
    const toMintNft = toMintNfts.value.find((item) => item.hash === hash)

    if (!toMintNft || toMintNft.metadata || pinning.value.has(toMintNft.hash)) {
      return
    }

    pinning.value.set(toMintNft.hash, true)

    const metadata = await pinMetadata(toMintNft)

    toMintNfts.value = toMintNfts.value.map((item) =>
      item.hash === hash ? { ...item, metadata } : item,
    )
  }

  const regenerateNfTWithHash = (hash: string) => {
    toMintNfts.value = toMintNfts.value.map((item) => {
      if (item.hash === hash) {
        return { ...item, ...getPreviewItem(item.entropyRange) }
      }
      return item
    })
  }

  const allocate = async (mintNfts: MassMintNFT[]) => {
    try {
      isAllocating.value = true

      const email = generateRandomEmail()
      const address = accountId.value

      const items = mintNfts.map(({ image, hash, metadata }) => ({
        image,
        hash,
        metadata,
      }))

      const body: BatchMintBody = { email, address, items }

      const response = await batchAllocate(body, drop.id)

      const result = response.result // take this as source

      allocatedNfts.value = result

      toMintNfts.value = toMintNfts.value.map((toMint, index) => {
        const allocated = allocatedNfts.value[index]
        return allocated
          ? { ...toMint, name: allocated.name, sn: allocated.id }
          : toMint
      })
    } catch (error) {
      console.log('[MASSMINT::ALLOCATE] Failed', error)
    } finally {
      isAllocating.value = false
    }
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

  watch(allPinned, async (value) => {
    if (value) {
      await allocate(toMintNfts.value)
    }
  })

  return {
    amountToMint,
    toMintNfts,
    canMint,
    canListMintedNfts,
    allocatedNfts,
    mintingSession,
    subscribeForNftsWithMetadata,
    massGenerate,
    listMintedNFts,
  }
}
