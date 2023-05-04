<template>
  <section>
    <Loader v-model="isLoading" :status="status" />
    <nuxt-link
      v-if="$route.query.target"
      :to="`/${urlPrefix}/u/${destinationAddress}`"
      class="pl-4 is-flex is-align-items-center">
      <NeoIcon icon="chevron-left" size="is-small" class="mr-2" />
      {{ $t('teleport.artistProfile') }}
    </nuxt-link>
    <p class="title is-size-3">
      {{ $t('teleport.page') }} {{ unit }}
      <span v-if="isKSM" class="has-text-primary"
        >${{ fiatStore.getCurrentKSMValue }}</span
      >
    </p>

    <b-field>
      <Auth />
    </b-field>

    <AccountBalance />

    <p class="subtitle is-size-6">
      {{ routeMessage }}
    </p>

    <BasicSwitch v-model="sendingMyself" label="action.sendToMyself" />

    <b-field v-show="!sendingMyself">
      <AddressInput v-model="destinationAddress" :strict="false" />
    </b-field>
    <DisabledInput
      v-show="correctAddress && correctAddress !== destinationAddress"
      :label="$t('general.correctAddress')"
      :value="correctAddress" />
    <div class="box--container mb-3">
      <b-field>
        <BalanceInput
          v-model="price"
          :label="$t('amount')"
          :calculate="false"
          @input="onAmountFieldChange" />
      </b-field>
      <b-field v-if="isKSM">
        <ReadOnlyBalanceInput
          v-model="usdValue"
          :label-input="$t('teleport.usdInput')"
          label="USD"
          @input="onUSDFieldChange" />
      </b-field>
    </div>

    <div class="buttons">
      <b-button
        type="is-primary"
        icon-left="paper-plane"
        :loading="isLoading"
        :disabled="disabled"
        outlined
        @click="submit">
        {{ $t('general.submit') }}
      </b-button>
      <b-button
        v-if="transactionValue"
        type="is-success"
        class="ml-4"
        icon-left="external-link-alt"
        outlined
        @click="getExplorerUrl">
        {{ $t('View Transaction') }} {{ transactionValue.substring(0, 6)
        }}{{ '...' }}
      </b-button>
      <b-button
        v-if="transactionValue"
        v-clipboard:copy="getUrl()"
        type="is-primary"
        @click="toast($t('toast.urlCopy'))">
        <NeoIcon size="is-small" pack="fas" icon="link" />
      </b-button>
      <b-button
        v-if="destinationAddress"
        v-clipboard:copy="generatePaymentLink()"
        type="is-success"
        icon-left="money-bill"
        :loading="isLoading"
        outlined
        @click="toast($t('toast.paymentLinkCopy'))">
        {{ $t('teleport.btnCopyPayment') }}
      </b-button>
    </div>
    <div v-if="transactionValue && $route.query.donation">
      <div class="is-size-5">
        🎉 {{ $t('teleport.congratsSupport') }}
        <Identity ref="identity" :address="$route.query.target" />
      </div>
      <b-button
        type="is-info"
        class="mt-2"
        icon-left="share-square"
        outlined
        @click="shareInTweet">
        {{ $t('teleport.tweetDonation') }}
      </b-button>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Watch, mixins } from 'nuxt-property-decorator'
import { encodeAddress, isAddress } from '@polkadot/util-crypto'
import { DispatchError } from '@polkadot/types/interfaces'
import { onApiConnect } from '@kodadot1/sub-api'

import exec, { execResultValue, txCb } from '@/utils/transactionExecutor'
import { notificationTypes, showNotification } from '@/utils/notification'

import { calculateKsmFromUsd, calculateUsdFromKsm } from '@/utils/calculation'
import { findCall, getApiParams } from '@/utils/teleport'
import { calculateBalance } from '@/utils/format/balance'
import correctFormat from '@/utils/ss58Format'
import { urlBuilderTransaction } from '@/utils/explorerGuide'

