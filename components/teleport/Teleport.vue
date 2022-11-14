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

    <b-field class="" label-position="inside" label="Input recipient address">
      <b-input v-model="toAddress" expanded></b-input>
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
      <b-input v-model="amount" expanded></b-input>
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

    if (!this.fromChain || !this.toChain || this.fromChain == this.toChain) {
      this.$notify({
        title: 'Error',
        text: 'You probably did not asign parachains correctly.',
        type: 'error',
        duration: 3000,
        speed: 100,
      })
    } else {
      if (this.toAddress == '') {
        this.$notify({
          title: 'Error',
          text: 'You need to input recipient first.',
          type: 'error',
          duration: 3000,
          speed: 100,
        })
      } else {
        if (this.amount < 0.0001) {
          this.$notify({
            title: 'Error',
            text: 'Specified amount is less than required 0.0001.',
            type: 'error',
            duration: 3000,
            speed: 100,
          })
        } else {
          let counter = 0

          //If injected wallet is logged in

          const injector = await web3FromAddress(address)

          if (this.fromChain == 'Kusama') {
            const wsProvider = new WsProvider(
              'wss://public-rpc.pinknode.io/kusama'
            )
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
              ({ status, txHash }) => {
                if (counter == 0) {
                  this.$notify({
                    text: `Transaction hash is ${txHash.toHex()}`,
                    duration: 10000,
                    speed: 100,
                  })
                  counter++
                }
                if (status.isFinalized) {
                  this.$notify({
                    text: `Transaction finalized at blockHash ${status.asFinalized}`,
                    type: 'success',
                    duration: 10000,
                    speed: 100,
                  })
                }
              }
            )
          } else if (this.fromChain == 'Basilisk') {
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
              ({ status, txHash }) => {
                if (counter == 0) {
                  this.$notify({
                    text: `Transaction hash is ${txHash.toHex()}`,
                    duration: 10000,
                    speed: 100,
                  })
                  counter++
                }
                if (status.isFinalized) {
                  this.$notify({
                    text: `Transaction finalized at blockHash ${status.asFinalized}`,
                    type: 'success',
                    duration: 10000,
                    speed: 100,
                  })
                }
              }
            )
          }
        }
      }
    }
  }
}
</script>
