import type {
  ActionTransactionDetails,
  AutoTeleportAction,
  AutoteleportInteraction,
} from './types'

export const getAutoTeleportActionInteraction = (
  autoTeleportAction: AutoTeleportAction,
): AutoteleportInteraction =>
  (autoTeleportAction.action?.interaction ||
    autoTeleportAction.interaction) as AutoteleportInteraction

export default function (actions: ComputedRef<AutoTeleportAction[]>) {
  const transactionActions = computed<ActionTransactionDetails[]>(() => {
    return actions.value.map<ActionTransactionDetails>((action, index) => {
      return {
        isError: computed(
          () =>
            action.details.isError ||
            action.details.status === TransactionStatus.Cancelled,
        ),
        blockNumber: toRef(() => action.details.blockNumber),
        status: toRef(() => action.details.status),
        isLoading: toRef(() => action.details.isLoading),
        interaction: getAutoTeleportActionInteraction(actions.value[index]),
        txId: ref(''),
      }
    })
  })

  return {
    transactionActions,
  }
}
