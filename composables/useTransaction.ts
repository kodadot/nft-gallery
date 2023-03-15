import { Interaction } from '@kodadot1/minimark'

import { dangerMessage, infoMessage } from '@/utils/notification'
import { ShoppingActions } from '@/utils/shoppingActions'
import { execListTx } from './transaction/transactionList'
import { execSendTx } from './transaction/transactionSend'
import { execBurnTx } from './transaction/transactionBurn'
import { execMakeOfferTx } from './transaction/transactionOffer'
import { execWithdrawOfferTx } from './transaction/transactionOfferWithdraw'
import { execAcceptOfferTx } from './transaction/transactionOfferAccept'

import type {
  ActionAcceptOffer,
  ActionConsume,
  ActionList,
  ActionOffer,
  ActionSend,
  ActionWithdrawOffer,
  Actions,
} from './transaction/types'

const useExecuteTransaction = () => {
  const { accountId } = useAuth()
  const { howAboutToExecute, isLoading, status, initTransactionLoader } =
    useMetaTransaction()

  const executeTransaction = ({ cb, arg, successMessage, errorMessage }) => {
    initTransactionLoader()
    howAboutToExecute(
      accountId.value,
      cb,
      arg,
      () => infoMessage(successMessage || 'Success!'),
      () => dangerMessage(errorMessage || 'Failed!')
    )
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
    }

    return map[item.interaction]?.() ?? 'UNKNOWN'
  }

  return {
    isLoading,
    status,
    transaction,
  }
}
