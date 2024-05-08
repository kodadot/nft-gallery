import { TransactionStatus } from '../useTransactionStatus'
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

export default function ({
  actions,
  teleportTxId,
}: {
  actions: ComputedRef<AutoTeleportAction[]>
  teleportTxId: Ref<string | null>
}) {
  const actionSessionStatus = ref(
    new Map<string, Record<AutoteleportInteraction, TransactionStatus>>(),
  )

  const transactionActions = computed<ActionTransactionDetails[]>(() => {
    return actions.value.map<ActionTransactionDetails>((action, index) => {
      return {
        isError: computed(
          () =>
            action.details.isError ||
            action.details.status === TransactionStatus.Cancelled,
        ),
        blockNumber: toRef(() => action.details.blockNumber),
        status: computed(
          () =>
            actionSessionStatus.value.get(teleportTxId.value!)?.[
              action.interaction!
            ] ?? TransactionStatus.Unknown,
        ),
        isLoading: toRef(() => action.details.isLoading),
        interaction: getAutoTeleportActionInteraction(actions.value[index]),
        txId: ref(''),
      }
    })
  })

  watch(
    actions,
    (actions) => {
      if (!teleportTxId.value) {
        return
      }

      actions.forEach((action) => {
        actionSessionStatus.value.set(teleportTxId.value!, {
          ...(actionSessionStatus.value.get(teleportTxId.value!) || {}),
          [action.interaction as string]: action.details.status,
        })
      })
    },
    { deep: true },
  )

  return {
    transactionActions,
  }
}
