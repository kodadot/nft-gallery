import type { DispatchError } from '@polkadot/types/interfaces'
import type { ISubmittableResult } from '@polkadot/types/types'
import useAPI from './useApi'
import useTransactionStatus from './useTransactionStatus'
import exec, {
  execResultValue,
  txCb,
} from '@/utils/transactionExecutor'
import type {
  ExecResult,
  Extrinsic,
  TxCbOnSuccessParams } from '@/utils/transactionExecutor'

export type HowAboutToExecuteOnSuccessParam = {
  txHash: string
  blockNumber: string
}

export type HowAboutToExecuteOnResultParam = {
  txHash: string
  result: ISubmittableResult
}

type HowAboutToExecuteOptions = {
  onSuccess?: (param: HowAboutToExecuteOnSuccessParam) => void
  onError?: () => void
  onResult?: (result: HowAboutToExecuteOnResultParam) => void
}

export type HowAboutToExecute = (
  account: string,
  cb: (...params: any[]) => Extrinsic,
  args: any[],
  options?: HowAboutToExecuteOptions
) => Promise<void>

function useMetaTransaction() {
  const { $i18n } = useNuxtApp()
  const {
    isLoading,
    resolveStatus,
    initTransactionLoader,
    status,
    stopLoader,
  } = useTransactionStatus()
  const { apiInstance } = useAPI()
  const tx = ref<ExecResult>()
  const isError = ref(false)

  const howAboutToExecute: HowAboutToExecute = async (
    account,
    cb,
    args,
    {
      onSuccess,
      onError,
      onResult,
    } = {},
  ): Promise<void> => {
    try {
      tx.value = await exec(
        account,
        '',
        cb,
        args,
        txCb(successCb(onSuccess), errorCb(onError), resultCb(onResult)),
      )
    }
    catch (e) {
      onCatchError(e)
    }
  }

  const successCb
    = (onSuccess?: (param: HowAboutToExecuteOnSuccessParam) => void) =>
      async ({ blockHash, txHash }: TxCbOnSuccessParams) => {
        const api = await apiInstance.value

        tx.value && execResultValue(tx.value)
        const header = await api.rpc.chain.getHeader(blockHash)
        const blockNumber = header.number.toString()

        if (onSuccess) {
          onSuccess({ txHash: txHash.toString(), blockNumber })
        }

        isLoading.value = false
        tx.value = undefined
      }

  const errorCb = onError => (dispatchError) => {
    tx.value && execResultValue(tx.value)
    onTxError(dispatchError)
    isLoading.value = false
    isError.value = true
    if (onError) {
      onError()
    }
  }

  const resultCb
    = (onResult?: (result: HowAboutToExecuteOnResultParam) => void) =>
      (result: ISubmittableResult) => {
        resolveStatus(result.status)
        onResult?.({ txHash: result.txHash.toString(), result })
      }

  const onCatchError = (e) => {
    if (e instanceof Error) {
      const errorMessage = e.message?.toLowerCase() || ''
      const isCancelled = errorMessage.includes('cancelled') || errorMessage.includes('rejected')
      if (isCancelled) {
        warningMessage($i18n.t('general.tx.cancelled'), { reportable: false })

        status.value = TransactionStatus.Cancelled
      }
      else {
        isError.value = true
        warningMessage(e.toString())
      }
      isLoading.value = false
      tx.value = undefined
    }
  }
  const onTxError = async (dispatchError: DispatchError): Promise<void> => {
    await notifyDispatchError(dispatchError)
    isLoading.value = false
    tx.value = undefined
  }
  return {
    howAboutToExecute,
    onTxError,
    initTransactionLoader,
    status,
    isLoading,
    stopLoader,
    isError,
  }
}

export default useMetaTransaction
