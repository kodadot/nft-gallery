import referendumVoteByAccount from '@/queries/referendumVoteByAccount.graphql'
import { getss58AddressByPrefix } from '@/utils/account'

export const useCheckReferenDumVote = (proposal?: number) => {
  const { accountId } = useAuth()
  const isEligibleUser = ref(false)

  watch([accountId, proposal], () => {
    checkReferenDumVote()
  })

  const checkReferenDumVote = async () => {
    if (!accountId.value) {
      isEligibleUser.value = false
    }
    if (proposal) {
      const { data } = await useAsyncQuery({
        query: referendumVoteByAccount,
        variables: {
          account: getss58AddressByPrefix(accountId.value, 'dot'),
          proposal: proposal,
        },
        clientId: 'polkassembly',
      })

      if (data.value.votes.length > 0) {
        isEligibleUser.value = true
      }
    }
  }

  return {
    isEligibleUser,
  }
}
