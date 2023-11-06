import type { ActionTransactionDetails, AutoTeleportAction } from './types'

const isCancelled = (
  action: AutoTeleportAction,
  prevAction?: AutoTeleportAction,
) => {
  const loading = action.details.isLoading
  const status = action.details.status

  let prevLoading = false
  let prevStatus = ''

  if (prevAction) {
    prevLoading = prevAction.details.isLoading
    prevStatus = prevAction.details.status
  }

  return (
    !loading &&
    prevLoading &&
    prevStatus === TransactionStatus.Unknown &&
    status === TransactionStatus.Unknown
  )
}

export default function (actions: ComputedRef<AutoTeleportAction[]>) {
  const actionsCancelled = ref(new Map())

  const transactionActions = computed<ActionTransactionDetails[]>(() => {
    return actions.value.map<ActionTransactionDetails>((action, index) => {
      return {
        isError: toRef(
          () =>
            action.details.isError ||
            actionsCancelled.value.get(action.action.interaction),
        ),
        blockNumber: toRef(() => action.details.blockNumber),
        status: toRef(() => action.details.status),
        isLoading: toRef(() => action.details.isLoading),
        interaction: actions.value[index].action.interaction,
        txId: ref(''),
      }
    })
  })

  watch(
    actions,
    (newActions, prevActions) => {
      newActions.forEach((action, index) => {
        const cancelled = isCancelled(action, prevActions && prevActions[index])
        actionsCancelled.value.set(action.action.interaction, cancelled)
      })
    },
    { immediate: true, deep: true },
  )

  const clear = () => {
    const interactions = actions.value.map(
      (action) => action.action.interaction,
    )
    interactions.forEach((interaction) => {
      actionsCancelled.value.set(interaction, false)
    })
  }

  return {
    transactionActions,
    clear,
  }
}
