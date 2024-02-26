import { createUnlockableMetadata } from '@/components/collection/unlockable/utils'
import {
  BatchAllocateResponseNft,
  BatchMintBody,
  MintItem,
  batchAllocate,
} from '@/services/fxart'
import { pinFileToIPFS } from '@/services/nftStorage'
import useGenerativePreview from './useGenerativePreview'
import { DropItem } from '@/params/types'
import useGenerativeIframeData, {
  ImageDataPayload,
} from './useGenerativeIframeData'
import { ToMintNft } from '@/components/collection/drop/types'

type MassMintNFToMint = ToMintNft & {
  imageDataPayload?: ImageDataPayload
  metadata?: string
  hash: string
  sn?: number
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
  const { generateHash } = useGenerativePreview()

  const amountToMint = ref(1)

  const isLoading = ref(false)
  const isAllocating = ref(false)
  const toMintNfts = ref<MassMintNFToMint[]>([])
  const allocatedNfts = ref<BatchAllocateResponseNft[]>([])
  const pinning = ref(new Map<string, boolean>())

  const onMessage = (payload: ImageDataPayload) => {
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
        const hash = generateHash(minted + index)
        const image = `${drop.content}/?hash=${hash}`
        return { hash, image }
      })
  }

  const pinMetadata = (item: MassMintNFToMint): Promise<string> => {
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
    allocatedNfts.value
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

  const allocate = async (mintNfts: MassMintNFToMint[]) => {
    try {
      isAllocating.value = true

      const email = generateRandomEmail()
      const address = accountId.value

      const items: MintItem[] = mintNfts.map(({ image, hash, metadata }) => ({
        image,
        hash,
        metadata,
      }))

      const body: BatchMintBody = { email, address, items }

      const response = await batchAllocate(body, drop.id)

      const result = response.result

      allocatedNfts.value = result
    } catch (error) {
      console.log('[MASSMINT::ALLOCATE] Failed', error)
    } finally {
      isAllocating.value = false
    }
  }

  watch(allPinned, async (value) => {
    if (value) {
      await allocate(toMintNfts.value)
    }
  })

  return { amountToMint, massGenerate, toMintNfts, canMint, allocatedNfts }
}
