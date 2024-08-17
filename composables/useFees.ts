import type { Prefix } from '@kodadot1/static'
import type { Actions } from '@/composables/transaction/types'

export default function () {
  const { accountId } = useAuth()

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

  return {
    getTransactionFee,
  }
}
