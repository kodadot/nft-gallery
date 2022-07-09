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
      class="mb-4"
      v-if="showMeta"
      :is="showMeta"
      @input="updateMeta"
      emptyOnError />
    <SubmitButton v-if="showSubmit" @click="submit">
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
import Connector from '@kodadot1/sub-api'
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import formatBalance from '@/utils/formatBalance'
import onApiConnect from '@/utils/api/general'

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
  AuthMixin
) {
  @Prop(String) public currentOwnerId!: string
  @Prop() public price!: string
  @Prop(String) public nftId!: string
  @Prop(String) public collectionId!: string
  @Prop(Boolean) public isMakeOffersAllowed!: boolean
  @Prop(Boolean) public isOwner!: boolean
  @Prop({ type: Array, default: () => [] }) public ipfsHashes!: string[]

  private selectedAction: ShoppingActions | '' = ''
  private meta: string | number = ''

  public minimumOfferAmount = 0
  public isMakeOffersDisabled = true
  public tooltipOfferLabel = {}

  get balance(): number {
    return Number(this.$store.getters.getAuthBalance)
  }

  get actions() {
    return getActionList('bsx', this.isOwner, this.isAvailableToBuy)
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
    onApiConnect(() => {
      const { api } = Connector.getInstance()
      this.minimumOfferAmount = parseFloat(
        formatBalance(
          api?.consts?.marketplace?.minimumOfferAmount?.toString(),
          12,
          false
        ).replace(/,/g, '')
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
    this.$consola.log(typeof value, value)
    this.meta = value
  }

  protected async submit() {
    const { api } = Connector.getInstance()
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

<style scoped>
.only-border-top {
  border-bottom: none;
  border-left: none;
  border-right: none;
}
</style>
