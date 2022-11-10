<template>
  <section>
    <Loader v-model="isLoading" :can-cancel="false" />

    <b-field
      class="textt"
      label-position="inside"
      label="Select origin parachain">
      <b-select
        v-model="key"
        expanded
        placeholder="Select parachain 1"
        required>
        <option v-for="item in items" :key="item">{{ item }}</option>
      </b-select>
    </b-field>

    <b-field
      class="textt"
      label-position="inside"
      label="Select destination parachain">
      <b-select
        v-model="keyy"
        expanded
        placeholder="Select parachain 2"
        required>
        <option v-for="item in items" :key="item">{{ item }}</option>
      </b-select>
    </b-field>

    <b-field
      class="textt"
      label-position="inside"
      label="Input recipient address">
      <b-input v-model="addr" expanded @input.native="addrs($event)"></b-input>
    </b-field>

    <b-field class="textt" label-position="inside" label="Select currency">
      <b-select
        v-model="currency"
        expanded
        placeholder="Select currency"
        required
        @input.native="asignCur($event)">
        <option v-for="currency in currencies" :key="currency">
          {{ currency }}
        </option>
      </b-select>
    </b-field>

    <b-field
      class="textt"
      label-position="inside"
      label="Input currency amount">
      <b-input v-model="amount" expanded @input.native="unit($event)"></b-input>
    </b-field>

    <b-button
      class="buttonn"
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
import { Component, mixins } from 'nuxt-property-decorator'
import '@polkadot/api-augment'
import * as xTokens from '@paraspell/sdk'

import { notificationTypes, showNotification } from '@/utils/notification'

import AuthMixin from '@/utils/mixins/authMixin'

@Component({
  components: {
    Loader: () => import('@/components/shared/Loader.vue'),
  },
})
export default class TeleportBridge extends mixins(AuthMixin) {
  items: string[] = [] //Stores Parachains connected to Relay chain
  key = 'Karura' //Selected origin parachain
  keyy = 'Basilisk' //Selected destination parachain
  addr = '' //Recipient address is stored here
  amount = 0 //Required amount to be transfered is stored here
  currency = 'KSM' //Selected currency is stored here
  currencies: string[] = [] //Currently available currencies
  isLoading = true

  async mounted() {
    await web3Enable('Kodadot')

    const wsProvider = new WsProvider('wss://public-rpc.pinknode.io/kusama')
    const api = await ApiPromise.create({ provider: wsProvider })

    //API call to query Parachains connected to Relay chain
    const parachain = await api.query.paras.parachains()
    const queryPara = JSON.stringify(parachain)
    const newParas = queryPara
      .split('[')
      .join(',')
      .split(']')
      .join(',')
      .split(',')
    const results = newParas.filter((element) => {
      return element !== ''
    })
    const extractedParas = results.map((i) => Number(i))

    extractedParas.forEach((extractedPara) => {
      //Here add your new node
      switch (extractedPara) {
        case 2000:
          this.items.push('Karura')
          break
        case 2090:
          this.items.push('Basilisk')
          break
      }
    })
    console.log('jarsen parachain', parachain)

    //Currencies we can transfer in
    this.currencies.push('KSM')

    this.isLoading = false
  }

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

  //Used to store recipient address
  // eslint-disable-next-line
  async addrs(value: any) {
    this.addr = value.target.value
  }

  //Used to store selected currency
  // eslint-disable-next-line
  async asignCur(value: any) {
    this.currency = value.target.value
  }

  //Used to store user required transfer amount
  // eslint-disable-next-line
  async unit(value: any) {
    this.amount = value.target.value
  }

  //Used to create XCM transfer
  async sendXCM(address: string) {
    if (this.key == '' || this.keyy == '' || this.key == this.keyy) {
      this.$notify({
        title: 'Error',
        text: 'You probably did not asign parachains correctly.',
        type: 'error',
        duration: 3000,
        speed: 100,
      })
    } else {
      if (this.addr == '') {
        this.$notify({
          title: 'Error',
          text: 'You need to input recipient first.',
          type: 'error',
          duration: 3000,
          speed: 100,
        })
      } else {
        if (this.amount < 0.001) {
          this.$notify({
            title: 'Error',
            text: 'Specified amount is less than required 0.0001.',
            type: 'error',
            duration: 3000,
            speed: 100,
          })
        } else {
          let para = 0
          let counter = 0

          //Here add your new node
          switch (this.keyy) {
            case 'Basilisk':
              para = 2090
              break
            case 'Karura':
              para = 2000
              break
          }

          //If injected wallet is logged in

          const injector = await web3FromAddress(address)

          if (this.key == 'Karura') {
            const wsProvider = new WsProvider(
              'wss://public-rpc.pinknode.io/kusama'
            )
            const api = await ApiPromise.create({ provider: wsProvider })

            //API call for XCM transfer from Acala to destination Parachain /w injected wallet
            let promise = xTokens.xTokens.transferRelayToPara(
              api,
              2090,
              this.amount * 1e12,
              this.addr
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
          } else if (this.key == 'Basilisk') {
            // const wsProvider = new WsProvider('wss://rpc.basilisk.cloud')
            // const api = await ApiPromise.create({ provider: wsProvider })
            // //API call for XCM transfer from Pichiu to destination Parachain /w injected wallet
            // let promise = xTokens.xTokens.transferParaToPara(
            //   api,
            //   'Basilisk',
            //   para,
            //   this.currency,
            //   this.amount * 1e12,
            //   this.addr
            // )
            // promise.signAndSend(
            //   address,
            //   { signer: injector.signer },
            //   ({ status, txHash }) => {
            //     if (counter == 0) {
            //       this.$notify({
            //         text: `Transaction hash is ${txHash.toHex()}`,
            //         duration: 10000,
            //         speed: 100,
            //       })
            //       counter++
            //     }
            //     if (status.isFinalized) {
            //       this.$notify({
            //         text: `Transaction finalized at blockHash ${status.asFinalized}`,
            //         type: 'success',
            //         duration: 10000,
            //         speed: 100,
            //       })
            //     }
            //   }
            // )
          }
        }
      }
    }
  }
}
</script>
