import useGenerativeDropSubmit from '@/composables/drop/useGenerativeDropSubmit'
import { DropMintedStatus } from '@/services/waifu'
import { createUnlockableMetadata } from '@/components/collection/unlockable/utils'
import { fetchNft } from '@/components/items/ItemsGrid/useNftActions'
import { ImageDataPayload } from './useGenerativeDropMint'
import { doWaifu } from '@/services/waifu'

type FreeDropMintParams = {
  defaultImage: Ref<string>
  collectionId: Ref<string>
  currentAccountMintedToken: Ref<DropMintedStatus | null>
  description: Ref<string | undefined>
  defaultName: Ref<string | undefined>
  collectionName: Ref<string | undefined>
  dropAlias: string
  imageDataPayload: Ref<ImageDataPayload | undefined>
  selectedImage: Ref<string>
  fetchDropStatus: () => Promise<void>
}

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
    mintedNftWithMetadata,
    canListMintedNft,
    userMintedNftId,
    preSubmitMint,
    fetchMultipleBalance,
    submitMint,
    listMintedNft,
  }
}
