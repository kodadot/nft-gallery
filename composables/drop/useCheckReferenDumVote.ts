import referendumVoteByAccount from '@/queries/referendumVoteByAccount.graphql'

export const useCheckReferenDumVote = () => {
  const { $apollo } = useNuxtApp()
  const { accountId } = useAuth()
  const isEligibleUser = ref(false)

  onMounted(() => {
    checkReferenDumVote()
  })
  watch(accountId, () => {
    checkReferenDumVote()
  })

  const checkReferenDumVote = async () => {
    if (!accountId.value) {
      isEligibleUser.value = false
    }
    const {
      data: { votes },
    } = await $apollo.query({
      query: referendumVoteByAccount,
      client: 'polkassembly',
      variables: {
        account: accountId.value,
      },
    })

    if (votes.length > 0) {
      isEligibleUser.value = true
    }

    console.log('checkReferenDumVote', votes)
  }

  return {
    isEligibleUser,
  }
}
