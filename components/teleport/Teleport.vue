<template>
  <section>
    <b-field class="" label-position="inside" label="Select origin parachain">
      <b-select
        v-model="fromChain"
        expanded
        placeholder="Select parachain 1"
        required>
        <option v-for="chain in chains" :key="chain">{{ chain }}</option>
      </b-select>
    </b-field>

    <b-field
      class=""
      label-position="inside"
      label="Select destination parachain">
      <b-select
        v-model="toChain"
        disabled
        expanded
        placeholder="Select parachain 2"
        required>
        <option v-for="chain in chains" :key="chain">{{ chain }}</option>
      </b-select>
    </b-field>

    <b-field
      class=""
      label-position="inside"
      :label="`Input recipient address (${toChain})`">
      <b-input v-model="toAddress" expanded required></b-input>
    </b-field>

    <b-field class="" label-position="inside" label="Select currency">
      <b-select
        v-model="currency"
        expanded
        placeholder="Select currency"
        required>
        <option v-for="currency in currencies" :key="currency">
          {{ currency }}
        </option>
      </b-select>
    </b-field>

    <b-field class="" label-position="inside" label="Input currency amount">
      <b-input v-model="amount" expanded type="number" :min="0.0001"></b-input>
    </b-field>

    <b-button
      class="button"
      expanded
      type="is-primary"
      label="Send transaction"
      pack="fas"
      icon-right="file-import"
      @click="sendXCM(accountId)" />
  </section>
</template>

<script lang="ts">
import { ApiPromise, WsProvider } from '@polkadot/api'
import { web3Enable, web3FromAddress } from '@polkadot/extension-dapp'
import { Component, Watch, mixins } from 'nuxt-property-decorator'
import '@polkadot/api-augment'
import * as xTokens from '@paraspell/sdk'

import { notificationTypes, showNotification } from '@/utils/notification'

import AuthMixin from '@/utils/mixins/authMixin'
enum Chain {
  KUSAMA = 'Kusama',
  BASILISK = 'Basilisk',
}
const ChainIdMap = {
  [Chain.KUSAMA]: 2000,
  [Chain.BASILISK]: 2090,
}
@Component({
  components: {
    Loader: () => import('@/components/shared/Loader.vue'),
  },
})
export default class Teleport extends mixins(AuthMixin) {
  chains: Chain[] = [Chain.KUSAMA, Chain.BASILISK] //Stores Parachains connected to Relay chain
  fromChain = Chain.KUSAMA //Selected origin parachain
  toChain = Chain.BASILISK //Selected destination parachain
  toAddress = '' //Recipient address is stored here
  amount = 0 //Required amount to be transfered is stored here
  currency = 'KSM' //Selected currency is stored here
  currencies: string[] = ['KSM'] //Currently available currencies

  resetStatus = () => {
    this.amount = 0
  }

  $notify(config: any) {
    const isError = config.type === 'error'
    showNotification(
      config.text,
      isError ? notificationTypes.danger : notificationTypes.success
    )
  }

  @Watch('fromChain')
  onFromChainChange() {
    const idx = this.chains.indexOf(this.toChain)
    this.toChain = this.chains[(idx + 1) % this.chains.length]
  }

  //Used to create XCM transfer
  async sendXCM(address: string) {
    await web3Enable('Kodadot')

    let isFirstStatus = true

    const transactionHandler = ({ status, txHash }) => {
      if (isFirstStatus) {
        showNotification(
          `Transaction hash is ${txHash.toHex()}`,
          notificationTypes.info
        )
        isFirstStatus = false
      }
      if (status.isFinalized) {
        showNotification(
          `Transaction finalized at blockHash ${status.asFinalized}`,
          notificationTypes.success
        )
      }
    }

    const injector = await web3FromAddress(address)

    if (this.fromChain === Chain.KUSAMA) {
      const wsProvider = new WsProvider('wss://public-rpc.pinknode.io/kusama')
      const api = await ApiPromise.create({ provider: wsProvider })

      //API call for XCM transfer from Acala to destination Parachain /w injected wallet
      let promise = xTokens.xTokens.transferRelayToPara(
        api,
        ChainIdMap[Chain.BASILISK],
        this.amount * 1e12,
        this.toAddress
      )
      promise.signAndSend(
        address,
        { signer: injector.signer },
        transactionHandler
      )
    } else if (this.fromChain === Chain.BASILISK) {
      const wsProvider = new WsProvider('wss://rpc.basilisk.cloud')
      const api = await ApiPromise.create({ provider: wsProvider })
      //API call for XCM transfer from Pichiu to destination Parachain /w injected wallet
      let promise = xTokens.xTokens.transferParaToPara(
        api,
        Chain.BASILISK,
        ChainIdMap[Chain.KUSAMA],
        this.currency,
        this.amount * 1e12,
        this.toAddress
      )
      promise.signAndSend(
        address,
        { signer: injector.signer },
        transactionHandler
      )
    }
  }
}
</script>
