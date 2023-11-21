import { Interaction } from '@kodadot1/minimark/v1'

import {
  showLargeNotification,
  successMessage as successNotification,
  warningMessage,
} from '@/utils/notification'
import { ShoppingActions } from '@/utils/shoppingActions'
import { execBuyTx } from './transaction/transactionBuy'
import { execListTx } from './transaction/transactionList'
import { execSendTx } from './transaction/transactionSend'
import {
  execBurnCollection,
  execBurnMultiple,
  execBurnTx,
} from './transaction/transactionBurn'
import { execMakeOfferTx } from './transaction/transactionOffer'
import { execWithdrawOfferTx } from './transaction/transactionOfferWithdraw'
import { execAcceptOfferTx } from './transaction/transactionOfferAccept'
import { execMintToken } from './transaction/transactionMintToken'

import {
  ActionAcceptOffer,
  ActionBurnMultipleNFTs,
  ActionBuy,
  ActionConsume,
  ActionDeleteCollection,
  ActionList,
  ActionMintCollection,
  ActionMintToken,
  ActionOffer,
  ActionSend,
  ActionWithdrawOffer,
  Actions,
  Collections,
  ExecuteTransactionParams,
  NFTs,
  ObjectMessage,
} from './transaction/types'
import { execMintCollection } from './transaction/transactionMintCollection'
import { ApiPromise } from '@polkadot/api'
import { isActionValid } from './transaction/utils'
const { $consola } = useNuxtApp()

const resolveLargeSuccessNotification = (
  block: string,
  objectMessage: ObjectMessage,
) => {
  const { $i18n } = useNuxtApp()
  const title = $i18n.t('mint.success')
  const message = resolveSuccessMessage(block, objectMessage.message)
  showLargeNotification({ message, title })
}

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

      const isObject = typeof successMessage === 'object'
      if (isObject && successMessage.large) {
        return resolveLargeSuccessNotification(block, successMessage)
      }

      const message = resolveSuccessMessage(
        block,
        isObject ? successMessage.message : successMessage,
      )
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

export const executeAction = ({
  item,
  api,
  executeTransaction,
  isLoading,
  status,
}: {
  item: Actions
  api: ApiPromise
  isLoading: Ref<boolean>
  status: Ref<string>
  executeTransaction
}) => {
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
      execWithdrawOfferTx(item as ActionWithdrawOffer, api, executeTransaction),
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
      execMintCollection({
        item: item as ActionMintCollection,
        api,
        executeTransaction,
        isLoading,
        status,
      }),
    [Collections.DELETE]: () =>
      execBurnCollection(
        item as ActionDeleteCollection,
        api,
        executeTransaction,
      ),
    [NFTs.BURN_MULTIPLE]: () =>
      execBurnMultiple(item as ActionBurnMultipleNFTs, api, executeTransaction),
  }

  if (!isActionValid(item)) {
    $consola.warn(`Invalid action: ${JSON.stringify(item)}`)
    throw createError({
      statusCode: 404,
      statusMessage: 'Interaction Not Found',
    })
  }

  return map[item.interaction]?.() ?? 'UNKNOWN'
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

    return executeAction({ item, executeTransaction, api, isLoading, status })
  }

  return {
    isLoading,
    status,
    transaction,
    blockNumber,
    isError,
  }
}
