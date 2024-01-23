import useGenerativeDropSubmit, {
  type GenerativeDropMintParams,
} from '@/composables/drop/useGenerativeDropSubmit'
import { createUnlockableMetadata } from '@/components/collection/unlockable/utils'
import { fetchNft } from '@/components/items/ItemsGrid/useNftActions'
import { doWaifu } from '@/services/waifu'

type FreeDropMintParams = {
  description: Ref<string | undefined>
  defaultName: Ref<string | undefined>
  collectionName: Ref<string | undefined>
  dropAlias: string
  fetchDropStatus: () => Promise<void>
} & GenerativeDropMintParams

export default ({
  defaultImage,
  imageDataPayload,
  selectedImage,
  collectionId,
  currentAccountMintedToken,
  description,
  defaultName,
  collectionName,
  dropAlias,
  fetchDropStatus,
}: FreeDropMintParams) => {
  const { toast } = useToast()
  const { accountId } = useAuth()
  const preferencesStore = usePreferencesStore()
  const { fetchMultipleBalance } = useMultipleBalance()
  const { $i18n } = useNuxtApp()

  const {
    isLoading,
    isImageFetching,
    isWalletConnecting,
    mintedNft,
    mintedNftWithMetadata,
    canListMintedNft,
    userMintedNftId,
    preSubmitMint,
    tryCapture,
    subscribeToMintedNft,
    listMintedNft,
  } = useGenerativeDropSubmit({
    defaultImage,
    imageDataPayload,
    collectionId,
    currentAccountMintedToken,
    selectedImage,
  })

  const submitMint = async () => {
    try {
      isImageFetching.value = true
      isLoading.value = true

      const imageHash = await tryCapture()

      const hash = await createUnlockableMetadata(
        imageHash,
        description.value as string,
        (collectionName.value || defaultName.value) as string,
        'text/html',
        selectedImage.value,
      )

      isImageFetching.value = false

      const { result } = await doWaifu(
        {
          address: accountId.value,
          metadata: hash,
          image: imageHash,
          email: preferencesStore.getNewsletterSubscription.email,
        },
        dropAlias,
      )

      await fetchDropStatus()

      const id = `${collectionId.value}-${result.sn}`

      subscribeToMintedNft(id, async () => {
        mintedNftWithMetadata.value = await fetchNft(id)
      })

      isLoading.value = false

      mintedNft.value = {
        ...result,
        id,
        name: result.name,
        collectionName: collectionName.value,
      }
    } catch (error) {
      toast($i18n.t('drops.mintPerAddress'))
      isImageFetching.value = false
      throw error
    }
  }

  return {
    isLoading,
    isWalletConnecting,
    mintedNft,
    canListMintedNft,
    userMintedNftId,
    preSubmitMint,
    fetchMultipleBalance,
    submitMint,
    listMintedNft,
  }
}
