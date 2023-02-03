<template>
  <section class="is-flex is-justify-content-center">
    <div class="teleport-container">
      <Loader v-model="isLoading" />
      <p class="is-size-3 has-text-weight-bold">Teleport</p>
      <div class="mb-5">
        <h1 class="has-text-weight-bold">From</h1>
        <TeleportTabs
          :tabs="fromTabs"
          :value="fromChain"
          @select="onFromChainChange" />
      </div>

      <div
        class="mb-5 is-flex is-justify-content-space-between is-align-items-center input-wrapper">
        <input
          v-model="amount"
          class="transfer-amount is-flex is-align-items-center"
          type="number"
          placeholder="type your amount"
          :min="0" />
        <div
          class="token is-flex is-align-items-center is-justify-content-center">
          KSM
        </div>
      </div>

      <div class="mb-5">
        <h1 class="has-text-weight-bold">To</h1>
        <TeleportTabs
          :tabs="fromTabs"
          :value="toChain"
          @select="onToChainChange" />
      </div>

      <div class="mb-5">
        You will receive {{ amount || 0 }} KSM on {{ toChain }} to
        <span class="has-text-info">{{ shortAddress(toAddress) }}</span>
      </div>

      <NeoButton
        label="send"
        size="large"
        class="is-size-6 submit-button"
        :loading="isLoading"
        variant="k-accent"
        @click.native="sendXCM" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ApiPromise, WsProvider } from '@polkadot/api'
import { web3Enable } from '@polkadot/extension-dapp'
import '@polkadot/api-augment'
import { toDefaultAddress } from '@/utils/account'
import { getAddress } from '@/utils/extension'
import { Chain, chainToPrefixMap } from '@/utils/teleport'
import { notificationTypes, showNotification } from '@/utils/notification'
import useAuth from '@/composables/useAuth'
import Loader from '@/components/shared/Loader.vue'
import * as paraspell from '@paraspell/sdk'

import { txCb } from '@/utils/transactionExecutor'
import TeleportTabs from './TeleportTabs'
import { NeoButton } from '@kodadot1/brick'
import { getss58AddressByPrefix } from '@/utils/account'

const { accountId } = useAuth()
const { assets } = usePrefix()
const chains = ref([Chain.KUSAMA, Chain.BASILISK])
const fromChain = ref(Chain.KUSAMA) //Selected origin parachain
const toChain = ref(Chain.BASILISK) //Selected destination parachain
const amount = ref() //Required amount to be transfered is stored here

const currency = ref('KSM') //Selected currency is stored here
const isLoading = ref(false)
import shortAddress from '@/utils/shortAddress'

const resetStatus = () => {
  amount.value = undefined
  isLoading.value = false
}

const fromTabs = [
  {
    label: Chain.KUSAMA,
    value: Chain.KUSAMA,
  },
  {
    label: Chain.BASILISK,
    value: Chain.BASILISK,
  },
]

const getAnotherOption = (val) => {
  return chains.value.find((chain) => chain !== val) || Chain.KUSAMA
}
const onFromChainChange = (val) => {
  fromChain.value = val
  toChain.value = getAnotherOption(val)
}

const onToChainChange = (val) => {
  toChain.value = val
  fromChain.value = getAnotherOption(val)
}
const getAddressByChain = (chain) => {
  return getss58AddressByPrefix(accountId.value, chainToPrefixMap[chain])
}
const fromAddress = computed(() => getAddressByChain(fromChain.value))
const toAddress = computed(() => getAddressByChain(toChain.value))

//Used to create XCM transfer
const sendXCM = async () => {
  if (!amount.value || amount.value < 0) {
    return
  }
  await web3Enable('Kodadot')
  let isFirstStatus = true
  isLoading.value = true
  const amountValue = 10 ** assets(5).decimals * amount.value
  const transactionHandler = txCb(
    (blockHash) => {
      showNotification(
        `Transaction finalized at blockHash ${blockHash}`,
        notificationTypes.success
      )
      resetStatus()
    },
    (dispatchError) => {
      showNotification(dispatchError.toString(), notificationTypes.danger)
      isLoading.value = false
    },
    ({ txHash }) => {
      if (isFirstStatus) {
        showNotification(
          `Transaction hash is ${txHash.toHex()}`,
          notificationTypes.info
        )
        isFirstStatus = false
      }
    }
  )

  const errorHandler = () => {
    showNotification('Cancelled', notificationTypes.warn)
    isLoading.value = false
  }

  const injector = await getAddress(toDefaultAddress(fromAddress.value))

  if (fromChain.value === Chain.KUSAMA) {
    const wsProvider = new WsProvider('wss://public-rpc.pinknode.io/kusama')
    const apiKusama = await ApiPromise.create({ provider: wsProvider })

    const promise = paraspell.xcmPallet.transferRelayToPara(
      apiKusama,
      Chain.BASILISK,
      amountValue,
      toAddress.value
    )

    promise
      .signAndSend(
        fromAddress.value,
        { signer: injector.signer },
        transactionHandler
      )
      .catch(errorHandler)
  } else if (fromChain.value === Chain.BASILISK) {
    const wsProvider = new WsProvider('wss://rpc.basilisk.cloud')
    const apiBasilisk = await ApiPromise.create({ provider: wsProvider })

    const promise = paraspell.xcmPallet.send(
      apiBasilisk,
      Chain.BASILISK,
      currency.value,
      1,
      amountValue,
      toAddress.value
    )

    promise
      .signAndSend(
        fromAddress.value,
        { signer: injector.signer },
        transactionHandler
      )
      .catch(errorHandler)
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/abstracts/variables.scss';
.teleport-container {
  max-width: 30rem;

  .submit-button {
    width: 100%;
    height: 3.5rem;
  }
}

.input-wrapper {
  border: 1px solid $black;
  .token {
    width: 16rem;
  }
  .transfer-amount {
    border: none;
    border-right: 1px solid black;
    padding: 0 0.5rem;
    height: 54px;
    outline: none;
    width: 100%;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none !important;
    }
  }
}
.dark-mode {
  .input-wrapper {
    border-color: $white;
  }
}
</style>
