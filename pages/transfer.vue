<template>
  <section>
    <Loader v-model="isLoading" :status="status" />
    <nuxt-link
      v-if="$route.query.target"
      :to="`/${urlPrefix}/u/${correctAddress}`"
      class="pl-4 is-flex is-align-items-center">
      <b-icon icon="chevron-left" size="is-small" class="mr-2" />
      {{ $t('teleport.artistProfile') }}
    </nuxt-link>
    <p class="title is-size-3">
      {{ $t('transfer') }} {{ unit }}
      <span v-if="isKSM" class="has-text-primary"
        >${{ fiatStore.getCurrentKSMValue }}</span
      >
    </p>

    <b-field>
      <Auth />
    </b-field>

    <div v-if="targets && hasBlockExplorer" class="mb-3">
      {{ $t('teleport.donationSentTo') }}
      <a
        v-for="target in targets"
        :key="target"
        :href="addressExplorerUrl(target)"
        target="_blank"
        rel="noopener noreferrer"
        class="has-text-weight-bold">
        <Identity ref="identity" :address="target" show-onchain-identity />
      </a>
    </div>

    <div class="is-flex is-align-items-center">
      <b-field>
        {{ $t('general.balance') }}
        <Money :value="balance" inline />
      </b-field>
    </div>

    <div
      v-for="(destinationAddress, index) in destinationAddresses"
      :key="destinationAddress">
      <div class="is-flex">
        <b-field class="is-flex-grow-1">
          <AddressInput v-model="destinationAddresses[index]" :strict="false" />
        </b-field>
        <b-button
          v-show="index == destinationAddresses.length - 1"
          type="is-primary"
          size="is-small"
          icon-left="plus"
          class="ml-2 mt-2"
          outlined
          @click="addAddress">
          Add
        </b-button>
      </div>

      <DisabledInput
        v-show="
          correctAddress(destinationAddress) &&
          correctAddress(destinationAddress) !== destinationAddress
        "
        :label="$t('general.correctAddress')"
        :value="correctAddress(destinationAddress)" />
    </div>
    <div class="container mb-3">
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
        v-if="transactionValue && hasBlockExplorer"
        type="is-success"
        class="ml-4"
        icon-left="external-link-alt"
        outlined
        @click="getExplorerUrl">
        {{ $t('View Transaction') }} {{ transactionValue.substring(0, 6)
        }}{{ '...' }}
      </b-button>
      <b-button
        v-if="transactionValue && hasBlockExplorer"
        v-clipboard:copy="getUrl()"
        type="is-primary"
        @click="toast($t('toast.urlCopy'))">
        <b-icon size="is-small" pack="fas" icon="link" />
      </b-button>
      <b-button
        v-if="hasAddress"
        v-clipboard:copy="generatePaymentLink()"
        type="is-success"
        icon-left="money-bill"
        :loading="isLoading"
        outlined
        @click="toast($t('toast.paymentLinkCopy'))">
        {{ $t('Copy Payment link') }}
      </b-button>
      <b-button
        v-if="accountId"
        v-clipboard:copy="generatePaymentLink(accountId)"
        type="is-info"
        icon-left="wallet"
        :loading="isLoading"
        outlined
        @click="toast($t('general.copyRewardTooltip'))">
        {{ $t('general.copyRewardLink') }}
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
import Connector, { onApiConnect } from '@kodadot1/sub-api'
import { encodeAddress, isAddress } from '@polkadot/util-crypto'
import { DispatchError } from '@polkadot/types/interfaces'

import { calculateKsmFromUsd, calculateUsdFromKsm } from '@/utils/calculation'
import exec, { execResultValue, txCb } from '@/utils/transactionExecutor'
import { notificationTypes, showNotification } from '@/utils/notification'
import { calculateBalance } from '@/utils/format/balance'
import correctFormat from '@/utils/ss58Format'
import { urlBuilderTransaction } from '@/utils/explorerGuide'

import AuthMixin from '@/utils/mixins/authMixin'
import ChainMixin from '@/utils/mixins/chainMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import TransactionMixin from '@/utils/mixins/txMixin'
import UseApiMixin from '@/utils/mixins/useApiMixin'
import { useFiatStore } from '@/stores/fiat'

import { getExplorer, hasExplorer } from '@kodadot1/static'
import { emptyObject } from '@kodadot1/minimark'

type Target = 'target' | `target${number}`
type TargetMap = Record<Target, string>

