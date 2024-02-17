import resolveQueryPath from '@/utils/queryPathResolver'
import { Event } from '@/components/rmrk/service/types'

export default () => {
  const { client, urlPrefix } = usePrefix()
  const { accountId } = useAuth()

  const totalSpent = ref(0)

  const getUserStats = async () => {
    const query = await resolveQueryPath(client.value, 'profileStatsById')
    const { data } = await useAsyncQuery<{ invested: Event[] }>({
      query: query.default,
      clientId: client.value,
      variables: {
        id: accountId.value,
        denyList: getDenyList(urlPrefix.value),
      },
    })

    const holdingsEvents = data.value?.invested.filter(
      (event) => event.nft.currentOwner === accountId.value,
    )

    totalSpent.value = Number(getSumOfObjectField(holdingsEvents, 'meta'))
  }

  onBeforeMount(getUserStats)

  return {
    totalSpent,
    getUserStats,
  }
}
