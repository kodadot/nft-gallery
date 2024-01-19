import holderOfCollectionById from '@/queries/subsquid/general/holderOfCollectionById.graphql'
import { type HolderOfCollectionProp } from '@/components/collection/drop/types'
import { useHolderOfCollectionDrop } from '@/components/drops/useDrops'

type HolderOfCollectionByIdQuery = {
  nftEntitiesConnection: { totalCount: number }
  nftEntities: any[]
}

export default (holderOfCollectionId: ComputedRef<string | undefined>) => {
  const { client } = usePrefix()
  const { accountId } = useAuth()
  const availableNfts = ref(0)
  const { isNftClaimed } = useHolderOfCollectionDrop()

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

  return {
    holderOfCollectionData,
    maxMintLimitForCurrentUser,
    isHolderOfTargetCollection,
    holderOfCollection,
    hasAvailableNfts,
  }
}
