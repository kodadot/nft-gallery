import { getActionTransactionFee } from '@/utils/transactionExecutor'
import { AutoTeleportAction } from './types'
import { type Chain } from '@/utils/teleport'
import { sum } from 'lodash'

export default function () {
  const { apiInstance, apiInstanceByPrefix } = useApi()
  const { chain: currentChain, getAddressByChain } = useTeleport()

  const getActionFees = async (
    actions: AutoTeleportAction[],
  ): Promise<number> => {
    try {
      const feesPromisses = actions.map(async ({ action, prefix }) => {
        let api = await apiInstance.value
        if (prefix) {
          api = await apiInstanceByPrefix(prefix)
        }
        const address = getAddressByChain(currentChain.value as Chain)
        return getActionTransactionFee({
          api,
          action: action,
          address,
        })
      })
      const fees = await Promise.all(feesPromisses)
      return sum(fees.map(Number))
    } catch (error) {
      console.error(`[AUTOTELEPORT]: Failed getting action fee  ${error}`)
      return 0
    }
  }

  return {
    getActionFees,
  }
}
