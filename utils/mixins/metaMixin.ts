import { Component, Mixins } from 'vue-property-decorator'
import exec, { execResultValue, Extrinsic, txCb } from '../transactionExecutor'
import TransactionMixin from './txMixin'
import Connector from '@kodadot1/sub-api'
import { notificationTypes, showNotification } from '../notification'
import { DispatchError } from '@polkadot/types/interfaces'

/*
 * refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
 * import { Component, Mixins } from 'vue-property-decorator';
 * class ExtendedClass extends Mixins(ActualMixin) {
 */
@Component
export default class MetaTransactionMixin extends Mixins(TransactionMixin) {
  public async howAboutToExecute(
    account: string,
    cb: (...params: any[]) => Extrinsic,
    args: any[],
    onSuccess?: (blockNumber: string) => void
  ): Promise<void> {
    try {
      const { api } = Connector.getInstance()
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
          },
          (res) => this.resolveStatus(res.status)
        )
      )
    } catch (e) {
      if (e instanceof Error) {
        showNotification(e.toString(), notificationTypes.danger)
        this.isLoading = false
      }
    }
  }

  protected onTxError(dispatchError: DispatchError): void {
    const { api } = Connector.getInstance()
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

    this.isLoading = false
  }
}
