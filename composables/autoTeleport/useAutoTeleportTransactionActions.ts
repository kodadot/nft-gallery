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
  const actionsCancelled = ref(new Map<AutoteleportInteraction, boolean>())

  const transactionActions = computed<ActionTransactionDetails[]>(() => {
    return actions.value.map<ActionTransactionDetails>((action, index) => {
      return {
        isError: toRef(
          () =>
            action.details.isError ||
            actionsCancelled.value.get(
              getAutoTeleportActionInteraction(action),
            ) ||
            false,
        ),
        blockNumber: toRef(() => action.details.blockNumber),
        status: toRef(() => action.details.status),
        isLoading: toRef(() => action.details.isLoading),
        interaction: getAutoTeleportActionInteraction(actions.value[index]),
        txId: ref(''),
      }
    })
  })

  watch(
    actions,
    (actions) => {
      actions.forEach((action) => {
        const cancelled = action.details.status === TransactionStatus.Cancelled
        actionsCancelled.value.set(
          getAutoTeleportActionInteraction(action),
          cancelled,
        )
      })
    },
    { immediate: true, deep: true },
  )

  const clear = () => {
    const interactions = actions.value.map(getAutoTeleportActionInteraction)
    interactions.forEach((interaction) => {
      actionsCancelled.value.set(interaction, false)
    })
  }

  return {
    transactionActions,
    clear,
  }
}
