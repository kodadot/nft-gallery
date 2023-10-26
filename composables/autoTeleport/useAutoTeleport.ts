import { TransactionStatus } from '@/composables/useTransactionStatus'
import useAutoTeleportTransition from '@/composables/autoTeleport/useAutoTeleportTransition'
import { Actions } from '@/composables/transaction/types'
import { useIntervalFn } from '@vueuse/core'
import { type Prefix } from '@kodadot1/static'

type TransactionDetails = {
  status: ComputedRef<TransactionStatus>
  txId: ComputedRef<string | null>
  isError: Ref<boolean>
  isLoading: Ref<boolean>
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
  const { fetchMultipleBalance } = useMultiBalance()

  const transactions = computed<AutoTeleportTransactions>(() => ({
    teleport: {
      status: computed(() => teleportStatus.value),
      txId: computed(() => teleportTxId.value),
      isError: teleportIsError,
      isLoading: ref(false),
    },
    action: {
      status: computed(() => actionStatus.value),
      txId: computed(() => ''),
      isError: actionIsError,
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

  watch(teleportStatus, () => {
    if (teleportStatus.value === TransactionStatus.Finalized) {
      resume()
    }
  })

  return {
    hasEnoughInCurrentChain,
    hasEnoughInRichestChain,
    optimalTransition,
    transactions,
    teleport,
    isAvailable,
    transaction,
  }
}
