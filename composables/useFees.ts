import type { Actions } from '@/composables/transaction/types'

export default function () {
  const { accountId } = useAuth()

  const getTransactionFee = async ({ action }: {
    action: Actions
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
    })

    return Number(fee)
  }

  return {
    getTransactionFee,
  }
}
