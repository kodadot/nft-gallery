import { Interaction } from '@kodadot1/minimark/v1'

import {
  successMessage as successNotification,
  warningMessage,
} from '@/utils/notification'
import { ShoppingActions } from '@/utils/shoppingActions'
import { execBuyTx } from './transaction/transactionBuy'
import { execListTx } from './transaction/transactionList'
import { execSendTx } from './transaction/transactionSend'
import { execBurnTx } from './transaction/transactionBurn'
import { execMakeOfferTx } from './transaction/transactionOffer'
import { execWithdrawOfferTx } from './transaction/transactionOfferWithdraw'
import { execAcceptOfferTx } from './transaction/transactionOfferAccept'
import { execMintToken } from './transaction/transactionMintToken'

import type {
  ActionAcceptOffer,
  ActionBuy,
  ActionConsume,
  ActionList,
  ActionMintCollection,
  ActionMintToken,
  ActionOffer,
  ActionSend,
  ActionWithdrawOffer,
  Actions,
  ExecuteTransactionParams,
} from './transaction/types'
import { execMintCollection } from './transaction/transactionMintCollection'

const resolveMessage = (message?: string | (() => string)) => {
  if (!message) {
    return
  }
  if (typeof message === 'function') {
    return message()
  }
  return message
}

export const resolveSuccessMessage = (
  block: string,
  successMessage?: string | ((blockNumber) => string),
): string => {
  if (typeof successMessage === 'function') {
    return successMessage(block)
  }
  return successMessage || 'Success!'
}

const useExecuteTransaction = () => {
  const { accountId } = useAuth()
  const error = ref(false)
  const {
    howAboutToExecute,
    isLoading,
    status,
    initTransactionLoader,
    isError,
  } = useMetaTransaction()
  const blockNumber = ref<string>()

  const executeTransaction = ({
    cb,
    arg,
    successMessage,
    errorMessage,
  }: ExecuteTransactionParams) => {
    initTransactionLoader()

    const successCb = (block: string) => {
      blockNumber.value = block
      const message = resolveSuccessMessage(block, successMessage)
      successNotification(message)
    }

    const errorCb = () => {
      const message = resolveMessage(errorMessage) || 'Failed!'
      warningMessage(message)
    }

    howAboutToExecute(accountId.value, cb, arg, successCb, errorCb)
  }

  return {
    isLoading,
    status,
    error,
    executeTransaction,
    blockNumber,
    isError,
  }
}

export const useTransaction = () => {
  const { apiInstance, apiInstanceByPrefix } = useApi()
  const { isLoading, status, executeTransaction, blockNumber, isError } =
    useExecuteTransaction()

  const transaction = async (item: Actions, prefix = '') => {
    let api = await apiInstance.value

    if (prefix) {
      api = await apiInstanceByPrefix(prefix)
    }

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
          executeTransaction,
        ),
      [ShoppingActions.ACCEPT_OFFER]: () =>
        execAcceptOfferTx(item as ActionAcceptOffer, api, executeTransaction),
      [ShoppingActions.MINTNFT]: () =>
        execMintToken({
          item: item as ActionMintToken,
          api,
          executeTransaction,
          isLoading,
          status,
        }),
      [ShoppingActions.MINT]: () =>
        execMintCollection(
          item as ActionMintCollection,
          api,
          executeTransaction,
        ),
    }

    return map[item.interaction]?.() ?? 'UNKNOWN'
  }

  return {
    isLoading,
    status,
    transaction,
    blockNumber,
    isError,
  }
}
