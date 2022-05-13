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
      <template v-else-if="isForSale">
        <b-tooltip :active="buyDisabled" :label="$t('tooltip.buyDisabled')">
          <b-button
            :type="iconType(ShoppingActions.BUY)[0]"
            :disabled="buyDisabled || !isAvailableToBuy"
            style="border-width: 2px"
            outlined
            @click="handleAction(ShoppingActions.BUY)"
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
import Connector from '@kodadot1/sub-api'
import { notificationTypes, showNotification } from '@/utils/notification'
import { unpin } from '@/utils/proxy'
import { GenericAccountId } from '@polkadot/types/generic/AccountId'
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin'
import { somePercentFromTX } from '@/utils/support'
import shouldUpdate from '@/utils/shouldUpdate'
import nftById from '@/queries/nftById.graphql'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import AuthMixin from '~/utils/mixins/authMixin'
import KeyboardEventsMixin from '~/utils/mixins/keyboardEventsMixin'
import MetaTransactionMixin from '~/utils/mixins/metaMixin'
import { get } from 'idb-keyval'
import { identityStore } from '@/utils/idbStore'
import { emptyObject } from '~/utils/empty'
import { isAddress } from '@polkadot/util-crypto'
import { downloadImage } from '@/utils/download'
import { createInteraction, JustInteraction } from '@kodadot1/minimark'
import {
  ShoppingActions,
  KeyboardValueToActionMap,
  getActions,
} from '@/utils/shoppingActions'

type Address = string | GenericAccountId | undefined
type IdentityFields = Record<string, string>

type DescriptionTuple = [string, string] | [string]
const iconResolver: Record<string, DescriptionTuple> = {
  [ShoppingActions.SEND]: ['is-info is-dark'],
  [ShoppingActions.CONSUME]: ['is-danger'],
  [ShoppingActions.LIST]: ['is-light'],
  [ShoppingActions.BUY]: ['is-success is-dark'],
  [ShoppingActions.DOWNLOAD]: ['is-warning'],
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
  AuthMixin
) {
  @Prop() public currentOwnerId!: string
  @Prop() public originialOwner!: string
  @Prop() public price!: string
  @Prop() public nftId!: string
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
        case ShoppingActions.DOWNLOAD: {
          const { image, name } = this.currentGalleryItemImage
          image && downloadImage(image, name)
          break
        }
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

  get isOwner(): boolean {
    this.$consola.log(
      '{ currentOwnerId, accountId }',
      this.currentOwnerId,
      this.accountId
    )

    return Boolean(
      this.currentOwnerId &&
        this.accountId &&
        this.currentOwnerId === this.accountId
    )
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

  get currentGalleryItemImage(): { image: string; name: string } {
    return this.$store.getters['history/getCurrentlyViewedItem'] || {}
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
      query: nftById,
      client: this.urlPrefix,
      variables: {
        id: this.nftId,
      },
    })

    const {
      data: { nFTEntity },
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
    const { api } = Connector.getInstance()
    const rmrk = this.constructRmrk()
    this.isLoading = true

    try {
      if (this.isActionEmpty) {
        throw new ReferenceError('No action selected')
      }
      showNotification(rmrk)
      this.$consola.log('submit', rmrk)
      const isBuy = this.isBuy
      const cb = isBuy ? api.tx.utility.batchAll : api.tx.system.remark
      const arg = isBuy
        ? [
            api.tx.system.remark(rmrk),
            api.tx.balances.transfer(this.currentOwnerId, this.price),
            somePercentFromTX(this.price),
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
