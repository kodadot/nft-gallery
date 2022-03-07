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
      @click="submitAction">
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
import MetaTransactionMixin from '~/utils/mixins/metaMixin'
import { get } from 'idb-keyval'
import { identityStore } from '@/utils/idbStore'
import { emptyObject } from '~/utils/empty'
import { isAddress } from '@polkadot/util-crypto'
import { getActions } from '../shoppingActions'
import { Interaction } from '@kodadot1/minimark'

type Address = string | GenericAccountId | undefined
type IdentityFields = Record<string, string>

type DescriptionTuple = [string, string] | [string]
const iconResolver: Record<string, DescriptionTuple> = {
  [Interaction.SEND]: ['is-info is-dark'],
  [Interaction.CONSUME]: ['is-danger'],
  [Interaction.LIST]: ['is-light'],
  [Interaction.BUY]: ['is-success is-dark'],
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
  MetaTransactionMixin
) {
  @Prop() public currentOwnerId!: string
  @Prop() public accountId!: string
  @Prop() public originialOwner!: string
  @Prop() public price!: string
  @Prop() public nftId!: string
  @Prop({ default: () => [] }) public ipfsHashes!: string[]
  @Prop({ default: false }) public buyDisabled!: boolean
  protected selectedAction: Interaction | null = null
  protected meta: string | number = ''
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
      this.selectedAction === Interaction.SEND &&
      !isAddress(this.meta.toString())
    )
  }

  private bindActionEvents(event) {
    const mappings = {
      b: Interaction.BUY,
      s: Interaction.SEND,
      c: Interaction.CONSUME,
      l: Interaction.LIST,
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
    if (!this.selectedAction) return false
    return [Interaction.SEND, Interaction.LIST].includes(this.selectedAction)
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

  protected iconType(action: Interaction) {
    return iconResolver[action]
  }

  protected handleAction(action: Interaction) {
    if (shouldUpdate(action, this.selectedAction)) {
      this.selectedAction = action
      switch (action) {
        case Interaction.BUY:
          this.submitAction()
          break
        case Interaction.LIST:
          this.balanceInput?.focusInput()
          break
        case Interaction.SEND:
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

  private handleSelect(value: Interaction) {
    this.selectedAction = value
    this.meta = ''
  }

  get isBuy() {
    return this.selectedAction === Interaction.BUY
  }

  get isList() {
    return this.selectedAction === Interaction.LIST
  }

  get isSend() {
    return this.selectedAction === Interaction.SEND
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

  unlistNft() {
    // change the selected action to list and change meta value to 0
    this.selectedAction = Interaction.LIST
    this.meta = 0
    this.submitAction()
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
