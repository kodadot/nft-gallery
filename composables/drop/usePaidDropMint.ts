import { DropMintedStatus } from '@/services/waifu'
import { ImageDataPayload } from './useGenerativeDropMint'
import useGenerativeDropSubmit from '@/composables/drop/useGenerativeDropSubmit'
import { claimDropItem } from '@/services/waifu'
import { createUnlockableMetadata } from '@/components/collection/unlockable/utils'
import { fetchNft } from '@/components/items/ItemsGrid/useNftActions'

type PaidMintParams = {
  defaultImage: Ref<string>
  collectionId: Ref<string>
  currentAccountMintedToken: Ref<DropMintedStatus | null>
  description: Ref<string | undefined>
  defaultName: Ref<string | undefined>
  collectionName: Ref<string | undefined>
  dropAlias: string
  imageDataPayload: Ref<ImageDataPayload | undefined>
  selectedImage: Ref<string>
  price: Ref<string | undefined>
  maxCount: Ref<number>
  fetchDropStatus: () => Promise<void>
  onStopMint?: () => void
  onMintError?: () => void
}

export default ({
  defaultImage,
  imageDataPayload,
  selectedImage,
  collectionId,
  currentAccountMintedToken,
  price,
  description,
  defaultName,
  collectionName,
  dropAlias,
  maxCount,
  fetchDropStatus,
  onStopMint = () => ({}),
  onMintError = () => ({}),
}: PaidMintParams) => {
  const { toast } = useToast()
  const { accountId } = useAuth()
  const { $i18n, $consola } = useNuxtApp()

  useMultipleBalance()

  const {
    howAboutToExecute,
    isLoading: isTransactionLoading,
    initTransactionLoader,
    isError,
    status,
  } = useMetaTransaction()

  const {
    isLoading,
    isImageFetching,
    isWalletConnecting,
    mintedNft,
    mintedNftWithMetadata,
    mintNftSN,
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

  const maxMintLimitForCurrentUser = computed(() => maxCount.value)

  const mintNft = async () => {
    try {
      isLoading.value = true

      const { apiInstance } = useApi()
      const api = await apiInstance.value
      const collectionRes = (
        await api.query.nfts.collection(collectionId.value)
      ).toJSON() as {
        items: string
      }

      initTransactionLoader()

      const cb = api.tx.nfts.mint
      const args = [
        collectionId.value,
        collectionRes.items,
        accountId.value,
        {
          ownedItem: null,
          mintPrice: price.value,
        },
      ]

      mintNftSN.value = collectionRes.items
      howAboutToExecute(accountId.value, cb, args)
    } catch (e) {
      showNotification(`[MINT::ERR] ${e}`, notificationTypes.warn)
      $consola.error(e)
      isTransactionLoading.value = false
    }
  }

  const submitMint = async (sn: string) => {
    try {
      isImageFetching.value = true

      const imageHash = await tryCapture()

      const hash = await createUnlockableMetadata(
        imageHash,
        description.value,
        collectionName.value || defaultName.value,
        'text/html',
        selectedImage.value,
      )

      isImageFetching.value = false

      const { result } = await claimDropItem(
        {
          account: accountId.value,
          metadata: hash,
          sn,
          image: imageHash,
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
        collection: result.collection,
        chain: result.chain,
        name: result.name,
        image: result.image,
        txHash: result.txHash.versionstamp,
        collectionName: collectionName.value as string,
      }
    } catch (error) {
      toast($i18n.t('drops.mintPerAddress'))
      isImageFetching.value = false
      onMintError()
      throw error
    }
  }

  watch(status, (curStatus) => {
    if (curStatus === TransactionStatus.Block) {
      submitMint(mintNftSN.value)
    }
  })

  watch([isTransactionLoading, status], ([loading, status], [wasLoading]) => {
    if (wasLoading && !loading && status === TransactionStatus.Unknown) {
      onStopMint()
    }
  })

  return {
    maxMintLimitForCurrentUser,
    status,
    isLoading,
    isTransactionLoading,
    isError,
    isImageFetching,
    isWalletConnecting,
    userMintedNftId,
    mintedNft,
    mintedNftWithMetadata,
    canListMintedNft,
    preSubmitMint,
    mintNft,
    listMintedNft,
  }
}
