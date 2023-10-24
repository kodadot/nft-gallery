import { TransactionStatus } from '@/composables/useTransactionStatus'
import useAutoTeleportTransition from '@/composables/autoTeleport/useAutoTeleportTransition'
import { Actions } from '@/composables/transaction/types'
import { useIntervalFn } from '@vueuse/core'

type TransactionDetails = {
  status: ComputedRef<TransactionStatus>
  txId: ComputedRef<string | null>
  error: ComputedRef<string | null>
}

export type AutoTeleportTransactionStatus = {
  teleport: TransactionDetails
  action: TransactionDetails
}

export default function (action: Actions, neededAmount: ComputedRef<number>) {
  const {
    hasEnoughInCurrentChain,
    hasEnoughInRichestChain,
    optimalTransition,
  } = useAutoTeleportTransition(action, neededAmount)

  const {
    teleport: sendXCM,
    getAddressByChain,
    status: teleportStatus,
    txId: teleportTxId,
    error: teleportError,
    isAvailable,
  } = useTeleport()
  const { transaction: actionTransaction, status: actionStatus } =
    useTransaction()
  const { fetchMultipleBalance } = useMultiBalance()

  const status = computed<AutoTeleportTransactionStatus>(() => ({
    teleport: {
      status: computed(() => teleportStatus.value),
      txId: computed(() => teleportTxId.value),
      error: computed(() => teleportError.value),
    },
    action: {
      status: computed(() => actionStatus.value),
      txId: computed(() => ''),
      error: computed(() => ''),
    },
  }))

  const transaction = async () => {
    await actionTransaction(action)
  }

  const teleport = async () => {
    const { destination, source, token, amount } = optimalTransition.value

    if (!source) {
      return
    }

    await sendXCM({
      amount: amount,
      from: source?.chain,
      to: destination.chain,
      fromAddress: getAddressByChain(source?.chain),
      toAddress: getAddressByChain(destination?.chain),
      currency: token,
    })
  }

  const { pause, resume, isActive } = useIntervalFn(
    async () => {
      await fetchMultipleBalance()
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
    status,
    teleport,
    isAvailable,
    transaction,
  }
}
