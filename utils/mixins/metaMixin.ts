import { Component, Mixins } from 'vue-property-decorator'
import exec, { execResultValue, Extrinsic, txCb } from '../transactionExecutor'
import TransactionMixin from './txMixin'
import Connector from '@kodadot1/sub-api'
import { notificationTypes, showNotification } from '../notification'
import { DispatchError } from '@polkadot/types/interfaces'
import { Interaction, createInteraction } from '@kodadot1/minimark'
import { somePercentFromTX } from '@/utils/support'
import {
  checkBuyBeforeSubmit,
  unpinNFT,
} from '@/components/rmrk/shoppingActions'
/*
 * refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
 * import { Component, Mixins } from 'vue-property-decorator';
 * class ExtendedClass extends Mixins(ActualMixin) {
 */
@Component
export default class MetaTransactionMixin extends Mixins(TransactionMixin) {
  protected selectedAction

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

  public submitAction = async ({
    action,
    accountId,
    version,
    meta,
    nftId,
    urlPrefix,
    currentOwnerId,
    price,
    apollo,
    ipfsHashes,
  }) => {
    const { api } = Connector.getInstance()
    const rmrk = createInteraction(action, version, nftId, meta)

    this.isLoading = true

    const finishCb = () => {
      this.selectedAction = null
      this.isLoading = false
    }

    const onResult = (res) => {
      if (res.status.isReady) {
        this.status = 'loader.casting'
        return
      }

      if (res.status.isInBlock) {
        this.status = 'loader.block'
        return
      }

      if (res.status.isFinalized) {
        this.status = 'loader.finalized'
        return
      }
      this.status = ''
    }

    try {
      if (!action) {
        throw new ReferenceError('No action selected')
      }
      showNotification(rmrk)
      console.log('submit', rmrk)
      const isBuy = action === Interaction.BUY
      const cb = isBuy ? api.tx.utility.batchAll : api.tx.system.remark
      const arg = isBuy
        ? [
            api.tx.system.remark(rmrk),
            api.tx.balances.transfer(currentOwnerId, price),
            somePercentFromTX(price),
          ]
        : rmrk

      if (isBuy) {
        await checkBuyBeforeSubmit({
          urlPrefix,
          nftId,
          currentOwnerId,
          price,
          action,
          apollo,
        })
      }

      const statusCallback = txCb(
        async (blockHash) => {
          execResultValue(tx)
          showNotification(blockHash.toString(), notificationTypes.info)
          if (action === Interaction.CONSUME) {
            unpinNFT(ipfsHashes)
          }

          showNotification(`[${action}] ${nftId}`, notificationTypes.success)
          finishCb()
        },
        (err) => {
          execResultValue(tx)
          showNotification(`[ERR] ${err.hash}`, notificationTypes.danger)
          finishCb()
        },
        onResult
      )

      const tx = await exec(accountId, '', cb, [arg], statusCallback)
    } catch (e) {
      showNotification(`[ERR] ${e}`, notificationTypes.danger)
      console.error(e)
      finishCb()
    }
  }
}
