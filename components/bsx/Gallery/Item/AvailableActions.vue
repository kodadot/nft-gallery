<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <ActionList
      v-if="accountId"
      :actions="actions"
      :isMakeOffersAllowed="!isMakeOffersDisabled"
      :tooltipOfferLabel="tooltipOfferLabel"
      @click="handleAction" />
    <component
      ref="balanceInput"
      class="mb-4"
      v-if="showMeta"
      :min="minimumOfferAmount"
      :max="balance"
      :is="showMeta"
      @input="updateMeta"
      emptyOnError />
    <SubmitButton
      v-if="showSubmit"
      @click="submit"
      :disabled="disableSubmitButton">
      {{ $t('nft.action.submit', [selectedAction]) }}
    </SubmitButton>
  </div>
</template>

<script lang="ts">
import { NFTAction } from '@/components/unique/NftUtils'
import { createTokenId } from '@/components/unique/utils'
import { isSameAccount } from '@/utils/account'
import { bsxParamResolver, getApiCall } from '@/utils/gallery/abstractCalls'
import AuthMixin from '@/utils/mixins/authMixin'
import KeyboardEventsMixin from '@/utils/mixins/keyboardEventsMixin'
import MetaTransactionMixin from '@/utils/mixins/metaMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import { notificationTypes, showNotification } from '@/utils/notification'
import { unpin } from '@/utils/proxy'
import {
  actionComponent,
  getActionList,
  iconResolver,
  ShoppingActions,
} from '@/utils/shoppingActions'
import shouldUpdate from '@/utils/shouldUpdate'
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import formatBalance from '@/utils/formatBalance'
import { onApiConnect } from '@kodadot1/sub-api'
import BalanceInput from '@/components/shared/BalanceInput.vue'
import UseApiMixin from '@/utils/mixins/useApiMixin'

const components = {
  ActionList: () => import('@/components/rmrk/Gallery/Item/ActionList.vue'),
  AddressInput: () => import('@/components/shared/AddressInput.vue'),
  BalanceInput: () => import('@/components/shared/BalanceInput.vue'),
  SubmitButton: () => import('@/components/base/SubmitButton.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
}

@Component({ components })
export default class AvailableActions extends mixins(
  PrefixMixin,
  KeyboardEventsMixin,
  MetaTransactionMixin,
  AuthMixin,
  UseApiMixin
) {
  @Prop(String) public currentOwnerId!: string
  @Prop() public price!: string
  @Prop(String) public nftId!: string
  @Prop(String) public collectionId!: string
  @Prop(Boolean) public isMakeOffersAllowed!: boolean
  @Prop({ type: Array, default: () => [] }) public ipfsHashes!: string[]

  private selectedAction: ShoppingActions | '' = ''
  private meta: string | number = ''
  public minimumOfferAmount = 0
  public isMakeOffersDisabled = true
  public isBalanceInputValid = false
  public tooltipOfferLabel = this.$t('tooltip.makeOfferDisabled')

  get balance(): number {
    return this.formatBalance(this.$store.getters.getAuthBalance)
  }

  get actions() {
    return getActionList('bsx', this.isOwner, this.isAvailableToBuy)
  }

  get disableSubmitButton() {
    if (this.selectedAction === ShoppingActions.MAKE_OFFER) {
      return !this.isBalanceInputValid
    }

    return false
  }

  get isOwner(): boolean {
    this.$consola.log(
      '{ currentOwnerId, accountId }',
      this.currentOwnerId,
      this.accountId
    )

    return Boolean(
      this.currentOwnerId &&
        this.accountId &&
        isSameAccount(this.currentOwnerId, this.accountId)
    )
  }

  get showSubmit() {
    return this.selectedAction && (!this.showMeta || this.metaValid)
  }

  get metaValid() {
    if (Number.isInteger(Number(this.meta))) {
      return this.meta >= 0
    }

    return this.meta
  }

  get showMeta() {
    return actionComponent[this.selectedAction]
  }

  formatBalance(balance: string) {
    return parseFloat(formatBalance(balance, 12, false).replace(/,/g, ''))
  }
  public async created(): Promise<void> {
    onApiConnect(this.apiUrl, (api) => {
      this.minimumOfferAmount = this.formatBalance(
        api?.consts?.marketplace?.minimumOfferAmount?.toString()
      )
      this.isMakeOffersDisabled =
        !this.isMakeOffersAllowed || this.minimumOfferAmount > this.balance

      if (!this.isMakeOffersAllowed) {
        this.tooltipOfferLabel = this.$t('tooltip.makeOfferDisabled')
      } else if (this.minimumOfferAmount > this.balance) {
        this.tooltipOfferLabel = this.$t('tooltip.makeOfferNotEnoughBalance')
      }
    })
  }

  protected iconType(value: string) {
    return iconResolver[value]
  }

  protected handleAction(action: ShoppingActions) {
    if (shouldUpdate(action, this.selectedAction)) {
      this.selectedAction = action
    } else {
      this.selectedAction = NFTAction.NONE
      this.meta = ''
    }
  }

  get isAvailableToBuy(): boolean {
    const { price, accountId } = this
    return Boolean(accountId && Number(price) > 0)
  }

  get isConsume() {
    return this.selectedAction === ShoppingActions.CONSUME
  }

  protected updateMeta(value: string | number) {
    const balanceInputComponent = this.$refs.balanceInput as BalanceInput
    this.isBalanceInputValid = balanceInputComponent.checkValidity()
    this.$consola.log(typeof value, value)
    this.meta = value
  }

  protected async submit() {
    const api = await this.useApi()
    this.initTransactionLoader()

    try {
      if (!this.selectedAction || !this.collectionId) {
        this.$consola.log('EvalError', this.selectedAction, this.collectionId)
        throw new EvalError('Action or Collection not found')
      }

      showNotification(`[${this.selectedAction}] ${this.nftId}`)
      let cb = getApiCall(api, this.urlPrefix, this.selectedAction)
      let arg: any[] = this.getArgs()

      this.howAboutToExecute(
        this.accountId,
        cb,
        arg,
        (blockNumber: string) => {
          showNotification(blockNumber, notificationTypes.info)
          if (this.isConsume) {
            this.unpinNFT()
          }

          showNotification(
            `[${this.selectedAction}] ${this.nftId}`,
            notificationTypes.success
          )
          this.$emit('change')
          this.selectedAction = ''
        },
        () => {
          this.selectedAction = ''
        }
      )
    } catch (e) {
      showNotification(`[ERR] ${e}`, notificationTypes.danger)
      this.$consola.error(e)
      this.isLoading = false
    }
  }

  protected getArgs(): any[] {
    const { selectedAction, collectionId, nftId, currentOwnerId, meta } = this

    console.log(collectionId, nftId)

    return bsxParamResolver(
      createTokenId(collectionId, nftId),
      selectedAction,
      meta,
      currentOwnerId
    )
  }

  protected unpinNFT() {
    this.ipfsHashes.forEach(async (hash) => {
      if (hash) {
        try {
          await unpin(hash)
        } catch (e) {
          this.$consola.warn(`[ACTIONS] Cannot Unpin ${hash} because: ${e}`)
        }
      }
    })
  }
}
</script>
