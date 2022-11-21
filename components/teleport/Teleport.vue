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
import { toDefaultAddress } from '@/utils/account'
import { getAddress } from '@/utils/extension'
import { Chain, ChainIdMap } from '@/utils/teleport'
import { notificationTypes, showNotification } from '@/utils/notification'
import useAuth from '@/composables/useAuth'
import Loader from '@/components/shared/Loader.vue'
import * as paraspell from '@paraspell/sdk'

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

  const errorHandler = () => {
    showNotification('Cancelled', notificationTypes.warn)
    isLoading.value = false
  }

  const injector = await getAddress(toDefaultAddress(address))

  if (fromChain.value === Chain.KUSAMA) {
    const wsProvider = new WsProvider('wss://public-rpc.pinknode.io/kusama')
    const apiKusama = await ApiPromise.create({ provider: wsProvider })

    const promise = paraspell.xTokens.transferRelayToPara(
      apiKusama,
      ChainIdMap[Chain.BASILISK],
      amount.value * 1e12,
      toAddress.value
    )

    promise
      .signAndSend(address, { signer: injector.signer }, transactionHandler)
      .catch(errorHandler)
  } else if (fromChain.value === Chain.BASILISK) {
    const wsProvider = new WsProvider('wss://rpc.basilisk.cloud')
    const apiBasilisk = await ApiPromise.create({ provider: wsProvider })

    const promise = paraspell.xTokens.transferParaToRelay(
      apiBasilisk,
      Chain.BASILISK,
      currency.value,
      1,
      amount.value * 1e12,
      toAddress.value
    )

    promise
      .signAndSend(address, { signer: injector.signer }, transactionHandler)
      .catch(errorHandler)
  }
}
</script>
