import { DoResult } from '@/services/waifu'
import { makeScreenshot } from '@/services/capture'
import { pinFileToIPFS } from '@/services/nftStorage'
import { nftToListingCartItem } from '@/components/common/shoppingCart/utils'
import { useEventListener } from '@vueuse/core'
import { DropMintedStatus } from '@/services/waifu'

export type DropMintedNft = DoResult & {
  id: string
  collectionName: string
  name: string
}

type GenerativeDropMintParams = {
  defaultImage: Ref<string>
  collectionId: Ref<string>
  currentAccountMintedToken: Ref<DropMintedStatus | null>
}

export default ({
  defaultImage,
  currentAccountMintedToken,
  collectionId,
}: GenerativeDropMintParams) => {
  const { toast } = useToast()
  const { $i18n } = useNuxtApp()
  const { isLogIn } = useAuth()
  const { doAfterLogin } = useDoAfterlogin(getCurrentInstance())
  const listingCartStore = useListingCartStore()
  const preferencesStore = usePreferencesStore()

  const mintedNft = ref<DropMintedNft>()
  const mintedNftWithMetadata = ref<NFTWithMetadata>()
  const mintNftSN = ref('0')

  const isWalletConnecting = ref(false)
  const isLoading = ref(false)
  const isImageFetching = ref(false)
  const imageDataPayload = ref<{ hash: string; image: string }>()
  const selectedImage = ref<string>('')

  useEventListener(window, 'message', (res) => {
    if (
      res?.data?.type === 'kodahash/render/completed' &&
      res?.data?.payload.image
    ) {
      imageDataPayload.value = res?.data?.payload
    }
  })

  const clearWalletConnecting = () => {
    isWalletConnecting.value = false
  }

  const preSubmitMint = (): boolean => {
    if (!isLogIn.value) {
      isWalletConnecting.value = true
      doAfterLogin({
        onLoginSuccess: clearWalletConnecting,
        onCancel: clearWalletConnecting,
      })
      return false
    }

    if (isLoading.value || isImageFetching.value) {
      return false
    }

    return true
  }

  const canListMintedNft = computed(() => Boolean(mintedNftWithMetadata.value))

  const userMintedNftId = computed(() =>
    currentAccountMintedToken.value
      ? `${collectionId.value}-${currentAccountMintedToken.value.id}`
      : mintedNft.value?.id,
  )

  const tryCapture = async () => {
    try {
      const imgFile = await getCaptureImageFile()
      const imageHash = await pinFileToIPFS(imgFile)
      return imageHash
    } catch (error) {
      toast($i18n.t('drops.capture'))
      return defaultImage.value
    }
  }

  const getCaptureImageFile = async () => {
    try {
      const selectedImageHash = selectedImage.value.split('?hash=')[1]
      const isTheSameImage = selectedImageHash === imageDataPayload.value?.hash
      if (!imageDataPayload.value?.image || !isTheSameImage) {
        throw new Error('Not loaded, try screenshot service')
      }
      const res = (await fetch(imageDataPayload.value.image)) as any
      return new File([res], 'image.png', { type: 'image/png' })
    } catch (error) {
      return await makeScreenshot(sanitizeIpfsUrl(selectedImage.value), {
        webgl: false,
      })
    }
  }

  const subscribeToMintedNft = (id: string, onReady: (data) => void) => {
    useSubscriptionGraphql({
      query: `nftEntityById(id: "${id}") {
      id
    }`,
      onChange: onReady,
    })
  }

  const listMintedNft = async () => {
    if (!mintedNftWithMetadata.value) {
      return
    }

    if (!listingCartStore.isItemInCart(mintedNftWithMetadata.value?.id)) {
      const floorPrice =
        mintedNftWithMetadata.value?.collection.floorPrice[0]?.price || '0'

      listingCartStore.setItem(
        nftToListingCartItem(mintedNftWithMetadata.value, floorPrice),
      )
    }

    preferencesStore.listingCartModalOpen = true
  }

  onBeforeUnmount(() => {
    preferencesStore.listingCartModalOpen = false
    listingCartStore.removeItem(mintedNftWithMetadata.value?.id)
  })

  return {
    mintedNft,
    mintedNftWithMetadata,
    mintNftSN,
    isLoading,
    isImageFetching,
    isWalletConnecting,
    canListMintedNft,
    userMintedNftId,
    selectedImage,
    listMintedNft,
    preSubmitMint,
    tryCapture,
    subscribeToMintedNft,
  }
}
