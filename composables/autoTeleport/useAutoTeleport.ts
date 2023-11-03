import { TransactionStatus } from '@/composables/useTransactionStatus'
import useAutoTeleportTransition from '@/composables/autoTeleport/useAutoTeleportTransition'
import useAutoTeleportWatch from '@/composables/autoTeleport/useAutoTeleportWatch'
import { Actions } from '@/composables/transaction/types'
import { Interaction } from '@kodadot1/minimark/v2'
import useAutoTeleportTransactionActions from './useAutoTeleportTransactionActions'
import { type Prefix } from '@kodadot1/static'

type TransactionDetails = {
  status: ComputedRef<TransactionStatus>
  txId: ComputedRef<string | null>
  isError: Ref<boolean>
  isLoading?: Ref<boolean>
}

export type ActionTransactionDetails = [
  TransactionDetails & { interaction: Interaction },
]

export type AutoTeleportTransactions = {
  teleport: TransactionDetails
  actions: ActionTransactionDetails
}

export type AutoTeleportActionDetails = {
  isLoading: Ref<boolean>
  status: Ref<TransactionStatus>
  isError: Ref<boolean>
  blockNumber?: Ref<string | undefined>
}

export type AutoTeleportAction = {
  action: Actions
  prefix?: string | Prefix
  details: AutoTeleportActionDetails
  transaction?: (item: Actions, prefix: string) => Promise<any>
  handler?: () => Promise<any | void>
}

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

  const transactionsActions = useAutoTeleportTransactionActions(actions)

  const transactions = computed<AutoTeleportTransactions>(() => ({
    teleport: {
      status: computed(() => teleportStatus.value),
      txId: computed(() => teleportTxId.value),
      isError: teleportIsError,
    },
    actions: transactionsActions.value,
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
