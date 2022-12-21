import { Component, mixins } from 'nuxt-property-decorator'

import { isSameAccount } from '~/utils/account'
import AuthMixin from '~/utils/mixins/authMixin'
import MetaTransactionMixin from '~/utils/mixins/metaMixin'
import { notificationTypes, showNotification } from '~/utils/notification'
import { onApiConnect } from '@kodadot1/sub-api'
import { endDate, formatSecondsToDuration } from '~/utils/format/time'
import { formatBsxBalanceToNumber } from '~/utils/format/balance'
import { Offer } from '~/components/bsx/Offer/types'
import { AllOfferStatusType } from '~/utils/offerStatus'

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
  public selectedStatus: AllOfferStatusType = AllOfferStatusType.ALL

  created() {
    onApiConnect(this.apiUrl, async (api) => {
      const currentBlock = await api.query.system.number()
      this.currentBlock = currentBlock.toNumber()
    })
  }

  public getUniqType(
    offers: Offer[]
  ): { type: AllOfferStatusType; value: string }[] {
    const statusSet = new Set(offers.map((offer) => offer.status))
    const singleEventList = Array.from(statusSet).map((type) => ({
      type: type as AllOfferStatusType,
      value: AllOfferStatusType[type],
    }))
    return [{ type: AllOfferStatusType.ALL, value: 'All' }, ...singleEventList]
  }

  public displayOffers(offers: Offer[]) {
    let filterOffers: Offer[]
    if (this.selectedStatus === AllOfferStatusType.ALL) {
      filterOffers = offers.concat()
    } else {
      filterOffers = offers.filter(
        (offer) => offer.status === this.selectedStatus
      )
    }

    return filterOffers.map((offer) => ({
      ...offer,
      formatPrice: formatBsxBalanceToNumber(offer.price),
      expirationBlock: parseInt(offer.expiration),
    }))
  }

  private calcSecondsToBlock(block: number): number {
    const secondsForEachBlock = 12
    return secondsForEachBlock * (block - this.currentBlock)
  }

  public calcExpirationTime(expirationBlock: number): string {
    if (this.currentBlock === 0) {
      return 'computing'
    }
    if (this.currentBlock > expirationBlock) {
      return 'expired'
    }
    return formatSecondsToDuration(this.calcSecondsToBlock(expirationBlock))
  }

  public calcExpirationDate(expirationBlock: number): string {
    return endDate(this.calcSecondsToBlock(expirationBlock))
  }

  public isExpired(expirationBlock: number): boolean {
    return this.currentBlock >= expirationBlock
  }

  protected async submit(
    maker: string,
    nftId: string,
    collectionId: string,
    withdraw: boolean,
    onSuccess?: () => void
  ) {
    try {
      const api = await this.useApi()
      this.initTransactionLoader()
      const cb = !withdraw
        ? api.tx.marketplace.acceptOffer
        : api.tx.marketplace.withdrawOffer
      const args = [collectionId, nftId, maker]

      await this.howAboutToExecute(this.accountId, cb, args, (blockNumber) => {
        const msg = !withdraw
          ? this.$t('offer.accept')
          : this.$t('offer.withdraw')
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
