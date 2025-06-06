import type { ApiPromise } from '@polkadot/api'
import type { Address } from 'viem'

import { execBuyTx } from './transaction/transactionBuy'
import { execListTx } from './transaction/transactionList'
import { execSendTx } from './transaction/transactionSend'
import {
  execBurnCollection,
  execBurn,
} from './transaction/transactionBurn'
import { execCancelSwap } from './transaction/transactionSwapCancel'
import { execAcceptSwap } from './transaction/transactionSwapAccept'
import { execCancelOffer } from './transaction/transactionOfferCancel'
import { execAcceptOfferTx } from './transaction/transactionOfferAccept'
import { execMakingOfferTx } from './transaction/transactionOffer'
import { execCreateSwap } from './transaction/transactionCreateSwap'
import { execMintToken } from './transaction/transactionMintToken'
import { execMintCollection } from './transaction/transactionMintCollection'
import { execUpdateCollection } from './transaction/transactionUpdateCollection'
import { execSetNftMetadata } from './transaction/transactionSetNftMetadata'
import { execAirdropTx } from './transaction/transactionAirdrop'
import type {
  ActionAcceptOffer,
  ActionBuy,
  ActionConsume,
  ActionOffer,
  ActionSwap,
  ActionDeleteCollection,
  ActionList,
  ActionMintCollection,
  ActionMintDrop,
  ActionMintToken,
  ActionSend,
  ActionAirdrop,
  ActionUpdateCollection,
  ActionSetNftMetadata,
  ActionCancelOffer,
  Actions,
  ExecuteEvmTransactionParams,
  ExecuteSubstrateTransactionParams,
  ExecuteTransactionParams,
  ActionCancelSwap,
  ActionAcceptSwap,
} from './transaction/types'
import { Collections, NFTs } from './transaction/types'
import { isActionValid } from './transaction/utils'
import { execMintDrop } from './transaction/transactionMintDrop'
import type {
  HowAboutToExecuteOnResultParam,
  HowAboutToExecute as SubstrateHowAboutToExecute,
} from './useMetaTransaction'
import { Interaction, ShoppingActions } from '@/utils/shoppingActions'
import useEvmMetaTransaction, {
  type EvmHowAboutToExecute,
  type EvmHowAboutToExecuteParam,
} from '@/composables/transaction/evm/useMetaTransaction'
import { doAfterCheckCurrentChainVM } from '@/components/common/ConnectWallet/openReconnectWalletModal'
import { hasOperationsDisabled } from '@/utils/prefix'
import {
  successMessage as successNotification,
  warningMessage,
} from '@/utils/notification'

export type TransactionOptions = {
  disableSuccessNotification?: boolean
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

      const message = resolveSuccessMessage(block, successMessage)

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
    [Interaction.AIRDROP]: () =>
      execAirdropTx(item as ActionAirdrop, api, executeTransaction),
    [ShoppingActions.CONSUME]: () =>
      execBurn(item as ActionConsume, api, executeTransaction),
    [ShoppingActions.CANCEL_SWAP]: () =>
      execCancelSwap(item as ActionCancelSwap, api!, executeTransaction),
    [ShoppingActions.ACCEPT_SWAP]: () =>
      execAcceptSwap(item as ActionAcceptSwap, api!, executeTransaction),
    [ShoppingActions.CANCEL_OFFER]: () =>
      execCancelOffer(item as ActionCancelOffer, api, executeTransaction),
    [ShoppingActions.ACCEPT_OFFER]: () =>
      execAcceptOfferTx(item as ActionAcceptOffer, api, executeTransaction),
    [ShoppingActions.MAKE_OFFER]: () =>
      execMakingOfferTx(item as ActionOffer, api, executeTransaction),
    [ShoppingActions.CREATE_SWAP]: () =>
      execCreateSwap({
        item: item as ActionSwap,
        api: api as ApiPromise,
        executeTransaction,
        isLoading,
        status,
      }),
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
    [Collections.UPDATE_COLLECTION]: () =>
      execUpdateCollection({
        item: item as ActionUpdateCollection,
        api: api as ApiPromise,
        executeTransaction,
        isLoading,
        status,
      }),
    [NFTs.SET_METADATA]: () =>
      execSetNftMetadata({
        item: item as ActionSetNftMetadata,
        api: api as ApiPromise,
        executeTransaction,
        isLoading,
        status,
      }),
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
      statusMessage: `Invalid ${item.interaction} action`,
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