@Component({
  components: {
    Auth: () => import('@/components/shared/Auth.vue'),
    BalanceInput: () => import('@/components/shared/BalanceInput.vue'),
    ReadOnlyBalanceInput: () =>
      import('@/components/shared/ReadOnlyBalanceInput.vue'),
    Identity: () => import('@/components/identity/IdentityIndex.vue'),
    Loader: () => import('@/components/shared/Loader.vue'),
    AddressInput: () => import('@/components/shared/AddressInput.vue'),
    Money: () => import('@/components/shared/format/Money.vue'),
    DisabledInput: () => import('@/components/shared/DisabledInput.vue'),
  },
})
export default class Transfer extends mixins(
  TransactionMixin,
  AuthMixin,
  ChainMixin,
  PrefixMixin,
  UseApiMixin
) {
  protected destinationAddresses = ['']
  protected transactionValue = ''
  protected price = 0
  protected usdValue = 0
  protected targets = emptyObject<TargetMap>()

  layout() {
    return 'centered-half-layout'
  }

  get fiatStore() {
    return useFiatStore()
  }

  get isApiConnected() {
    return this.$store.getters.getApiConnected
  }
  get disabled(): boolean {
    return (
      !this.hasAddress ||
      !this.price ||
      !this.accountId ||
      !this.isApiConnected ||
      this.$nuxt.isOffline
    )
  }
  get ss58Format(): number {
    return this.chainProperties?.ss58Format
  }
  get hasAddress(): boolean {
    return Object.keys(this.targets).length > 0
  }
  correctAddress(destinationAddress): string {
    return isAddress(destinationAddress)
      ? encodeAddress(destinationAddress, correctFormat(this.ss58Format))
      : ''
  }

  get isKSM(): boolean {
    return this.unit === 'KSM'
  }

  get hasBlockExplorer(): boolean {
    return hasExplorer(this.urlPrefix)
  }

  addressExplorerUrl(address): string {
    return getExplorer(this.urlPrefix, address) || '#'
  }

  get balance(): string {
    return this.$store.getters.getAuthBalance
  }
  protected addAddress() {
    this.destinationAddresses.push('')
  }

  protected created() {
    this.fiatStore.fetchFiatPrice().then(this.checkQueryParams)
    onApiConnect(this.apiUrl, async (api) => {
      this.$store.commit('setApiConnected', api.isConnected)
    })
  }

  protected onAmountFieldChange() {
    /* calculating usd value on the basis of price entered */
    if (this.price) {
      this.usdValue = calculateUsdFromKsm(
        Number(this.fiatStore.getCurrentKSMValue),
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
        Number(this.fiatStore.getCurrentKSMValue),
        this.usdValue
      )
    } else {
      this.price = 0
    }
  }

  protected checkQueryParams() {
    const { query } = this.$route
    const targets = Object.entries(query)
      .filter(([key]) => key.startsWith('target'))
      .filter(([_, address]) => {
        if (isAddress(address as string)) {
          return true
        }
        showNotification(
          `Unable to use target address ${address}`,
          notificationTypes.warn
        )
        return false
      })
      .map(([_, address]) => address as string)
    if (targets.length > 0) {
      this.destinationAddresses = targets
    }

    if (query.amount) {
      this.price = Number(query.amount)
    }

    if (query.usdamount) {
      this.usdValue = Number(query.usdamount)

      this.price = calculateKsmFromUsd(
        Number(this.fiatStore.getCurrentKSMValue),
        this.usdValue
      )
    }
  }

  public async submit(event: any, usedNodeUrls: string[] = []): Promise<void> {
    showNotification(
      `${this.$route.query.target ? 'Sent for Sign' : 'Dispatched'}`
    )
    this.initTransactionLoader()

    try {
      const api = await this.useApi()
      const amountToTansfer = String(
        calculateBalance(this.price, this.decimals)
      )
      const numOfTargetAddresses = Object.keys(this.targets).length
      const cb =
        numOfTargetAddresses > 1
          ? api.tx.utility.batch
          : api.tx.balances.transfer
      const arg =
        numOfTargetAddresses > 1
          ? [
              Object.values(this.targets).map((target) =>
                api.tx.balances.transfer(target, amountToTansfer)
              ),
            ]
          : [this.targets['target'], amountToTansfer]

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
              `[${this.unit}] Transfered ${this.price * numOfTargetAddresses} ${
                this.unit
              } in block ${blockNumber}`,
              notificationTypes.success
            )

            this.destinationAddresses = ['']
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
    } catch (e: any) {
      if (e.message === 'Cancelled') {
        showNotification(e.message, notificationTypes.warn)
        this.isLoading = false
        return
      }
      const availableNodesByPrefix: { value: string }[] =
        this.$store.getters['availableNodesByPrefix']
      const availableUrls = availableNodesByPrefix.map((node) => node.value)
      if (usedNodeUrls.length === 0) {
        usedNodeUrls.push(this.$store.getters.getSettings['apiUrl'])
      }
      if (usedNodeUrls.length < availableUrls.length) {
        const nextTryUrls = availableUrls.filter(
          (url) => !usedNodeUrls.includes(url)
        )
        const { getInstance: Api } = Connector
        // try to connect next possible url
        await Api().connect(nextTryUrls[0])
        await this.$store.dispatch('setApiUrl', nextTryUrls[0])
        this.submit(event, [nextTryUrls[0]].concat(usedNodeUrls))
      } else {
        this.$consola.error('[ERR: TRANSFER SUBMIT]', e)
        if (e instanceof Error) {
          showNotification(e.message, notificationTypes.warn)
        }
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

  protected generatePaymentLink(address?): string {
    let addressQueryString: string
    if (address) {
      addressQueryString = `target=${address}`
    } else {
      addressQueryString = new URLSearchParams(this.targets).toString()
    }
    return `${window.location.origin}/transfer?${addressQueryString}&usdamount=${this.usdValue}&donation=true`
  }

  protected shareInTweet() {
    const text =
      'I have just helped a really cool creator by donating. Check my donation proof:'
    const url = `https://twitter.com/intent/tweet?text=${text}&via=KodaDot&url=${this.getUrl()}`
    window.open(url, '_blank')
  }

  @Watch('destinationAddresses', { deep: true })
  destinationChanged(destinationAddresses: string[]): void {
    const { usdamount } = this.$route.query
    const targets = destinationAddresses
      .filter((addr) => isAddress(addr))
      .reduce(
        (object, address, i) => ({
          ...object,
          [`target${i == 0 ? '' : i}`]: address,
        }),
        {} as TargetMap
      )
    this.targets = targets
    this.$router.replace({ query: { ...targets, usdamount } }).catch(() => null) // null to further not throw navigation errors
  }

  @Watch('usdValue')
  usdValueChanged(usdamount: string): void {
    this.$router
      .replace({ query: { ...this.$route.query, usdamount } })
      .catch(() => null) // null to further not throw navigation errors
  }

  private toast(message: string): void {
    this.$buefy.toast.open(message)
  }
}
</script>
