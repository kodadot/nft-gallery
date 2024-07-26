import type { Address } from 'viem'
import type { Prefix } from '@kodadot1/static'
import type { Actions } from '@/composables/transaction/types'

type GetFeeParams = {
  prefix: Prefix
  action: Actions
}

export default function () {
  const { accountId } = useAuth()

  const getSubstrateFee = async ({ action }: GetFeeParams): Promise<number> => {
    const { apiInstance } = useApi()
    const api = await apiInstance.value
    const fee = await getActionTransactionFee({
      action: { ...action, address: accountId.value } as Actions,
      address: accountId.value,
      api,
    })
    return Number(fee)
  }

  const getEvmFee = async ({ prefix }: GetFeeParams): Promise<number> => {
    const { publicClient } = useViem(prefix)

    const estimatedGas = await publicClient.estimateGas({
      to: accountId.value as Address,
      value: BigInt('1000000000000000000'),
      data: '0x',
    })

    const gasPrice = await publicClient.getGasPrice()

    return Number(estimatedGas * gasPrice)
  }

  const getTransactionFee = async (params: GetFeeParams): Promise<number> => {
    try {
      return execByVm({
        SUB: () => getSubstrateFee(params),
        EVM: () => getEvmFee(params),
      }) as Promise<number>
    } catch (error) {
      return 0
    }
  }

  return {
    getTransactionFee
  }
}
