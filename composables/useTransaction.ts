import { Interaction } from '@kodadot1/minimark/v1'
import type { ApiPromise } from '@polkadot/api'
import type { Address } from 'viem'

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
import { execMakingOfferTx } from './transaction/transactionOffer'
import { execMintToken } from './transaction/transactionMintToken'
import { execMintCollection } from './transaction/transactionMintCollection'
import { execSetCollectionMaxSupply } from './transaction/transactionSetCollectionMaxSupply'
import type {
  ActionAcceptOffer,
  ActionBurnMultipleNFTs,
  ActionBuy,
  ActionConsume,
  ActionOffer,
  ActionDeleteCollection,
  ActionList,
  ActionMintCollection,
  ActionMintDrop,
  ActionMintToken,
  ActionSend,
  ActionSetCollectionMaxSupply,
  ActionWithdrawOffer,
  Actions,
  ExecuteEvmTransactionParams,
  ExecuteSubstrateTransactionParams,
  ExecuteTransactionParams,
  ObjectMessage,
} from './transaction/types'
import { Collections, NFTs } from './transaction/types'
import { isActionValid } from './transaction/utils'
import { execMintDrop } from './transaction/transactionMintDrop'
import type {
  HowAboutToExecuteOnResultParam,
  HowAboutToExecute as SubstrateHowAboutToExecute,
} from './useMetaTransaction'
import useEvmMetaTransaction, {
  type EvmHowAboutToExecute,
  type EvmHowAboutToExecuteParam,
} from '@/composables/transaction/evm/useMetaTransaction'
import { doAfterCheckCurrentChainVM } from '@/components/common/ConnectWallet/openReconnectWalletModal'
import { hasOperationsDisabled } from '@/utils/prefix'
import { ShoppingActions } from '@/utils/shoppingActions'
import {
  showLargeNotification,
  successMessage as successNotification,
  warningMessage,
} from '@/utils/notification'

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
  } = execByVm({
    SUB: () => useMetaTransaction(),
    EVM: () => useEvmMetaTransaction() as unknown,
  }) as
  | ReturnType<typeof useMetaTransaction>
  | ReturnType<typeof useEvmMetaTransaction>

  const blockNumber = ref<string>()
  const txHash = ref<string>()

  const executeTransaction = ({
    arg,
    successMessage,
    errorMessage,
    ...params
  }: ExecuteTransactionParams) => {
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

    const resultCb = (param: HowAboutToExecuteOnResultParam) => {
      txHash.value = param.txHash || undefined
    }

    doAfterCheckCurrentChainVM(() => {
      initTransactionLoader()
      execByVm({
        SUB: () => {
          ;(howAboutToExecute as SubstrateHowAboutToExecute)(
            accountId.value,
            (params as ExecuteSubstrateTransactionParams).cb,
            arg,
            {
              onSuccess: successCb,
              onError: errorCb,
              onResult: resultCb,
            },
          )
        },
        EVM: () => {
          const evmParams = params as ExecuteEvmTransactionParams
          ;(howAboutToExecute as EvmHowAboutToExecute)({
            account: accountId.value as Address,
            address: evmParams.address,
            abi: evmParams.abi,
            args: arg,
            functionName: evmParams.functionName,
            value: evmParams.value,
            onSuccess: successCb,
            onError: errorCb,
          } as EvmHowAboutToExecuteParam)
        },
      })
    })
  }

  const clear = () => {
    status.value = TransactionStatus.Unknown
    isError.value = false
    blockNumber.value = undefined
    txHash.value = undefined
    isLoading.value = false
  }

  return {
    isLoading,
    status,
    error,
    executeTransaction,
    blockNumber,
    txHash,
    isError,
    clear,
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
  api?: ApiPromise
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
    [ShoppingActions.MAKE_OFFER]: () =>
      execMakingOfferTx(item as ActionOffer, api, executeTransaction),
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
        api as ApiPromise,
        executeTransaction,
      ),
    [Collections.SET_MAX_SUPPLY]: () =>
      execSetCollectionMaxSupply(
        item as ActionSetCollectionMaxSupply,
        api,
        executeTransaction,
      ),
    [NFTs.BURN_MULTIPLE]: () =>
      execBurnMultiple(
        item as ActionBurnMultipleNFTs,
        api as ApiPromise,
        executeTransaction,
      ),
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
    clear,
  } = useExecuteTransaction(options)

  const transaction = async (item: Actions, prefix = '') => {
    if (hasOperationsDisabled(prefix || urlPrefix.value)) {
      warningMessage($i18n.t('toast.unsupportedOperation'))
      return
    }

    const api = await execByVm({
      SUB: async () => {
        let api = await apiInstance.value
        if (prefix) {
          api = await apiInstanceByPrefix(prefix)
        }
        return api
      },
    })

    return executeAction({ item, executeTransaction, api, isLoading, status })
  }

  return {
    isLoading,
    status,
    transaction,
    blockNumber,
    txHash,
    isError,
    clear,
  }
}
