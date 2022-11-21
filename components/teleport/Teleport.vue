<template>
  <section>
    <Loader v-model="isLoading" />
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
      <b-input
        v-model="amount"
        expanded
        type="number"
        :min="0.0001"
        :step="0.0001"></b-input>
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

<script setup lang="ts">
import { ApiPromise, WsProvider } from '@polkadot/api'
import { web3Enable } from '@polkadot/extension-dapp'
import '@polkadot/api-augment'
import * as xTokens from '@paraspell/sdk'
import { toDefaultAddress } from '@/utils/account'
import { getAddress } from '@/utils/extension'
import { Chain, ChainIdMap } from '@/utils/teleport'
import { notificationTypes, showNotification } from '@/utils/notification'
import useAuth from '@/composables/useAuth'
import Loader from '@/components/shared/Loader.vue'

const { accountId } = useAuth()

const chains = ref([Chain.KUSAMA, Chain.BASILISK])
const fromChain = ref(Chain.KUSAMA) //Selected origin parachain
const toChain = ref(Chain.BASILISK) //Selected destination parachain
const toAddress = ref('') //Recipient address is stored here
const amount = ref(0) //Required amount to be transfered is stored here
const currency = ref('KSM') //Selected currency is stored here
const currencies = ref(['KSM']) //Currently available currencies
const isLoading = ref(false)

const resetStatus = () => {
  amount.value = 0
  isLoading.value = false
}

watch([fromChain], async () => {
  const idx = chains.value.indexOf(toChain.value)
  toChain.value = chains.value[(idx + 1) % chains.value.length]
})

//Used to create XCM transfer
const sendXCM = async (address: string) => {
  await web3Enable('Kodadot')
  let isFirstStatus = true
  isLoading.value = true
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
      resetStatus()
    }
  }

  const injector = await getAddress(toDefaultAddress(address))

  if (fromChain.value === Chain.KUSAMA) {
    const wsProvider = new WsProvider('wss://public-rpc.pinknode.io/kusama')
    const api = await ApiPromise.create({ provider: wsProvider })
    //API call for XCM transfer from Acala to destination Parachain /w injected wallet
    let promise = xTokens.xTokens.transferRelayToPara(
      api,
      ChainIdMap[Chain.BASILISK],
      amount.value * 1e12,
      toAddress.value
    )
    promise.signAndSend(
      address,
      { signer: injector.signer },
      transactionHandler
    )
  } else if (fromChain.value === Chain.BASILISK) {
    const wsProvider = new WsProvider('wss://rpc.basilisk.cloud')
    const api = await ApiPromise.create({ provider: wsProvider })

    let promise = api.tx.xTokens.transfer(
      1,
      amount.value * 1e12,
      {
        V1: {
          parents: 1,
          interior: {
            X1: {
              AccountId32: {
                id: api.createType('AccountId32', toAddress.value).toHex(),
                network: 'Any',
              },
            },
          },
        },
      },
      5000000000
    )

    promise.signAndSend(
      address,
      { signer: injector.signer },
      transactionHandler
    )
  }
}
</script>