import AuthMixin from '@/utils/mixins/authMixin'
import ChainMixin from '@/utils/mixins/chainMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import TransactionMixin from '@/utils/mixins/txMixin'
import UseApiMixin from '@/utils/mixins/useApiMixin'

import { useFiatStore } from '@/stores/fiat'
import { NeoIcon } from '@kodadot1/brick'

@Component({
  components: {
    Auth: () => import('@/components/shared/Auth.vue'),
    BalanceInput: () => import('@/components/shared/BalanceInput.vue'),
    AccountBalance: () => import('@/components/shared/AccountBalance.vue'),
    ReadOnlyBalanceInput: () =>
      import('@/components/shared/ReadOnlyBalanceInput.vue'),
    Identity: () => import('@/components/identity/IdentityIndex.vue'),
    Loader: () => import('@/components/shared/Loader.vue'),
    AddressInput: () => import('@/components/shared/AddressInput.vue'),
    Money: () => import('@/components/shared/format/Money.vue'),
    DisabledInput: () => import('@/components/shared/DisabledInput.vue'),
    BasicSwitch: () => import('@/components/shared/form/BasicSwitch.vue'),
    NeoIcon,
  },
})
export default class Transfer extends mixins(
  TransactionMixin,
  AuthMixin,
  ChainMixin,
  UseApiMixin,
  PrefixMixin
) {
  protected destinationAddress = ''
  protected transactionValue = ''
  protected price = 0
  protected usdValue = 0
  protected sendingMyself = true
  protected isParaTeleport = true
  protected paraTeleport: string | null = null

  get disabled(): boolean {
    return !(
      this.accountId &&
      this.price &&
      (this.sendingMyself || this.hasAddress)
    )
  }
  get ss58Format(): number {
    return this.chainProperties?.ss58Format
  }
  get hasAddress(): boolean {
    return isAddress(this.destinationAddress)
  }
  get correctAddress(): string {
    return this.hasAddress
      ? encodeAddress(this.destinationAddress, correctFormat(this.ss58Format))
      : ''
  }

  get isKSM(): boolean {
    return this.unit === 'KSM'
  }

  get fiatStore() {
    return useFiatStore()
  }

  layout() {
    return 'centered-half-layout'
  }

  protected created() {
    this.fiatStore.fetchFiatPrice()
    this.checkQueryParams()
    onApiConnect(this.apiUrl, async (api) => {
      const paraId = await api.query.parachainInfo?.parachainId()
      this.paraTeleport = paraId?.toString() || ''
    })
  }

  get isRouteHidden(): boolean {
    return this.paraTeleport === null
  }

  get routeMessage() {
    const [from, to] = this.currentRoute
    return this.$t('teleport.route', [this.unit, from, to])
  }

  get currentRoute(): [string, string] {
    if (this.paraTeleport === '') {
      return ['relaychain', 'parachain']
    }

    if (this.paraTeleport === null) {
      return ['unknown', 'unknown']
    }

    return [`parachain ${this.paraTeleport}`, 'relaychain']
  }

  get balance(): string {
    return this.$store.getters.getAuthBalance
  }

  protected onAmountFieldChange() {
    /* calculating usd value on the basis of price entered */
    if (this.price) {
      this.usdValue = calculateUsdFromKsm(
        this.fiatStore.getCurrentKSMValue as number,
        this.price
      )
    } else {
      this.usdValue = 0
    }
  }

  protected onUSDFieldChange() {
    /* calculating price value on the basis of usd entered */
    if (this.usdValue) {
      this.price = calculateKsmFromUsd(
        this.fiatStore.getCurrentKSMValue as number,
        this.usdValue
      )
    } else {
      this.price = 0
    }
  }

  protected checkQueryParams() {
    const { query } = this.$route

    if (query.target) {
      const hasAddress = isAddress(query.target as string)
      if (hasAddress) {
        this.destinationAddress = query.target as string
      } else {
        showNotification('Unable to use target address', notificationTypes.warn)
      }
    }

    if (query.amount) {
      this.price = Number(query.amount)
    }

    if (query.usdamount) {
      this.usdValue = Number(query.usdamount)
      // getting ksm value from the usd value
      this.price = calculateKsmFromUsd(
        this.fiatStore.getCurrentKSMValue as number,
        this.usdValue
      )
    }
  }

  public async submit(): Promise<void> {
    showNotification(
      `${this.$route.query.target ? 'Sent for Sign' : 'Dispatched'}`
    )
    this.initTransactionLoader()

    try {
      const api = await this.useApi()
      const isParaTeleport = await api.query.parachainInfo?.parachainId()

      const cb = findCall(api)
      const arg = getApiParams(
        api,
        cb,
        isParaTeleport?.toString(),
        this.sendingMyself ? this.accountId : this.destinationAddress,
        calculateBalance(this.price, this.decimals).toString()
      )

      const tx = await exec(
        this.accountId,
        '',
        cb,
        arg,
        txCb(
          async (blockHash) => {
            this.transactionValue = execResultValue(tx)
            const header = await api.rpc.chain.getHeader(blockHash)
            const blockNumber = header.number.toString()

            showNotification(
              `[${this.unit}] Transfered ${this.price} ${this.unit} in block ${blockNumber}`,
              notificationTypes.success
            )

            this.destinationAddress = ''
            this.price = 0
            this.usdValue = 0
            if (this.$route.query && !this.$route.query.donation) {
              this.$router.push(this.$route.path)
            }

            this.isLoading = false
          },
          (dispatchError) => {
            execResultValue(tx)
            this.onTxError(dispatchError)
            this.isLoading = false
          },
          (res) => this.resolveStatus(res.status)
        )
      )
    } catch (e) {
      this.$consola.error('[ERR: TRANSFER SUBMIT]', e)
      if (e instanceof Error) {
        showNotification(e.message, notificationTypes.warn)
      }
    }
  }

  protected async onTxError(dispatchError: DispatchError): Promise<void> {
    const api = await this.useApi()
    if (dispatchError.isModule) {
      const decoded = api.registry.findMetaError(dispatchError.asModule)
      const { docs, name, section } = decoded
      showNotification(
        `[ERR] ${section}.${name}: ${docs.join(' ')}`,
        notificationTypes.warn
      )
    } else {
      showNotification(
        `[ERR] ${dispatchError.toString()}`,
        notificationTypes.warn
      )
    }

    this.isLoading = false
  }

  protected getUrl(): string {
    return urlBuilderTransaction(this.transactionValue, this.blockExplorer)
  }

  protected getExplorerUrl(): void {
    const url = this.getUrl()
    window.open(url, '_blank')
  }

  protected generatePaymentLink(): string {
    return `${window.location.origin}/transfer?target=${this.destinationAddress}&usdamount=${this.usdValue}&donation=true`
  }

  protected shareInTweet() {
    const text =
      'I have just helped a really cool creator by donating. Check my donation proof:'
    const url = `https://twitter.com/intent/tweet?text=${text}&via=KodaDot&url=${this.getUrl()}`
    window.open(url, '_blank')
  }

  @Watch('destinationAddress')
  destinationChanged(value: string): void {
    const queryValue: any = {}
    if (value) {
      queryValue.target = value
    }
    if (this.$route.query.usdamount) {
      queryValue.usdamount = this.$route.query.usdamount
    }
    this.$router.replace({
      name: String(this.$route.name),
      query: queryValue,
    })
  }

  @Watch('usdValue')
  usdValueChanged(value: string): void {
    const queryValue: any = {}
    if (value) {
      queryValue.usdamount = value
    }
    if (this.$route.query.target) {
      queryValue.target = this.$route.query.target
    }
    this.$router.replace({
      name: String(this.$route.name),
      query: queryValue,
    })
  }

  private toast(message: string): void {
    this.$buefy.toast.open(message)
  }
}
</script>
