import { Component, mixins } from 'nuxt-property-decorator'

import { isSameAccount } from '~/utils/account'
import AuthMixin from '~/utils/mixins/authMixin'
import MetaTransactionMixin from '~/utils/mixins/metaMixin'
import Connector from '@kodadot1/sub-api'
import { notificationTypes, showNotification } from '~/utils/notification'
import onApiConnect from '~/utils/api/general'
import { formatSecondsToDuration } from '~/utils/format/time'

/*
 * refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
 * import { Component, Mixins } from 'nuxt-property-decorator';
 * class ExtendedClass extends Mixins(ActualMixin) {
 */
@Component
export default class OfferMixin extends mixins(
  AuthMixin,
  MetaTransactionMixin
) {
  public isLoading = false
  public currentBlock = 0

  created() {
    onApiConnect(async (api) => {
      const currentBlock = await api.query.system.number()
      this.currentBlock = currentBlock.toNumber()
    })
  }

  public calcExpirationTime(expirationBlock: number): string {
    if (this.currentBlock === 0) {
      return 'computing'
    }
    if (this.currentBlock > expirationBlock) {
      return 'expired'
    }
    const secondsForEachBlock = 12
    const diffSeconds =
      secondsForEachBlock * (expirationBlock - this.currentBlock)
    return formatSecondsToDuration(diffSeconds)
  }

  protected async submit(
    maker: string,
    nftId: string,
    collectionId: string,
    onSuccess?: () => void
  ) {
    try {
      const { api } = Connector.getInstance()
      this.initTransactionLoader()
      const isMe = isSameAccount(this.accountId, maker)
      const cb = !isMe
        ? api.tx.marketplace.acceptOffer
        : api.tx.marketplace.withdrawOffer
      const args = [collectionId, nftId, maker]

      await this.howAboutToExecute(this.accountId, cb, args, (blockNumber) => {
        const msg = !isMe ? this.$t('offer.accept') : this.$t('offer.withdraw')
        showNotification(
          `[OFFER] Since block ${blockNumber}, ${msg}`,
          notificationTypes.success
        )
        onSuccess && onSuccess()
      })
    } catch (e: any) {
      showNotification(`[OFFER::ERR] ${e}`, notificationTypes.danger)
      this.$consola.error(e)
      this.isLoading = false
    }
  }
}
