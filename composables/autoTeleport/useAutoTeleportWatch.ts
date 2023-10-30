import { useIntervalFn } from '@vueuse/core'
import { type Prefix } from '@kodadot1/static'
import { AutoTeleportTransactions } from './useAutoTeleport'

export default function ({
  optimalTransition,
  hasEnoughInCurrentChain,
  transactions,
  actionCancelled,
  transaction: action,
}: {
  transaction: () => Promise<any>
  optimalTransition: Ref<TeleportTransition>
  hasEnoughInCurrentChain: ComputedRef<boolean>
  transactions: ComputedRef<AutoTeleportTransactions>
  actionCancelled: Ref<boolean>
}) {
  const { fetchMultipleBalance } = useMultipleBalance()

  const { pause, resume, isActive } = useIntervalFn(
    async () => {
      await fetchMultipleBalance([
        optimalTransition.value.source?.prefix as Prefix,
        optimalTransition.value.destination.prefix,
      ])
    },
    10000,
    { immediate: false },
  )

  watch([isActive, hasEnoughInCurrentChain], ([active, enoughInCurrent]) => {
    if (active && enoughInCurrent) {
      pause()
      action()
    }
  })

  watch(
    () => transactions.value.teleport.status.value,
    (teleportStatus) => {
      if (teleportStatus === TransactionStatus.Finalized) {
        resume()
      }
    },
  )

  watch(
    [
      () => transactions.value.action.isLoading?.value,
      () => transactions.value.action.status.value,
    ],
    ([loading, status], [prevLoading, prevStatus]) => {
      actionCancelled.value =
        !loading &&
        prevLoading &&
        prevStatus === TransactionStatus.Unknown &&
        status === TransactionStatus.Unknown
    },
  )
}
