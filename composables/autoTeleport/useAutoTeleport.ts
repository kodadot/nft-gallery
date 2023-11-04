import { TransactionStatus } from '@/composables/useTransactionStatus'
import useAutoTeleportTransition from '@/composables/autoTeleport/useAutoTeleportTransition'
import useAutoTeleportWatch from '@/composables/autoTeleport/useAutoTeleportWatch'
import { Actions } from '@/composables/transaction/types'
import { Interaction } from '@kodadot1/minimark/v1'
import useAutoTeleportTransactionActions from './useAutoTeleportTransactionActions'
import { type Prefix } from '@kodadot1/static'
import type { DeepReadonly } from 'vue'
import { ShoppingActions } from '@/utils/shoppingActions'

type TransactionDetails = {
  status: DeepReadonly<Ref<TransactionStatus>>
  txId: DeepReadonly<Ref<string | null>>
  isError: DeepReadonly<Ref<boolean>>
}

export type ActionTransactionDetails = TransactionDetails & {
  isLoading: Ref<boolean>
  interaction: Interaction | ShoppingActions
  blockNumber?: Ref<string | undefined>
}

export type AutoTeleportTransactions = {
  teleport: TransactionDetails
  actions: ActionTransactionDetails[]
}

export type AutoTeleportActionDetails = {
  isLoading: Ref<boolean>
  status: Ref<TransactionStatus>
  isError: Ref<boolean>
  blockNumber?: Ref<string | undefined>
}

type AutoTeleportBaseAction = {
  action: Actions
  prefix?: string | Prefix
  details: AutoTeleportActionDetails
}

export type AutoTeleportAction = {
  transaction?: (item: Actions, prefix: string) => Promise<any>
  handler?: () => Promise<any | void>
} & AutoTeleportBaseAction

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
