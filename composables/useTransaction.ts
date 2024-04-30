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
import { execWithdrawOfferTx } from './transaction/transactionOfferWithdraw'
import { execAcceptOfferTx } from './transaction/transactionOfferAccept'
import { execMintToken } from './transaction/transactionMintToken'
import { execMintCollection } from './transaction/transactionMintCollection'
import { execSetCollectionMaxSupply } from './transaction/transactionSetCollectionMaxSupply'
import {
  ActionAcceptOffer,
  ActionBurnMultipleNFTs,
  ActionBuy,
  ActionConsume,
  ActionDeleteCollection,
  ActionList,
  ActionMintCollection,
  ActionMintDrop,
  ActionMintToken,
  ActionSend,
  ActionSetCollectionMaxSupply,
  ActionWithdrawOffer,
  Actions,
  Collections,
  ExecuteTransactionParams,
  NFTs,
  ObjectMessage,
} from './transaction/types'
import { ApiPromise } from '@polkadot/api'
import { isActionValid } from './transaction/utils'
import { hasOperationsDisabled } from '@/utils/prefix'
import { execMintDrop } from './transaction/transactionMintDrop'

export type TransactionOptions = {
  disableSuccessNotification?: boolean
}

const resolveLargeSuccessNotification = (
  block: string,
  objectMessage: ObjectMessage,
) => {
  const { $i18n } = useNuxtApp()
  const title = $i18n.t('mint.success')
  const message = resolveSuccessMessage(block, objectMessage.message)
  showLargeNotification({ message, title, shareLink: objectMessage.shareLink })
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

const useExecuteTransaction = (options: TransactionOptions) => {
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
  const txHash = ref<string>()

  const executeTransaction = ({
    cb,
    arg,
    successMessage,
    errorMessage,
  }: ExecuteTransactionParams) => {
    initTransactionLoader()

    const successCb = ({
      blockNumber: block,
      txHash: hash,
    }: HowAboutToExecuteOnSuccessParam) => {
      blockNumber.value = block
      txHash.value = hash
      if (options.disableSuccessNotification) {
        return
      }

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
      if (!errorMessage) {
        return
      }

      const message = resolveMessage(errorMessage)
      warningMessage(message)
    }

    howAboutToExecute(accountId.value, cb, arg, {
      onSuccess: successCb,
      onError: errorCb,
    })
  }

  return {
    isLoading,
    status,
    error,
    executeTransaction,
    blockNumber,
    txHash,
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
    [Collections.SET_MAX_SUPPLY]: () =>
      execSetCollectionMaxSupply(
        item as ActionSetCollectionMaxSupply,
        api,
        executeTransaction,
      ),
    [NFTs.BURN_MULTIPLE]: () =>
      execBurnMultiple(item as ActionBurnMultipleNFTs, api, executeTransaction),
    [NFTs.MINT_DROP]: () =>
      execMintDrop({
        item: item as ActionMintDrop,
        api,
        executeTransaction,
        isLoading,
        status,
      }),
  }

  if (!isActionValid(item)) {
    const { $consola } = useNuxtApp()
    $consola.warn(`Invalid action: ${JSON.stringify(item)}`)
    throw createError({
      statusCode: 404,
      statusMessage: 'Interaction Not Found',
    })
  }

  return map[item.interaction]?.() ?? 'UNKNOWN'
}

export const useTransaction = (
  options: TransactionOptions = { disableSuccessNotification: false },
) => {
  const { apiInstance, apiInstanceByPrefix } = useApi()
  const { $i18n } = useNuxtApp()
  const { urlPrefix } = usePrefix()
  const {
    isLoading,
    status,
    executeTransaction,
    blockNumber,
    txHash,
    isError,
  } = useExecuteTransaction(options)

  const transaction = async (item: Actions, prefix = '') => {
    let api = await apiInstance.value

    if (hasOperationsDisabled(prefix || urlPrefix.value)) {
      warningMessage($i18n.t('toast.unsupportedOperation'))
      return
    }

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
    txHash,
    isError,
  }
}
