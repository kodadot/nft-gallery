import profileStatsByIdRefined from '~/queries/subsquid/general/profileStatsByIdRefined'

export default () => {
  const { client, urlPrefix } = usePrefix()
  const { accountId } = useAuth()
  const { $apolloClient } = useNuxtApp()

  const totalSpent = ref(0)

  const getUserStats = async () => {
    const { data } = await $apolloClient.query({
      query: profileStatsByIdRefined,
      variables: {
        id: accountId.value,
        denyList: getDenyList(urlPrefix.value),
      },
      context: {
        endpoint: client.value,
      },
    })

    const holdingsEvents = data?.invested.filter(
      event => event.nft.currentOwner === accountId.value,
    )

    if (!holdingsEvents) {
      return
    }

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
