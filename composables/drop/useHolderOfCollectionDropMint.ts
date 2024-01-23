import holderOfCollectionById from '@/queries/subsquid/general/holderOfCollectionById.graphql'
import { type HolderOfCollectionProp } from '@/components/collection/drop/types'
import { useHolderOfCollectionDrop } from '@/components/drops/useDrops'
import useGenerativeDropSubmit from '@/composables/drop/useGenerativeDropSubmit'
import { DropMintedStatus } from '@/services/waifu'
import { createUnlockableMetadata } from '@/components/collection/unlockable/utils'
import { claimDropItem } from '@/services/waifu'
import { fetchNft } from '@/components/items/ItemsGrid/useNftActions'
import { ImageDataPayload } from './useGenerativeDropMint'

const KODA_MINTER = '5GGWQ1yiSvS2rPciRtAuK2xQTuxCcgoGZ7dTSzHWws4ELzwD'

type HolderOfCollectionByIdQuery = {
  nftEntitiesConnection: { totalCount: number }
  nftEntities: any[]
}

type HolderOfCollectionDropMintParams = {
  holderOfCollectionId: ComputedRef<string | undefined>
  defaultImage: Ref<string>
  collectionId: Ref<string>
  currentAccountMintedToken: Ref<DropMintedStatus | null>
  description: Ref<string | undefined>
  defaultName: Ref<string | undefined>
  collectionName: Ref<string | undefined>
  mintedAmountForCurrentUser: Ref<number>
  dropAlias: string
  imageDataPayload: Ref<ImageDataPayload | undefined>
  selectedImage: Ref<string>
  fetchDropStatus: () => Promise<void>
}

export default ({
  holderOfCollectionId,
  defaultImage,
  collectionId,
  currentAccountMintedToken,
  description,
  defaultName,
  collectionName,
  mintedAmountForCurrentUser,
  dropAlias,
  imageDataPayload,
  selectedImage,
  fetchDropStatus,
}: HolderOfCollectionDropMintParams) => {
  const { client } = usePrefix()
  const { accountId } = useAuth()
  const { $i18n, $consola } = useNuxtApp()
  const { isNftClaimed } = useHolderOfCollectionDrop()
  const { toast } = useToast()

  const {
    isLoading,
    isImageFetching,
    isWalletConnecting,
    userMintedNftId,
    mintNftSN,
    mintedNft,
    mintedNftWithMetadata,
    preSubmitMint,
    tryCapture,
    subscribeToMintedNft,
  } = useGenerativeDropSubmit({
    defaultImage,
    imageDataPayload,
    collectionId,
    currentAccountMintedToken,
    selectedImage,
  })

  const {
    howAboutToExecute,
    isLoading: isTransactionLoading,
    isCancelled: isTransactionCancelled,
    initTransactionLoader,
    status,
  } = useMetaTransaction()

  const { data: holderOfCollectionData } = useAsyncData(
    'holderOfCollectionData',
    async () =>
      await useAsyncQuery<HolderOfCollectionByIdQuery>({
        clientId: client.value,
        query: holderOfCollectionById,
        variables: {
          id: holderOfCollectionId.value,
          account: accountId.value,
        },
      }).then((res) => res.data.value),
    {
      watch: [accountId],
    },
  )

  const availableNfts = ref(0)

  const maxMintLimitForCurrentUser = computed(
    () => holderOfCollectionData.value?.nftEntitiesConnection?.totalCount || 0,
  )

  const isHolderOfTargetCollection = computed(
    () => maxMintLimitForCurrentUser.value > 0,
  )

  const hasAvailableNfts = computed(() => availableNfts.value !== 0)

  const holderOfCollection = computed<HolderOfCollectionProp>(() => ({
    id: holderOfCollectionId.value as string,
    isHolder: isHolderOfTargetCollection.value,
    hasAvailable: hasAvailableNfts.value,
    amount: {
      total: maxMintLimitForCurrentUser.value,
      available: availableNfts.value,
    },
  }))

  const mintNft = async () => {
    try {
      isLoading.value = true
      isTransactionCancelled.value = false

      const { apiInstance } = useApi()
      const api = await apiInstance.value
      const collectionRes = (
        await api.query.nfts.collection(collectionId.value)
      ).toJSON() as {
        items: string
      }

      const ownedNftToUse = holderOfCollectionData.value?.nftEntities?.at(
        mintedAmountForCurrentUser.value,
      )

      initTransactionLoader()
      const cb = api.tx.utility.batchAll
      const mint = api.tx.nfts.mint(
        collectionId.value,
        collectionRes.items,
        accountId.value,
        {
          ownedItem: ownedNftToUse.sn,
          mintPrice: null,
        },
      )

      const transfer = api.tx.balances.transfer(KODA_MINTER, 2e9)

      mintNftSN.value = collectionRes.items
      howAboutToExecute(accountId.value, cb, [[mint, transfer]])
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
        description.value || '',
        (collectionName.value || defaultName.value) as string,
        'text/html',
        selectedImage.value,
      )

      isImageFetching.value = false

      const { result } = await claimDropItem(
        {
          account: accountId.value,
          metadata: hash,
          sn,
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

  watch(status, (curStatus) => {
    if (curStatus === TransactionStatus.Block) {
      submitMint(mintNftSN.value)
    }
  })

  const checkAvailableNfts = async () => {
    const nftEntities = holderOfCollectionData.value?.nftEntities || []
    const nftIds = nftEntities.map((nft) => nft.sn)
    const claimed = await Promise.all(
      nftIds.map((sn) =>
        isNftClaimed(sn, holderOfCollectionId.value as string),
      ),
    )
    availableNfts.value = claimed.filter((x) => !x).length
  }

  watch(holderOfCollectionData, checkAvailableNfts, { immediate: true })

  watch(isTransactionCancelled, (isCancelled) => {
    if (isCancelled) {
      isLoading.value = false
    }
  })

  return {
    maxMintLimitForCurrentUser,
    isHolderOfTargetCollection,
    holderOfCollection,
    hasAvailableNfts,
    isLoading,
    status,
    isImageFetching,
    isWalletConnecting,
    selectedImage,
    userMintedNftId,
    preSubmitMint,
    mintNft,
  }
}
