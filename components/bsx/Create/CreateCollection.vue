<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <BaseCollectionForm ref="collectionForm" v-bind.sync="base">
      <template #main>
        <b-field class="mb-5" />
      </template>
      <template #footer>
        <!-- Hidden as of 11.July.2022 due to lack of convenience #3407 -->
        <!-- <CustomAttributeInput
          :max="10"
          v-model="attributes"
          class="mb-3"
          visible="collapse.collection.attributes.show"
          hidden="collapse.collection.attributes.hide" /> -->
        <b-field>
          <p class="has-text-weight-medium is-size-6 has-text-info">
            {{ $t('mint.deposit') }}:
            <Money :value="collectionDeposit" :token-id="tokenId" inline />
          </p>
        </b-field>
        <b-field>
          <AccountBalance
            :token-id="feesToken === 'KSM' ? tokenId : undefined" />
        </b-field>
        <b-field>
          <MultiPaymentFeeButton :account-id="accountId" :prefix="urlPrefix" />
        </b-field>
        <b-field type="is-danger" :message="balanceNotEnoughMessage">
          <SubmitButton
            expanded
            label="create collection"
            :loading="isLoading"
            @click="submit" />
        </b-field>
      </template>
    </BaseCollectionForm>
  </div>
</template>

<script lang="ts">
import { Attribute } from '@/components/rmrk/types'
import {
  getMetadataDeposit,
  getclassDeposit,
} from '@/components/unique/apiConstants'
import { hasEnoughToken } from '@/components/unique/utils'
import formatBalance from '@/utils/format/balance'
import AuthMixin from '@/utils/mixins/authMixin'
import ChainMixin from '@/utils/mixins/chainMixin'
import MetaTransactionMixin from '@/utils/mixins/metaMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import ApiUrlMixin from '@/utils/mixins/apiUrlMixin'
import { notificationTypes, showNotification } from '@/utils/notification'
import { estimate } from '@/utils/transactionExecutor'
import { Interaction } from '@kodadot1/minimark'
import { Component, Ref, Watch, mixins } from 'nuxt-property-decorator'
import { ApiFactory, onApiConnect } from '@kodadot1/sub-api'
import { dummyIpfsCid } from '@/utils/ipfs'
import { createArgs } from '@/composables/transaction/mintCollection/utils'
import { BaseCollectionType } from '@/composables/transaction/types'
import shouldUpdate from '@/utils/shouldUpdate'
import { Token, getBalance, getDeposit, getFeesToken } from './utils'

const components = {
  Loader: () => import('@/components/shared/Loader.vue'),
  BasicInput: () => import('@/components/shared/form/BasicInput.vue'),
  BaseCollectionForm: () => import('@/components/base/BaseCollectionForm.vue'),
  BasicSwitch: () => import('@/components/shared/form/BasicSwitch.vue'),
  SubmitButton: () => import('@/components/base/SubmitButton.vue'),
  Money: () => import('@/components/bsx/format/TokenMoney.vue'),
  AccountBalance: () => import('@/components/shared/AccountBalance.vue'),
  MultiPaymentFeeButton: () =>
    import('@/components/bsx/specific/MultiPaymentFeeButton.vue'),
}

@Component({ components })
export default class CreateCollection extends mixins(
  MetaTransactionMixin,
  ChainMixin,
  AuthMixin,
  PrefixMixin,
  ApiUrlMixin
) {
  public base: BaseCollectionType = {
    name: '',
    file: null,
    description: '',
  }
  public collectionDeposit = ''
  protected id = '0'
  protected attributes: Attribute[] = []
  protected balanceNotEnough = false
  public feesToken: Token = 'BSX'
  @Ref('collectionForm') readonly collectionForm

  public checkValidity() {
    return this.collectionForm.checkValidity()
  }

  get balanceNotEnoughMessage() {
    if (this.balanceNotEnough) {
      return this.$t('tooltip.notEnoughBalance')
    }
    return ''
  }

  @Watch('accountId', { immediate: true })
  async onAccountIdChange(val: string, oldVal: string) {
    if (shouldUpdate(val, oldVal)) {
      this.feesToken = await getFeesToken()
    }
  }

  public async created() {
    onApiConnect(this.apiUrl, (api) => {
      const classDeposit = getclassDeposit(api)
      const metadataDeposit = getMetadataDeposit(api)
      this.collectionDeposit = (classDeposit + metadataDeposit).toString()
    })
  }
  get balanceOfToken() {
    return getBalance(this.feesToken)
  }

  get depositOfToken() {
    return getDeposit(this.feesToken, parseFloat(this.collectionDeposit))
  }

  protected async tryToEstimateTx(): Promise<string> {
    const api = await ApiFactory.useApiInstance(this.apiUrl)
    const cb = api.tx.utility.batchAll
    const metadata = dummyIpfsCid()
    const randomId = 0
    const args = [createArgs(randomId, metadata)]
    return estimate(this.accountId, cb, args)
  }

  protected async checkBalanceBeforeTx(): Promise<void> {
    const estimated = await this.tryToEstimateTx()
    const deposit = this.collectionDeposit
    const hasTokens = hasEnoughToken(this.balance, estimated, deposit)
    this.$consola.log('hasTokens', hasTokens)
    if (!hasTokens) {
      throw new Error(
        `Not enough tokens: Currently have ${formatBalance(
          this.balance,
          this.decimals,
          this.unit
        )} tokens`
      )
    }
  }

  public async submit(): Promise<void> {
    // check fields
    if (!this.checkValidity()) {
      return
    }
    // check balance
    if (!!this.collectionDeposit && this.balanceOfToken < this.depositOfToken) {
      this.balanceNotEnough = true
      return
    }
    this.isLoading = true
    this.status = 'loader.checkBalance'

    const { transaction, status, isLoading, blockNumber } = useTransaction()
    watch([isLoading, status], () => {
      this.isLoading = isLoading.value
      if (Boolean(status.value)) {
        this.status = status.value
      }
    })
    watch(blockNumber, (block) => {
      if (block) {
        this.$emit('created')
      }
    })

    try {
      // await this.checkBalanceBeforeTx()
      showNotification(
        this.$t('mint.creatingCollection', { name: this.base.name }),
        notificationTypes.info
      )
      this.status = 'loader.ipfs'
      transaction({
        interaction: Interaction.MINT,
        urlPrefix: usePrefix().urlPrefix.value,
        collection: {
          ...this.base,
          tags: this.attributes,
        },
      })
    } catch (e: any) {
      showNotification(`[ERR] ${e}`, notificationTypes.warn)
      this.$consola.error(e)
      this.isLoading = false
    }
  }
}
</script>
