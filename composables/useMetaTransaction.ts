import exec, {
  Extrinsic,
  execResultValue,
  txCb,
} from '@/utils/transactionExecutor'
import useTransaction from './useTransaction'
import useAPI from './useApi'
import { notificationTypes, showNotification } from '@/utils/notification'
import { DispatchError } from '@polkadot/types/interfaces'

export default function () {
  const { $i18n } = useNuxtApp()

  const { isLoading, resolveStatus } = useTransaction()
  const { apiInstance } = useAPI()
  const howAboutToExecute = async (
    account: string,
    cb: (...params: any[]) => Extrinsic,
    args: any[],
    onSuccess?: (blockNumber: string) => void,
    onError?: () => void
  ): Promise<void> => {
    const api = await apiInstance.value

    try {
      const tx = await exec(
        account,
        '',
        cb,
        args,
        txCb(
          async (blockHash) => {
            execResultValue(tx)
            const header = await api.rpc.chain.getHeader(blockHash)
            const blockNumber = header.number.toString()

            if (onSuccess) {
              onSuccess(blockNumber)
            }

            isLoading.value = false
          },
          (dispatchError) => {
            execResultValue(tx)
            onTxError(dispatchError)
            isLoading.value = false
            if (onError) {
              onError()
            }
          },
          (res) => resolveStatus(res.status)
        )
      )
    } catch (e) {
      if (e instanceof Error) {
        const isCancelled = e.message === 'Cancelled'
        if (isCancelled) {
          showNotification(
            $i18n.t('general.tx.cancelled'),
            notificationTypes.warn
          )
        } else {
          showNotification(e.toString(), notificationTypes.danger)
        }
        isLoading.value = false
      }
    }
  }

  const onTxError = async (dispatchError: DispatchError): Promise<void> => {
    const api = await apiInstance.value

    if (dispatchError.isModule) {
      const decoded = api.registry.findMetaError(dispatchError.asModule)
      const { docs, name, section } = decoded
      showNotification(
        `[ERR] ${section}.${name}: ${docs.join(' ')}`,
        notificationTypes.danger
      )
    } else {
      showNotification(
        `[ERR] ${dispatchError.toString()}`,
        notificationTypes.danger
      )
    }

    isLoading.value = false
  }
  return {
    howAboutToExecute,
    onTxError,
  }
}
