import type { Prefix } from '@kodadot1/static'
import type { Actions } from '@/composables/transaction/types'

export default function ({ action, prefix = usePrefix().urlPrefix }: { action: Ref<Actions>, prefix?: Ref<Prefix> }) {
  const { accountId } = useAuth()
  const txFee = ref(0)

  const getTransactionFee = async ({ action, prefix }: {
    action: Actions
    prefix: Prefix
  }): Promise<number> => {
    const api = await execByVm({
      SUB: async () => {
        const { apiInstance } = useApi()
        return apiInstance.value
      },
    })

    const fee = await getActionTransactionFee({
      action: { ...action, address: accountId.value } as Actions,
      address: accountId.value,
      api,
      prefix,
    })

    return Number(fee)
  }

  const getFee = () => {
    getTransactionFee({ action: action.value, prefix: prefix.value })
      .then(fee => txFee.value = fee)
      .catch(() => txFee.value = 0)
  }

  watchDebounced(action, getFee, { debounce: 500 })
  onBeforeMount(getFee)

  return {
    txFee,
  }
}
