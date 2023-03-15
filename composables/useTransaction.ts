import { Interaction } from '@kodadot1/minimark'

import { dangerMessage, infoMessage } from '@/utils/notification'
import { ShoppingActions } from '@/utils/shoppingActions'
import { execBuyTx } from './transaction/transactionBuy'
import { execListTx } from './transaction/transactionList'
import { execSendTx } from './transaction/transactionSend'
import { execBurnTx } from './transaction/transactionBurn'
import { execMakeOfferTx } from './transaction/transactionOffer'
import { execWithdrawOfferTx } from './transaction/transactionOfferWithdraw'
import { execAcceptOfferTx } from './transaction/transactionOfferAccept'
import { execMintToken } from './transaction/transactionMintToken'
import { Extrinsic } from '@/utils/transactionExecutor'

import type {
  ActionAcceptOffer,
  ActionBuy,
  ActionConsume,
  ActionList,
  ActionMintToken,
  ActionOffer,
  ActionSend,
  ActionWithdrawOffer,
  Actions,
} from './transaction/types'

export type ExecuteTransactionParams = {
  cb: (...params: any[]) => Extrinsic
  arg: any[]
  onSuccess?: (blockNumber: string) => void
  onError?: () => void
  successMessage?: string
  errorMessage?: string
}

const useExecuteTransaction = () => {
  const { accountId } = useAuth()
  const { howAboutToExecute, isLoading, status, initTransactionLoader } =
    useMetaTransaction()

  const executeTransaction = ({
    cb,
    arg,
    successMessage,
    errorMessage,
    onSuccess,
    onError,
  }: ExecuteTransactionParams) => {
    initTransactionLoader()

    const successCb =
      onSuccess === undefined
        ? () => infoMessage(successMessage || 'Success!')
        : onSuccess
    const errorCb =
      onError === undefined
        ? () => dangerMessage(errorMessage || 'Failed!')
        : onError
    howAboutToExecute(accountId.value, cb, arg, successCb, errorCb)
  }

  return {
    isLoading,
    status,
    executeTransaction,
  }
}

export const useTransaction = () => {
  const { apiInstance } = useApi()
  const { isLoading, status, executeTransaction } = useExecuteTransaction()

  const transaction = async (item: Actions) => {
    const api = await apiInstance.value
    const map = {
      [Interaction.BUY]: () =>
        execBuyTx(item as ActionBuy, api, executeTransaction),
      [Interaction.LIST]: () =>
        execListTx(item as ActionList, api, executeTransaction),
      [Interaction.SEND]: () =>
        execSendTx(item as ActionSend, api, executeTransaction),
      [ShoppingActions.MAKE_OFFER]: () =>
        execMakeOfferTx(item as ActionOffer, api, executeTransaction),
      [ShoppingActions.CONSUME]: () =>
        execBurnTx(item as ActionConsume, api, executeTransaction),
      [ShoppingActions.WITHDRAW_OFFER]: () =>
        execWithdrawOfferTx(
          item as ActionWithdrawOffer,
          api,
          executeTransaction
        ),
      [ShoppingActions.ACCEPT_OFFER]: () =>
        execAcceptOfferTx(item as ActionAcceptOffer, api, executeTransaction),
      [ShoppingActions.MINTNFT]: () =>
        execMintToken(item as ActionMintToken, api, executeTransaction),
    }

    return map[item.interaction]?.() ?? 'UNKNOWN'
  }

  return {
    isLoading,
    status,
    transaction,
  }
}
