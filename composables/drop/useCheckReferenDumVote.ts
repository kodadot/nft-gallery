import referendumVoteByAccount from '@/queries/referendumVoteByAccount.graphql'
import { getss58AddressByPrefix } from '@/utils/account'

export const useCheckReferenDumVote = () => {
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
    const { data } = await useAsyncQuery({
      query: referendumVoteByAccount,
      variables: {
        account: getss58AddressByPrefix(accountId.value, 'dot'),
      },
      clientId: 'polkassembly',
    })

    if (data.value.votes.length > 0) {
      isEligibleUser.value = true
    }
  }

  return {
    isEligibleUser,
  }
}
