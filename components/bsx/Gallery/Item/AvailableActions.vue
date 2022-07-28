<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <ActionList
      v-if="accountId"
      :actions="actions"
      :disabledToolTips="toolTips"
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
    <DaySelect v-if="showDaySelect" v-model="selectedDay" :days="dayList" />
    <SubmitButton
      v-if="showSubmit"
      @click="submit"
      :disabled="disableSubmitButton">
      {{ $t('nft.action.submit', [$t(`nft.event.${selectedAction}`)]) }}
    </SubmitButton>
  </div>
</template>

<script lang="ts">
import BalanceInput from '@/components/shared/BalanceInput.vue'
import AddressInput from '@/components/shared/AddressInput.vue'
import { NFTAction } from '@/components/unique/NftUtils'
import { createTokenId } from '@/components/unique/utils'
import { bsxParamResolver, getApiCall } from '@/utils/gallery/abstractCalls'
import AuthMixin from '@/utils/mixins/authMixin'
import KeyboardEventsMixin from '@/utils/mixins/keyboardEventsMixin'
import MetaTransactionMixin from '@/utils/mixins/metaMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import UseApiMixin from '@/utils/mixins/useApiMixin'
import { notificationTypes, showNotification } from '@/utils/notification'
import { unpin } from '@/utils/proxy'
import {
  actionComponent,
  getActionList,
  iconResolver,
  ShoppingActions,
  ShoppingActionToolTips,
} from '@/utils/shoppingActions'
import shouldUpdate from '@/utils/shouldUpdate'
import { onApiConnect } from '@kodadot1/sub-api'
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import { formatBsxBalanceToNumber } from '~/utils/format/balance'

const components = {
  ActionList: () => import('@/components/bsx/Gallery/Item/ActionList.vue'),
  AddressInput: () => import('@/components/shared/AddressInput.vue'),
  BalanceInput: () => import('@/components/shared/BalanceInput.vue'),
  SubmitButton: () => import('@/components/base/SubmitButton.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
  DaySelect: () => import('@/components/bsx/Offer/DaySelect.vue'),
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
  @Prop(Boolean) public isBuyAllowed!: boolean
  @Prop(Boolean) public isOwner!: boolean
  @Prop({ type: Array, default: () => [] }) public ipfsHashes!: string[]

  private selectedAction: ShoppingActions | '' = ''
  private meta: string | number = ''
  public minimumOfferAmount = 0
  public isMakeOffersDisabled = true
  public isBalanceInputValid = false
  public selectedDay = 14
  public dayList = [1, 3, 7, 14, 30]

  get balance(): number {
    return formatBsxBalanceToNumber(this.$store.getters.getAuthBalance)
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

  public async created(): Promise<void> {
    onApiConnect(this.apiUrl, (api) => {
      this.minimumOfferAmount = formatBsxBalanceToNumber(
        api?.consts?.marketplace?.minimumOfferAmount?.toString()
      )
      this.isMakeOffersDisabled =
        !this.isMakeOffersAllowed || this.minimumOfferAmount > this.balance
    })
  }

  get toolTips(): ShoppingActionToolTips {
    const toolTips = {}
    if (!this.isMakeOffersAllowed) {
      toolTips[ShoppingActions.MAKE_OFFER] = this.$t(
        'tooltip.makeOfferDisabled'
      ).toString()
    } else if (this.minimumOfferAmount > this.balance) {
      toolTips[ShoppingActions.MAKE_OFFER] = this.$t(
        'tooltip.notEnoughBalance'
      ).toString()
    }
    if (!this.isBuyAllowed) {
      toolTips[ShoppingActions.BUY] = this.$t(
        'tooltip.notEnoughBalance'
      ).toString()
    }
    return toolTips
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

  get showDaySelect(): boolean {
    return this.selectedAction === ShoppingActions.MAKE_OFFER
  }

  get isAvailableToBuy(): boolean {
    const { price, accountId } = this
    return Boolean(accountId && Number(price) > 0)
  }

  get isConsume() {
    return this.selectedAction === ShoppingActions.CONSUME
  }

  protected updateMeta(value: string | number) {
    const balanceInputComponent = this.$refs.balanceInput as
      | AddressInput
      | BalanceInput
    if (
      balanceInputComponent &&
      balanceInputComponent instanceof BalanceInput
    ) {
      this.isBalanceInputValid = balanceInputComponent.checkValidity()
    }
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
      let expiration: number | undefined = undefined
      if (this.selectedAction === ShoppingActions.MAKE_OFFER) {
        const currentBlock = await api.query.system.number()
        expiration = this.getExpiration(currentBlock.toNumber())
      }
      let arg: any[] = this.getArgs(expiration)

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
          this.$emit('change', this.selectedAction)
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

  protected getArgs(expiration?: number): any[] {
    const { selectedAction, collectionId, nftId, currentOwnerId, meta } = this

    return bsxParamResolver(
      createTokenId(collectionId, nftId),
      selectedAction,
      meta,
      currentOwnerId,
      expiration
    )
  }

  protected getExpiration(currentBlock: number): number {
    const BLOCK_OFFSET = 5 // time between submit & finalization
    const BLOCK_PER_DAY_COUNT = 7200 // 7200 = 86400 / 12
    const DAY_COUNT = this.selectedDay
    const expiration =
      currentBlock + BLOCK_OFFSET + BLOCK_PER_DAY_COUNT * DAY_COUNT
    return expiration
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
