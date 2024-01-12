import { TransactionStatus } from '@/composables/useTransactionStatus'
import type {
  Actions,
  ActionsInteractions,
} from '@/composables/transaction/types'
import { type Prefix } from '@kodadot1/static'
import { type DeepReadonly } from 'vue'
import { ActionlessInteraction } from '@/components/common/autoTeleport/utils'

type TransactionDetails = {
  status: DeepReadonly<Ref<TransactionStatus>>
  txId: DeepReadonly<Ref<string | null>>
  isError: DeepReadonly<Ref<boolean>>
}

export type ActionTransactionDetails = TransactionDetails & {
  isLoading: Ref<boolean>
  interaction: ActionsInteractions
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
  action?: Actions
  interaction?: ActionlessInteraction
  prefix?: string | Prefix
  details: AutoTeleportActionDetails
}

export type AutoTeleportActionHandlerParams = { isRetry: boolean }

export type AutoTeleportAction = {
  transaction?: (item: Actions, prefix: string) => Promise<any>
  handler?: (params: AutoTeleportActionHandlerParams) => Promise<any | void>
} & AutoTeleportBaseAction

export type AutoTeleportFeeParams = {
  actions?: number
  actionAutoFees?: boolean
  actionLazyFetch?: boolean
}

export type AutoteleportInteraction = ActionsInteractions &
  ActionlessInteraction
