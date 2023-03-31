import { Component, Mixins } from 'vue-property-decorator'
import exec, { Extrinsic, execResultValue, txCb } from '../transactionExecutor'
import TransactionMixin from './txMixin'
import { notificationTypes, showNotification } from '../notification'
import { DispatchError } from '@polkadot/types/interfaces'
import UseApiMixin from './useApiMixin'

/*
 * refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
 * import { Component, Mixins } from 'vue-property-decorator';
 * class ExtendedClass extends Mixins(ActualMixin) {
 */
@Component
export default class MetaTransactionMixin extends Mixins(
  TransactionMixin,
  UseApiMixin
) {
  public async howAboutToExecute(
    account: string,
    cb: (...params: any[]) => Extrinsic,
    args: any[],
    onSuccess?: (blockNumber: string) => void,
    onError?: () => void
  ): Promise<void> {
    try {
      const api = await this.useApi()
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

            this.isLoading = false
          },
          (dispatchError) => {
            execResultValue(tx)
            this.onTxError(dispatchError)
            this.isLoading = false
            if (onError) {
              onError()
            }
          },
          (res) => this.resolveStatus(res.status)
        )
      )
    } catch (e) {
      if (e instanceof Error) {
        const isCancelled = e.message === 'Cancelled'
        if (isCancelled) {
          showNotification(
            this.$t('general.tx.cancelled') as string,
            notificationTypes.warn
          )
        } else {
          showNotification(e.toString(), notificationTypes.warn)
        }
        this.isLoading = false
      }
    }
  }

  protected async onTxError(dispatchError: DispatchError): Promise<void> {
    const api = await this.useApi()
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

    this.isLoading = false
  }
}
