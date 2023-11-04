import type {
  ActionTransactionDetails,
  AutoTeleportAction,
} from './useAutoTeleport'

export default function (actions: ComputedRef<AutoTeleportAction[]>) {
  const transactionActions = computed<ActionTransactionDetails[]>(() => {
    return actions.value.map<ActionTransactionDetails>((action, index) => {
      return {
        isError: action.details.isError,
        blockNumber: action.details.blockNumber,
        status: action.details.status,
        isLoading: action.details.isLoading,
        interaction: actions.value[index].action.interaction,
        txId: ref(''),
      }
    })
  })

  return {
    transactionActions,
  }
}
