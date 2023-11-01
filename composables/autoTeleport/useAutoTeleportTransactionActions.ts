import { ActionTransactionDetails, AutoTeleportAction } from './useAutoTeleport'

export default function (actions: ComputedRef<AutoTeleportAction[]>) {
  const transactionActions = computed<ActionTransactionDetails>(() => {
    return actions.value.map(({ details }, index) => ({
      isLoading: details.isLoading,
      isError: details.isError,
      blockNumber: details.blockNumber,
      status: details.status,
      interaction: actions.value[index].action.interaction,
    }))
  })

  return transactionActions
}
