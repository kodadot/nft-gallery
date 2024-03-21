import holderOfCollectionById from '@/queries/subsquid/general/holderOfCollectionById.graphql'
import { HolderOfCollection } from '@/components/collection/drop/types'
import { useHolderOfCollectionDrop } from '@/components/drops/useDrops'

export default function useHolderOfCollection() {
  const { drop, runtimeMintCount } = useDropStore()
  const { accountId } = useAuth()
  const { client } = usePrefix()
  const { isNftClaimed } = useHolderOfCollectionDrop()

  const holderOfCollectionData = ref<{
    nftEntitiesConnection: { totalCount: number }
    nftEntities: Array<{ sn: string }>
  }>()

  const availableNfts = reactive<{
    isLoading: boolean
    serialNumbers: string[]
  }>({
    isLoading: true,
    serialNumbers: [],
  })

  const maxMintLimitForCurrentUser = computed(
    () => holderOfCollectionData.value?.nftEntitiesConnection?.totalCount ?? 0,
  )

  const isHolderOfTargetCollection = computed(
    () => maxMintLimitForCurrentUser.value > 0,
  )

  const holderOfCollection = computed<HolderOfCollection>(() => ({
    id: drop.holder_of as string,
    isHolder: isHolderOfTargetCollection.value,
    hasAvailable: availableNfts.serialNumbers.length > 0,
    isLoading: availableNfts.isLoading,
    amount: {
      total: maxMintLimitForCurrentUser.value,
      available: availableNfts.serialNumbers.length,
    },
  }))

  const checkAvailableNfts = async () => {
    availableNfts.isLoading = true
    const nftEntities = holderOfCollectionData.value?.nftEntities ?? []
    availableNfts.serialNumbers = []
    const claimed = await Promise.all(
      nftEntities.map(({ sn }) =>
        isNftClaimed(sn, drop.holder_of as string, drop.collection),
      ),
    )
    claimed.forEach((isClaimed, index) => {
      if (!isClaimed) {
        availableNfts.serialNumbers.push(nftEntities[index].sn)
      }
    })
    availableNfts.isLoading = false
  }

  watchEffect(() => {
    if (drop.holder_of || runtimeMintCount) {
      useAsyncQuery<{
        nftEntitiesConnection: { totalCount: number }
        nftEntities: Array<{ sn: string }>
      }>({
        clientId: client.value,
        query: holderOfCollectionById,
        variables: {
          id: drop.holder_of,
          account: accountId.value,
        },
      }).then((res) => {
        holderOfCollectionData.value = res.data.value
        checkAvailableNfts()
      })
    }
  })

  return {
    holderOfCollectionData,
    availableNfts,
    holderOfCollection,
  }
}
