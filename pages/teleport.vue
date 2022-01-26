<template>
  <section>
    <Loader v-model="isLoading" :status="status" />
    <nuxt-link
      v-if="$route.query.target"
      :to="`/rmrk/u/${destinationAddress}`"
      class="linkartist">
      <b-icon icon="chevron-left" size="is-small" class="linkartist--icon" />
      Go to artist's profile
    </nuxt-link>
    <div class="box">
      <div class="info">
        <p class="title is-size-3">Teleport {{ unit }}</p>
        <span v-if="isKSM" class="info--currentPrice" title="Current price"
          >${{ $store.getters['fiat/getCurrentKSMValue'] }}
        </span>
      </div>

      <b-field>
        <Auth />
      </b-field>

      <p class="subtitle is-size-6">
        <span>{{ $t('general.balance') }}: </span>
        <Money :value="balance" inline />
      </p>

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
            label="Amount"
            :calculate="false"
            @input="onAmountFieldChange" />
        </b-field>
        <b-field v-if="isKSM">
          <ReadOnlyBalanceInput
            v-model="usdValue"
            label-input="USD Value (approx)"
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
          class="tx"
          icon-left="external-link-alt"
          outlined
          @click="getExplorerUrl">
          {{ $t('View Transaction') }} {{ transactionValue.substring(0, 6)
          }}{{ '...' }}
        </b-button>
        <b-button
          v-if="transactionValue"
          @click="toast('URL copied to clipboard')"
          v-clipboard:copy="getUrl()"
          type="is-primary">
          <b-icon size="is-small" pack="fas" icon="link" />
        </b-button>
        <b-button
          v-if="destinationAddress"
          type="is-success"
          icon-left="money-bill"
          :loading="isLoading"
          @click="toast('Payment link copied to clipboard')"
          v-clipboard:copy="generatePaymentLink()"
          outlined>
          {{ $t('Copy Payment link') }}
        </b-button>
      </div>
      <div v-if="transactionValue && this.$route.query.donation">
        <div class="is-size-5">
          🎉 Congratulations for supporting
          <Identity ref="identity" :address="this.$route.query.target" inline />
        </div>
        <b-button
          type="is-info"
          class="tweetBtn"
          icon-left="share-square"
          outlined
          @click="shareInTweet">
          {{ $t('Tweet about your awesome donation') }}
        </b-button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, mixins, Watch } from 'nuxt-property-decorator'
import Connector from '@vue-polkadot/vue-api'
import exec, { execResultValue, txCb } from '@/utils/transactionExecutor'
import { notificationTypes, showNotification } from '@/utils/notification'
import TransactionMixin from '@/utils/mixins/txMixin'
import AuthMixin from '@/utils/mixins/authMixin'
import shouldUpdate from '@/utils/shouldUpdate'
import ChainMixin from '@/utils/mixins/chainMixin'
import { DispatchError } from '@polkadot/types/interfaces'
import { calculateBalance } from '@/utils/formatBalance'
import correctFormat from '@/utils/ss58Format'
import {
  checkAddress,
  decodeAddress,
  encodeAddress,
  isAddress,
} from '@polkadot/util-crypto'
import { urlBuilderTransaction } from '@/utils/explorerGuide'
import { calculateUsdFromKsm, calculateKsmFromUsd } from '@/utils/calculation'
import { findCall, getApiParams } from '@/utils/teleport'
import onApiConnect from '~/utils/api/general'

@Component({
  components: {
    Auth: () => import('@/components/shared/Auth.vue'),
    BalanceInput: () => import('@/components/shared/BalanceInput.vue'),
    ReadOnlyBalanceInput: () =>
      import('@/components/shared/ReadOnlyBalanceInput.vue'),
    Identity: () => import('@/components/shared/format/Identity.vue'),
    Loader: () => import('@/components/shared/Loader.vue'),
    AddressInput: () => import('@/components/shared/AddressInput.vue'),
    Money: () => import('@/components/shared/format/Money.vue'),
    DisabledInput: () => import('@/components/shared/DisabledInput.vue'),
    BasicSwitch: () => import('@/components/shared/form/BasicSwitch.vue'),
  },
})
export default class Transfer extends mixins(
  TransactionMixin,
  AuthMixin,
  ChainMixin
) {
  protected balance = '0'
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

  layout() {
    return 'centered-half-layout'
  }

  protected created() {
    this.$store.dispatch('fiat/fetchFiatPrice')
    this.checkQueryParams()
    onApiConnect(async (api) => {
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

  protected onAmountFieldChange() {
    /* calculating usd value on the basis of price entered */
    if (this.price) {
      this.usdValue = calculateUsdFromKsm(
        this.$store.getters['fiat/getCurrentKSMValue'],
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
        this.$store.getters['fiat/getCurrentKSMValue'],
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
        this.$store.getters['fiat/getCurrentKSMValue'],
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
      const { api } = Connector.getInstance()
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
      console.error('[ERR: TRANSFER SUBMIT]', e)
      if (e instanceof Error) {
        showNotification(e.message, notificationTypes.danger)
      }
    }
  }

  protected onTxError(dispatchError: DispatchError): void {
    const { api } = Connector.getInstance()
    if (dispatchError.isModule) {
      const decoded = api.registry.findMetaError(dispatchError.asModule)
      const { docs, name, section } = decoded
      showNotification(
        `[ERR] ${section}.${name}: ${docs.join(' ')}`,
        notificationTypes.danger
      )
    } else {
      showNotification(
        `[ERR] ${dispatchError.toString()}`,
        notificationTypes.danger
      )
    }

    this.isLoading = false
  }

  protected getUrl(): string {
    return urlBuilderTransaction(
      this.transactionValue,
      this.$store.getters['explorer/getCurrentChain'],
      'statescan'
    )
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

  @Watch('accountId', { immediate: true })
  hasAccount(value: string, oldVal: string): void {
    if (shouldUpdate(value, oldVal)) {
      this.loadBalance()
    }
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

  async loadBalance() {
    if (!this.accountId || !this.unit) {
      return
    }

    await new Promise((a) => setTimeout(a, 1000))
    const { api } = Connector.getInstance()

    try {
      const cb = api.query.system.account
      const arg = this.accountId
      const result = await cb(arg)
      this.balance = (result as any).data.free.toString()
    } catch (e) {
      console.error('[ERR: BALANCE]', e)
    }
  }

  private toast(message: string): void {
    this.$buefy.toast.open(message)
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables';
.info {
  display: flex;
  align-items: center;
  &--currentPrice {
    margin-bottom: 1.5rem;
    margin-left: 1.5rem;
    color: $primary;
    font-size: 1.5rem;
    font-weight: 600;
  }
}
.tx {
  margin-left: 1rem;
}
.tweetBtn {
  margin-top: 0.5rem;
}
.box {
  &--container {
    display: flex;
    @media screen and (max-width: 1023px) {
      flex-direction: column;
    }
  }
  &--target-info {
    margin-bottom: 0.8rem;
    &--url {
      font-weight: bold;
    }
  }
}
.linkartist {
  padding-left: 1.25rem;
  display: flex;
  align-items: center;
  &--icon {
    margin-right: 0.5rem;
  }
}
</style>
