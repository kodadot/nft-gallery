<template>
  <div class="actions-wrap">
    <Loader v-model="isLoading" :status="status" />
    <div v-if="accountId" class="buttons">
      <ShareNetwork
        v-if="identity && identity.twitter && isOwner"
        tag="button"
        class="button is-info is-dark is-outlined is-fullwidth twitter-btn only-border-top"
        network="twitter"
        :hashtags="'KodaDot'"
        :url="realworldFullPath"
        :title="labelTwitter">
        <b-icon pack="fab" icon="twitter" />
        <span class="joy">SHARE JOY</span>
      </ShareNetwork>
      <template v-if="isOwner">
        <b-button
          v-for="action in actions"
          :key="action"
          :type="iconType(action)[0]"
          class="only-border-top"
          outlined
          expanded
          :data-testid="`available-actions-${action}`"
          @click="handleAction(action)">
          {{ actionLabel(action) }}
        </b-button>
      </template>
      <template v-else-if="isForSale">
        <b-tooltip :active="buyDisabled" :label="$t('tooltip.buyDisabled')">
          <b-button
            class="only-border-top"
            :type="iconType(ShoppingActions.BUY)[0]"
            :disabled="buyDisabled || !isAvailableToBuy"
            style="border-width: 2px"
            outlined
            expanded
            data-testid="available-actions-BUY"
            data-cy="BUY"
            @click="handleAction(ShoppingActions.BUY)">
            {{ replaceBuyNowWithYolo ? 'YOLO' : actionLabel('BUY') }}
          </b-button>
        </b-tooltip>
      </template>
    </div>
    <BalanceInput
      v-show="isList"
      ref="balanceInput"
      class="mb-4"
      empty-on-error
      @input="updateMeta" />
    <AddressInput
      v-show="isSend"
      ref="addressInput"
      class="mb-4"
      @input="updateMeta" />
    <b-button
      v-if="showSubmit"
      type="is-primary"
      icon-left="paper-plane"
      :disabled="disabled"
      @click="submit">
      Submit {{ selectedAction }}
    </b-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Watch, mixins } from 'nuxt-property-decorator'
import { JustInteraction, createInteraction } from '@kodadot1/minimark'
import {
  KeyboardValueToActionMap,
  ShoppingActions,
  getActionButtonLabelKey,
  getActions,
} from '@/utils/shoppingActions'
import { notificationTypes, showNotification } from '@/utils/notification'

import { GenericAccountId } from '@polkadot/types/generic/AccountId'
import { TranslateResult } from 'vue-i18n/types'
import { emptyObject } from '@/utils/empty'
import { get } from 'idb-keyval'
import { identityStore } from '@/utils/idbStore'
import { isAddress } from '@polkadot/util-crypto'
import { somePercentFromTX } from '@/utils/support'
import { unpin } from '@/utils/proxy'

import AuthMixin from '@/utils/mixins/authMixin'
import KeyboardEventsMixin from '@/utils/mixins/keyboardEventsMixin'
import MetaTransactionMixin from '@/utils/mixins/metaMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin'
import UseApiMixin from '@/utils/mixins/useApiMixin'
import nftByIdMinimal from '@/queries/rmrk/subsquid/nftByIdMinimal.graphql'
import shouldUpdate from '@/utils/shouldUpdate'

type Address = string | GenericAccountId | undefined
type IdentityFields = Record<string, string>

type DescriptionTuple = [string, string] | [string]
const iconResolver: Record<string, DescriptionTuple> = {
  [ShoppingActions.SEND]: ['is-info is-dark'],
  [ShoppingActions.CONSUME]: ['is-danger'],
  [ShoppingActions.LIST]: ['is-light'],
  [ShoppingActions.BUY]: ['is-success is-dark'],
}

