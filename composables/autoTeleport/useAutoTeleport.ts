import useAutoTeleportTransition from '@/composables/autoTeleport/useAutoTeleportTransition'
import useAutoTeleportWatch from '@/composables/autoTeleport/useAutoTeleportWatch'
import useAutoTeleportTransactionActions from './useAutoTeleportTransactionActions'
import type { AutoTeleportAction, AutoTeleportTransactions } from './types'

export default function (
  actions: ComputedRef<AutoTeleportAction[]>,
  neededAmount: ComputedRef<number>,
  feelss: boolean = false,
) {
  const {
    hasEnoughInCurrentChain,
    hasEnoughInRichestChain,
    hasBalances,
    optimalTransition,
  } = useAutoTeleportTransition(actions, neededAmount, feelss)

  const {
    teleport: sendXCM,
    getAddressByChain,
    status: teleportStatus,
    txId: teleportTxId,
    isError: teleportIsError,
    isAvailable,
  } = useTeleport()

  const { transactionActions } = useAutoTeleportTransactionActions(actions)

  const transactions = computed<AutoTeleportTransactions>(() => ({
    teleport: {
      status: readonly(teleportStatus),
      txId: readonly(teleportTxId),
      isError: readonly(teleportIsError),
    },
    actions: transactionActions.value,
  }))

  const teleport = async () => {
    const { destination, source, token, amount } = optimalTransition.value

    if (!source) {
      return
    }

    await sendXCM({
      amount: amount,
      from: source.chain,
      fromAddress: getAddressByChain(source.chain),
      to: destination.chain,
      toAddress: getAddressByChain(destination.chain),
      currency: token,
    })
  }

  useAutoTeleportWatch({
    optimalTransition,
    hasEnoughInCurrentChain,
    transactions,
  })

  return {
    hasEnoughInCurrentChain,
    hasEnoughInRichestChain,
    hasBalances,
    optimalTransition,
    transactions,
    isAvailable,
    teleport,
  }
}
