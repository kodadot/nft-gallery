import resolveQueryPath from '@/utils/queryPathResolver'
import type { InteractionWithNFT } from '@/composables/collectionActivity/types'

export default () => {
  const { client, urlPrefix } = usePrefix()
  const { accountId } = useAuth()

  const totalSpent = ref(0)

  const getUserStats = async () => {
    const query = await resolveQueryPath(client.value, 'profileStatsById')
    const { data } = await useAsyncQuery<{ invested: InteractionWithNFT[] }>({
      query: query.default,
      clientId: client.value,
      variables: {
        id: accountId.value,
        denyList: getDenyList(urlPrefix.value),
      },
    })

    const holdingsEvents = data.value?.invested.filter(
      event => event.nft.currentOwner === accountId.value,
    )

    totalSpent.value = Number(getSumOfObjectField(holdingsEvents, 'meta'))
  }

  onBeforeMount(getUserStats)

  watch(accountId, (value) => {
    if (!value) {
      totalSpent.value = 0
    }
  })

  return {
    totalSpent,
    getUserStats,
  }
}
