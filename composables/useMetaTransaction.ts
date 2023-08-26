import exec, {
  ExecResult,
  Extrinsic,
  execResultValue,
  txCb,
} from '@/utils/transactionExecutor'
import useTransactionStatus from './useTransactionStatus'
import useAPI from './useApi'
import { notificationTypes, showNotification } from '@/utils/notification'
import { DispatchError } from '@polkadot/types/interfaces'

const _successCb =
  ({ isLoading, tx }) =>
  (onSuccess) =>
  async (blockHash) => {
    const { apiInstance } = useAPI()

    const api = await apiInstance.value

    tx.value && execResultValue(tx.value)
    const header = await api.rpc.chain.getHeader(blockHash)
    const blockNumber = header.number.toString()

    if (onSuccess) {
      onSuccess(blockNumber)
    }

    isLoading.value = false
    tx.value = undefined
  }

const _errorCb =
  ({ isLoading, tx, isError, onTxError }) =>
  (onError) =>
  (dispatchError) => {
    tx.value && execResultValue(tx.value)
    onTxError(dispatchError)
    isLoading.value = false
    isError.value = true
    if (onError) {
      onError()
    }
  }

const _onCatchError =
  ({ isLoading, tx }) =>
  (e) => {
    if (e instanceof Error) {
      const isCancelled = e.message === 'Cancelled'
      if (isCancelled) {
        const { $i18n } = useNuxtApp()
        showNotification(
          $i18n.t('general.tx.cancelled'),
          notificationTypes.warn
        )
      } else {
        showNotification(e.toString(), notificationTypes.warn)
      }
      isLoading.value = false
      tx.value = undefined
    }
  }

const _onTxError =
  ({ isLoading, tx }) =>
  async (dispatchError: DispatchError): Promise<void> => {
    const { apiInstance } = useAPI()
    const api = await apiInstance.value

    if (dispatchError.isModule) {
      const decoded = api.registry.findMetaError(dispatchError.asModule)
      const { docs, name, section } = decoded
      showNotification(
        `[ERR] ${section}.${name}: ${docs.join(' ')}`,
        notificationTypes.warn
      )
    } else {
      showNotification(
        `[ERR] ${dispatchError.toString()}`,
        notificationTypes.warn
      )
    }

    isLoading.value = false
    tx.value = undefined
  }

const _howAboutToExecute =
  ({ isLoading, tx, isError, onResult, onTxError }) =>
  async (
    account: string,
    cb: (...params: any[]) => Extrinsic,
    args: any[],
    onSuccess?: (blockNumber: string) => void,
    onError?: () => void
  ): Promise<void> => {
    const successCb = _successCb({ isLoading, tx })
    const onCatchError = _onCatchError({ isLoading, tx })
    const errorCb = _errorCb({ isLoading, tx, isError, onTxError })
    try {
      tx.value = await exec(
        account,
        '',
        cb,
        args,
        txCb(successCb(onSuccess), errorCb(onError), onResult)
      )
    } catch (e) {
      onCatchError(e)
    }
  }

function useMetaTransaction() {
  const {
    isLoading,
    resolveStatus,
    initTransactionLoader,
    status,
    stopLoader,
  } = useTransactionStatus()
  const tx = ref<ExecResult>()
  const isError = ref(false)

  const onResult = (res) => resolveStatus(res.status)
  const onTxError = _onTxError({ isLoading, tx })
  const params = { isLoading, tx, isError, onResult, onTxError }

  return {
    howAboutToExecute: _howAboutToExecute(params),
    onTxError,
    initTransactionLoader,
    status,
    isLoading,
    stopLoader,
    isError,
  }
}

export default useMetaTransaction
