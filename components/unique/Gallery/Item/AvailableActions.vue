<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <div v-if="frozen" class="sub-title is-6 has-text-info">Frozen</div>
    <div v-if="accountId" class="buttons">
      <b-button
        v-for="action in actions"
        :key="action"
        :type="iconType(action)[0]"
        outlined
        expanded
        class="only-border-top"
        @click="handleAction(action)">
        {{ action }}
      </b-button>
    </div>
    <component
      :is="showMeta"
      v-if="showMeta"
      class="mb-4"
      empty-on-error
      @input="updateMeta" />
    <b-button
      v-if="showSubmit"
      type="is-primary"
      icon-left="paper-plane"
      @click="submit">
      Submit {{ selectedAction }}
    </b-button>
  </div>
</template>

<script lang="ts">
import NFTUtils, { NFTAction } from '@/components/unique/NftUtils'
import nftById from '@/queries/nftById.graphql'
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin'
import UseApiMixin from '@/utils/mixins/useApiMixin'
import { notificationTypes, showNotification } from '@/utils/notification'
import { unpin } from '@/utils/proxy'
import shouldUpdate from '@/utils/shouldUpdate'
import exec, { execResultValue, txCb } from '@/utils/transactionExecutor'
import { Component, Prop, mixins } from 'nuxt-property-decorator'

const ownerActions: NFTAction[] = [
  NFTAction.SEND,
  NFTAction.CONSUME,
  NFTAction.DELEGATE,
]
// const buyActions: NFTAction[] = [NFTAction.BUY]
const delegatorActions: NFTAction[] = [NFTAction.SEND]

const needMeta: Record<string, string> = {
  SEND: 'AddressInput',
  LIST: 'BalanceInput',
  DELEGATE: 'AddressInput',
}

type DescriptionTuple = [string, string] | [string]
const iconResolver: Record<string, DescriptionTuple> = {
  SEND: ['is-info is-dark'],
  CONSUME: ['is-danger'],
  DELEGATE: ['is-light'],
  FREEZE: ['is-warning is-dark'],
  REVOKE: ['is-warning is-dark'],
}

const components = {
  AddressInput: () => import('@/components/shared/AddressInput.vue'),
  BalanceInput: () => import('@/components/shared/BalanceInput.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
}

@Component({ components })
export default class AvailableActions extends mixins(
  RmrkVersionMixin,
  UseApiMixin
) {
  @Prop(String) public currentOwnerId!: string
  @Prop(String) public accountId!: string
  @Prop({ type: [String] }) public delegateId!: string
  @Prop() public price!: string
  @Prop() public nftId!: string
  @Prop(String) public collectionId!: string
  @Prop(Boolean) public frozen!: boolean
  @Prop(Boolean) public isOwner!: boolean
  @Prop({ type: Array, default: () => [] }) public ipfsHashes!: string[]

  private selectedAction: NFTAction = NFTAction.NONE
  private meta: string | number = ''
  protected isLoading = false
  protected status = ''

  get actions() {
    if (this.isOwner) {
      return this.delegateId
        ? [...ownerActions, NFTAction.REVOKE]
        : ownerActions
    }
    if (this.isDelegator) {
      return delegatorActions
    }
    return []
  }

  get showSubmit() {
    return this.selectedAction && (!this.showMeta || this.metaValid)
  }

  get metaValid() {
    if (typeof this.meta === 'number') {
      return this.meta >= 0
    }

    return this.meta
  }

  get showMeta() {
    return needMeta[this.selectedAction]
  }

  protected iconType(value: string) {
    return iconResolver[value]
  }

  protected handleAction(action: NFTAction) {
    if (shouldUpdate(action, this.selectedAction)) {
      this.selectedAction = action
    } else {
      this.selectedAction = NFTAction.NONE
      this.meta = ''
    }
  }

  get isDelegator() {
    return (
      this.delegateId && this.accountId && this.delegateId === this.accountId
    )
  }

  get isAvailableToBuy() {
    const { price, accountId } = this
    return accountId && Number(price) > 0
  }

  private handleSelect(value: NFTAction) {
    this.selectedAction = value
    this.meta = ''
  }

  get isConsume() {
    return this.selectedAction === 'CONSUME'
  }

  protected updateMeta(value: string | number) {
    this.$consola.log(typeof value, value)
    this.meta = value
  }

  protected async checkBuyBeforeSubmit() {
    const nft = await this.$apollo.query({
      query: nftById,
      variables: {
        id: this.nftId,
      },
    })

    const {
      data: { nFTEntity },
    } = nft
    // DEV: nFTEntity.price == 0 is a feature to handle the buy flow
    if (
      nFTEntity.currentOwner !== this.currentOwnerId ||
      nFTEntity.burned ||
      nFTEntity.price == 0 ||
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
    this.isLoading = true

    try {
      showNotification(`[${this.selectedAction}] NFT: ${this.nftId}`)
      const action = NFTUtils.apiCall(this.selectedAction)

      if (!action || !this.collectionId) {
        this.$consola.log('EvalError', action, this.collectionId)
        throw new EvalError('Action or Collection not found')
      }

      const [section, method] = action

      let cb = api.tx[section][method]
      let arg: any[] = this.getArgs()

      if (this.isConsume) {
        const burn = cb(...arg)
        cb = api.tx.utility.batchAll
        arg = [
          [burn, api.tx.uniques.clearMetadata(this.collectionId, this.nftId)],
        ]
      }

      const tx = await exec(
        this.accountId,
        '',
        cb,
        arg,
        txCb(
          async (blockHash) => {
            execResultValue(tx)
            const header = await api.rpc.chain.getHeader(blockHash)
            const blockNumber = header.number.toString()

            showNotification(
              `[NFT] ${this.selectedAction} processed in block ${blockNumber}`,
              notificationTypes.info
            )
            if (this.isConsume) {
              this.unpinNFT()
            }

            showNotification(
              `[${this.selectedAction}] ${this.nftId}`,
              notificationTypes.success
            )
            this.selectedAction = NFTAction.NONE
            this.isLoading = false
          },
          (err) => {
            execResultValue(tx)
            showNotification(`[ERR] ${err.hash}`, notificationTypes.warn)
            this.selectedAction = NFTAction.NONE
            this.isLoading = false
          },
          (res) => {
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
        )
      )
    } catch (e) {
      showNotification(`[ERR] ${e}`, notificationTypes.warn)
      this.$consola.error(e)
      this.isLoading = false
    }
  }
  getArgs() {
    const {
      selectedAction,
      collectionId,
      nftId,
      currentOwnerId,
      meta,
      delegateId,
    } = this

    return NFTUtils.getActionParams(
      selectedAction,
      collectionId,
      nftId,
      NFTUtils.correctMeta(
        selectedAction,
        String(meta),
        currentOwnerId,
        delegateId
      )
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
