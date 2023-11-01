import { useIntervalFn } from '@vueuse/core'
import { type Prefix } from '@kodadot1/static'
import { AutoTeleportTransactions } from './useAutoTeleport'

export default function ({
  optimalTransition,
  hasEnoughInCurrentChain,
  transactions,
}: {
  optimalTransition: Ref<TeleportTransition>
  hasEnoughInCurrentChain: ComputedRef<boolean>
  transactions: ComputedRef<AutoTeleportTransactions>
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
}
