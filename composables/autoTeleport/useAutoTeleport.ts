import { TransactionStatus } from '@/composables/useTransactionStatus'
import useAutoTeleportTransition from '@/composables/autoTeleport/useAutoTeleportTransition'
import useAutoTeleportWatch from '@/composables/autoTeleport/useAutoTeleportWatch'
import { Actions } from '@/composables/transaction/types'

type TransactionDetails = {
  status: ComputedRef<TransactionStatus>
  txId: ComputedRef<string | null>
  isError: Ref<boolean>
  isLoading?: Ref<boolean>
}

export type AutoTeleportTransactions = {
  teleport: TransactionDetails
  action: TransactionDetails
}

export default function (
  action: ComputedRef<Actions>,
  neededAmount: ComputedRef<number>,
) {
  const {
    hasEnoughInCurrentChain,
    hasEnoughInRichestChain,
    optimalTransition,
  } = useAutoTeleportTransition(neededAmount)

  const {
    teleport: sendXCM,
    getAddressByChain,
    status: teleportStatus,
    txId: teleportTxId,
    isError: teleportIsError,
    isAvailable,
  } = useTeleport()
  const {
    transaction: actionTransaction,
    status: actionStatus,
    isLoading: actionLoading,
    isError: actionIsError,
  } = useTransaction()
  const actionCancelled = ref(false)

  const transactions = computed<AutoTeleportTransactions>(() => ({
    teleport: {
      status: computed(() => teleportStatus.value),
      txId: computed(() => teleportTxId.value),
      isError: teleportIsError,
    },
    action: {
      status: computed(() => actionStatus.value),
      txId: computed(() => ''),
      isError: computed(() => actionIsError.value || actionCancelled.value),
      isLoading: actionLoading,
    },
  }))

  const transaction = async () => {
    await actionTransaction(action.value)
  }

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
    actionCancelled,
  })

  return {
    hasEnoughInCurrentChain,
    hasEnoughInRichestChain,
    optimalTransition,
    transactions,
    isAvailable,
    teleport,
    transaction,
  }
}
