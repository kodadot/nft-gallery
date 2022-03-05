<template>
  <div class="actions-wrap">
    <Loader v-model="isLoading" :status="status" />
    <div v-if="accountId" class="buttons">
      <ShareNetwork
        v-if="identity && identity.twitter && this.isOwner"
        tag="button"
        class="button is-info is-dark is-outlined is-fullwidth twitter-btn"
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
          outlined
          @click="handleAction(action)"
          expanded>
          {{ action }}
        </b-button>
      </template>
      <template v-else>
        <b-tooltip :active="buyDisabled" :label="$t('tooltip.buyDisabled')">
          <b-button
            :type="iconType('BUY')[0]"
            :disabled="buyDisabled || !isAvailableToBuy"
            outlined
            @click="handleAction('BUY')"
            expanded>
            {{ replaceBuyNowWithYolo ? 'YOLO' : 'BUY' }}
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
import { Component, mixins, Prop, Ref, Watch } from 'nuxt-property-decorator'
import { GenericAccountId } from '@polkadot/types/generic/AccountId'
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin'
import shouldUpdate from '@/utils/shouldUpdate'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import KeyboardEventsMixin from '~/utils/mixins/keyboardEventsMixin'
import { get } from 'idb-keyval'
import { identityStore } from '@/utils/idbStore'
import { emptyObject } from '~/utils/empty'
import { isAddress } from '@polkadot/util-crypto'
import { ShoppingAction, getActions, submitAction } from '../shoppingActions'
type Address = string | GenericAccountId | undefined
type IdentityFields = Record<string, string>

type DescriptionTuple = [string, string] | [string]
const iconResolver: Record<string, DescriptionTuple> = {
  [ShoppingAction.SEND]: ['is-info is-dark'],
  [ShoppingAction.CONSUME]: ['is-danger'],
  [ShoppingAction.LIST]: ['is-light'],
  [ShoppingAction.BUY]: ['is-success is-dark'],
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
  KeyboardEventsMixin
) {
  @Prop() public currentOwnerId!: string
  @Prop() public accountId!: string
  @Prop() public originialOwner!: string
  @Prop() public price!: string
  @Prop() public nftId!: string
  @Prop({ default: () => [] }) public ipfsHashes!: string[]
  @Prop({ default: false }) public buyDisabled!: boolean
  private selectedAction: ShoppingAction | null = null
  private meta: string | number = ''
  protected isLoading = false
  protected status = ''
  protected label = ''
  private identity: IdentityFields = emptyObject<IdentityFields>()
  private ownerIdentity: IdentityFields = emptyObject<IdentityFields>()

  @Ref('balanceInput') readonly balanceInput
  @Ref('addressInput') readonly addressInput

  public created() {
    this.initKeyboardEventHandler({
      a: this.bindActionEvents,
    })
  }

  get disabled(): boolean {
    return (
      this.selectedAction === ShoppingAction.SEND &&
      !isAddress(this.meta.toString())
    )
  }

  private bindActionEvents(event) {
    const mappings = {
      b: ShoppingAction.BUY,
      s: ShoppingAction.SEND,
      c: ShoppingAction.CONSUME,
      l: ShoppingAction.LIST,
    }

    event.preventDefault()

    this.handleAction(mappings[event.key])
  }

  get actions() {
    return getActions(this.isOwner, this.isAvailableToBuy)
  }

  get showSubmit() {
    return (
      this.selectedAction && (!this.showMeta || this.metaValid) && !this.isBuy
    )
  }

  get metaValid() {
    if (typeof this.meta === 'number') {
      return this.meta >= 0
    }

    return this.meta
  }

  get showMeta() {
    return !!(
      this.selectedAction &&
      [ShoppingAction.SEND, ShoppingAction.LIST].includes(this.selectedAction)
    )
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

  protected iconType(action: ShoppingAction) {
    return iconResolver[action]
  }

  protected handleAction(action: ShoppingAction) {
    if (shouldUpdate(action, this.selectedAction)) {
      this.selectedAction = action
      switch (action) {
        case ShoppingAction.BUY:
          this.submit()
          break
        case ShoppingAction.LIST:
          this.balanceInput?.focusInput()
          break
        case ShoppingAction.SEND:
          this.addressInput?.focusInput()
          break
        default:
          break
      }
    } else {
      this.selectedAction = null
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

  get isOwner(): boolean {
    console.log(
      '{ currentOwnerId, accountId }',
      this.currentOwnerId,
      this.accountId
    )

    return !!(
      this.currentOwnerId &&
      this.accountId &&
      this.currentOwnerId === this.accountId
    )
  }

  get isAvailableToBuy(): boolean {
    const { price, accountId } = this
    return !!(accountId && Number(price) > 0)
  }

  private handleSelect(value: ShoppingAction) {
    this.selectedAction = value
    this.meta = ''
  }

  get isBuy() {
    return this.selectedAction === ShoppingAction.BUY
  }

  get isList() {
    return this.selectedAction === ShoppingAction.LIST
  }

  get isSend() {
    return this.selectedAction === ShoppingAction.SEND
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
    console.log(typeof value, value)
    this.meta = value
  }

  protected async submit() {
    const {
      urlPrefix,
      accountId,
      version,
      meta,
      nftId,
      metaValid,
      currentOwnerId,
      price,
    } = this
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

    submitAction({
      action: this.selectedAction,
      urlPrefix,
      accountId,
      version,
      meta,
      nftId,
      metaValid,
      currentOwnerId,
      price,
      apollo: this.$apollo,
      ipfsHashes: this.ipfsHashes,
      onResult,
      onError: finishCb,
      onSuccess: finishCb,
      onCatchError: finishCb,
    })
  }

  unlistNft() {
    // change the selected action to list and change meta value to 0
    this.selectedAction = ShoppingAction.LIST
    this.meta = 0
    this.submit()
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
    .b-tooltip {
      width: 100%;
    }
  }
}
</style>
