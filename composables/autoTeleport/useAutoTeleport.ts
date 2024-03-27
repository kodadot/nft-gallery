import useAutoTeleportTransition from '@/composables/autoTeleport/useAutoTeleportTransition'
import useAutoTeleportWatch from '@/composables/autoTeleport/useAutoTeleportWatch'
import useAutoTeleportTransactionActions from './useAutoTeleportTransactionActions'
import useAutoTeleportTransitionDetails from './useAutoTeleportTransitionDetails'
import type {
  AutoTeleportAction,
  AutoTeleportFeeParams,
  AutoTeleportTransactions,
} from './types'

export default function (
  actions: ComputedRef<AutoTeleportAction[]>,
  neededAmount: ComputedRef<number>,
  fees: AutoTeleportFeeParams,
) {
  const autoTeleportStarted = ref(false)

  const {
    teleport: sendXCM,
    getAddressByChain,
    status: teleportStatus,
    txId: teleportTxId,
    isError: teleportIsError,
    isAvailable,
  } = useTeleport()

  const { optimalTransition } = useAutoTeleportTransition({
    actions,
    neededAmount,
    fees,
    autoTeleportStarted,
  })

  const { hasEnoughInCurrentChain } = useAutoTeleportTransitionDetails(
    actions,
    neededAmount,
    fees,
  )

  const { transactionActions, clear: clearActions } =
    useAutoTeleportTransactionActions(actions)

  const clear = () => {
    clearActions()
    teleportStatus.value = TransactionStatus.Unknown
    teleportIsError.value = false
    teleportTxId.value = ''
    autoTeleportStarted.value = false
  }

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

    autoTeleportStarted.value = true

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
    optimalTransition,
    transactions,
    isAvailable,
    teleport,
    clear,
  }
}
