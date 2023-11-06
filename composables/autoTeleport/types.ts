import { TransactionStatus } from '@/composables/useTransactionStatus'
import { Interaction } from '@kodadot1/minimark/v1'
import { ShoppingActions } from '@/utils/shoppingActions'
import { type Actions } from '@/composables/transaction/types'
import { type Prefix } from '@kodadot1/static'
import { type DeepReadonly } from 'vue'

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
  isLoading: boolean
  status: TransactionStatus
  isError: boolean
  blockNumber?: string | undefined
}

type AutoTeleportBaseAction = {
  action: Actions
  prefix?: string | Prefix
  details: AutoTeleportActionDetails
}

export type AutoTeleportActionHandlerParams = { isRetry: boolean }

export type AutoTeleportAction = {
  transaction?: (item: Actions, prefix: string) => Promise<any>
  handler?: (params: AutoTeleportActionHandlerParams) => Promise<any | void>
} & AutoTeleportBaseAction