const components = {
  BalanceInput: () => import('@/components/shared/BalanceInput.vue'),
  AddressInput: () => import('@/components/shared/AddressInput.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
}

@Component({ components })
export default class AvailableActions extends mixins(
  RmrkVersionMixin,
  PrefixMixin,
  KeyboardEventsMixin,
  MetaTransactionMixin,
  AuthMixin,
  UseApiMixin
) {
  @Prop() public currentOwnerId!: string
  @Prop() public originialOwner!: string
  @Prop() public price!: string
  @Prop() public nftId!: string
  @Prop(Boolean) public isOwner!: boolean
  @Prop({ default: () => [] }) public ipfsHashes!: string[]
  @Prop({ default: false }) public buyDisabled!: boolean
  private selectedAction: ShoppingActions | '' = ''
  private meta: string | number = ''
  protected label = ''
  private identity: IdentityFields = emptyObject<IdentityFields>()
  private ownerIdentity: IdentityFields = emptyObject<IdentityFields>()
  private ShoppingActions = ShoppingActions

  @Ref('balanceInput') readonly balanceInput
  @Ref('addressInput') readonly addressInput

  public created() {
    this.initKeyboardEventHandler({
      a: this.bindActionEvents,
    })
  }

  get disabled(): boolean {
    return (
      this.selectedAction === ShoppingActions.SEND &&
      !isAddress(this.meta.toString())
    )
  }

  private bindActionEvents(event) {
    event.preventDefault()

    this.handleAction(KeyboardValueToActionMap[event.key])
  }

  get actions() {
    return getActions(this.isOwner, this.isAvailableToBuy)
  }

  get showSubmit() {
    return (
      this.selectedAction &&
      (!this.showMeta || this.metaValid) &&
      !this.isBuy &&
      !this.isDownload
    )
  }

  get metaValid() {
    if (typeof this.meta === 'number') {
      return this.meta >= 0
    }

    return this.meta
  }

  get showMeta() {
    return this.isSend || this.isList
  }

  get replaceBuyNowWithYolo(): boolean {
    return this.$store.getters['preferences/getReplaceBuyNowWithYolo']
  }

  get labelTwitter() {
    return `I'm sharing the joy from my recent purchase ${
      this.ownerIdentity?.twitter
        ? `made by ${this.ownerIdentity?.twitter}`
        : ''
    }`
  }

  get isForSale() {
    const price = parseInt(this.price)
    return price > 0
  }

  protected iconType(value: string) {
    return iconResolver[value]
  }

  protected handleAction(action: ShoppingActions) {
    if (shouldUpdate(action, this.selectedAction)) {
      this.selectedAction = action
      switch (action) {
        case ShoppingActions.BUY:
          this.submit()
          break
        case ShoppingActions.LIST:
          this.balanceInput?.focusInput()
          break
        case ShoppingActions.SEND:
          this.addressInput?.focusInput()
          break
        default:
          break
      }
    } else {
      this.selectedAction = ''
      this.meta = ''
    }
  }

  public async identityOf(account: Address) {
    const address: string = this.resolveAddress(account)
    const identity = await get(address, identityStore)
    return identity
  }

  private resolveAddress(account: Address): string {
    return account instanceof GenericAccountId
      ? account.toString()
      : account || ''
  }

  get isActionEmpty() {
    return this.selectedAction === ''
  }

  get isAvailableToBuy(): boolean {
    const { price, accountId } = this
    return Boolean(accountId && Number(price) > 0)
  }

  private constructRmrk(): string {
    const { selectedAction, version, meta, nftId } = this
    return createInteraction(
      selectedAction as JustInteraction,
      version,
      nftId,
      String(meta)
    )
  }

  get isBuy() {
    return this.selectedAction === ShoppingActions.BUY
  }

  get isConsume() {
    return this.selectedAction === ShoppingActions.CONSUME
  }

  get isList() {
    return this.selectedAction === ShoppingActions.LIST
  }

  get isSend() {
    return this.selectedAction === ShoppingActions.SEND
  }

  get isDownload() {
    return this.selectedAction === ShoppingActions.DOWNLOAD
  }

  get realworldFullPath() {
    return `${window.location.origin}${this.$route.fullPath}`
  }

  @Watch('originialOwner', { immediate: true })
  async watchOwnerAddress(newAddress: Address, oldAddress: Address) {
    if (shouldUpdate(newAddress, oldAddress)) {
      this.identityOf(newAddress).then((id) => (this.ownerIdentity = id))
    }
  }

  @Watch('accountId', { immediate: true })
  async watchAddress(newAddress: Address, oldAddress: Address) {
    if (shouldUpdate(newAddress, oldAddress)) {
      this.identityOf(newAddress).then((id) => (this.identity = id))
    }
  }

  protected updateMeta(value: string | number) {
    this.$consola.log(typeof value, value)
    this.meta = value
  }

  protected async checkBuyBeforeSubmit() {
    const nft = await this.$apollo.query({
      query: nftByIdMinimal,
      client: this.client,
      variables: {
        id: this.nftId,
      },
    })

    const {
      data: { nft: nFTEntity },
    } = nft

    if (
      nFTEntity.currentOwner !== this.currentOwnerId ||
      nFTEntity.burned ||
      nFTEntity.price === 0 ||
      nFTEntity.price !== this.price
    ) {
      showNotification(
        `[RMRK::${this.selectedAction}] Owner changed or NFT does not exist`,
        notificationTypes.warn
      )
      throw new ReferenceError('NFT has changed')
    }
  }

  protected async submit() {
    const api = await this.useApi()
    const rmrk = this.constructRmrk()
    this.isLoading = true

    try {
      if (this.isActionEmpty) {
        throw new ReferenceError('No action selected')
      }
      showNotification(`[${this.selectedAction}] NFT: ${this.nftId}`)
      this.$consola.log('submit', rmrk)
      const isBuy = this.isBuy
      const cb = isBuy ? api.tx.utility.batchAll : api.tx.system.remark
      const arg = isBuy
        ? [
            api.tx.system.remark(rmrk),
            api.tx.balances.transfer(this.currentOwnerId, this.price),
            somePercentFromTX(api, this.price),
          ]
        : rmrk

      if (isBuy) {
        await this.checkBuyBeforeSubmit()
      }

      this.howAboutToExecute(
        this.accountId,
        cb,
        [arg],
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

  unlistNft() {
    // change the selected action to list and change meta value to 0
    this.selectedAction = ShoppingActions.LIST
    this.meta = 0
    this.submit()
  }

  protected actionLabel(action: ShoppingActions): TranslateResult {
    return this.$t(getActionButtonLabelKey(action, this.price))
  }
}
</script>
<style scoped lang="scss">
.joy {
  font-size: 16px;
  margin-top: 2px;
}
.twitter-btn {
  border-color: #1c9cef !important;
  color: #1c9cef !important;
  &:hover {
    color: #fff !important;
  }
}
.actions-wrap {
  .buttons {
    button {
      border-width: 1px;
    }
    .b-tooltip {
      width: 100%;
    }
  }
}
</style>
