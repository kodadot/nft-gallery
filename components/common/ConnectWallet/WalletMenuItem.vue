<template>
  <div class="wallet-menu-item">
    <b-button
      size="is-medium"
      expanded
      class="my-0 is-flex is-justify-content-space-between is-align-items-center"
      @click="onClickWallet(wallet)">
      <div
        class="is-flex is-justify-content-space-between is-align-items-center">
        <span>
          <b-image
            :src="wallet.img"
            class="is-32x32 is-inline-block"
            style="vertical-align: middle"></b-image>
          <span class="is-size-6 ml-2 is-capitalized">{{ wallet.name }}</span>
        </span>

        <NeoIcon v-if="!wallet.installed" icon="download" />

        <NeoIcon v-else-if="showAccountList" icon="chevron-down" />

        <NeoIcon v-else icon="chevron-right" />
      </div>
    </b-button>

    <div v-if="walletAccounts.length && showAccountList" class="account-list">
      <div
        v-for="option in walletAccounts"
        :key="option.address"
        class="account-item">
        <a
          class="pl-5 is-flex is-align-items-center"
          :value="option.address"
          @click="emitAccountChange(option.address)">
          <Avatar
            :size="33"
            :value="option.address"
            class="mr-2 image-outline" />
          <div class="is-flex is-flex-direction-column">
            <span class="has-text-grey is-size-7 account-name">{{
              option.name
            }}</span>
            <div class="account-address">
              {{ shortAddress(option.address, 6, -3) }}
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { WalletAccount } from '@/utils/config/wallets'
import { BaseDotsamaWallet } from '@/utils/config/wallets/BaseDotsamaWallet'
import shouldUpdate from '@/utils/shouldUpdate'
import { formatAddress } from '@/utils/account'
import shortAddress from '@/utils/shortAddress'
import { useWalletStore } from '@/stores/wallet'
import { NeoIcon } from '@kodadot1/brick'

defineProps<{
  wallet: BaseDotsamaWallet
}>()

const { chainProperties } = useChain()
const { $consola } = useNuxtApp()
const hasWalletProviderExtension = ref(false)
const walletAccounts = ref<WalletAccount[]>([])
const showAccountList = ref(false)
const emit = defineEmits(['setWallet', 'setAccount'])
const walletStore = useWalletStore()

const emitAccountChange = (address: string): void => {
  emit('setAccount', address)
  const walletName = walletAccounts.value.find(
    (wallet) => wallet.address === address
  )?.name
  walletStore.setWalletName({ name: walletName })
}
const ss58Format = computed(() => chainProperties.value?.ss58Format)

watch(walletAccounts, (newValue) => {
  if (shouldUpdate(newValue, walletAccounts.value)) {
    walletAccounts.value = newValue
  }
})

const formatAccount = (account: WalletAccount): WalletAccount => {
  return {
    ...account,
    address: formatAddress(account.address, ss58Format.value),
  }
}

const onClickWallet = (wallet: BaseDotsamaWallet): void => {
  if (wallet.installed) {
    setWallet(wallet)
    showAccountList.value = !showAccountList.value
  } else {
    window.open(wallet.walletUrl, '_blank')
  }
}

const setWallet = async (wallet: BaseDotsamaWallet) => {
  emit('setWallet', wallet)
  // web3 wallet connect logic here & show accountSelect, async or not?
  await wallet.enable()

  // init account
  wallet
    .getAccounts()
    .then((data) => {
      walletAccounts.value = data ? data.map(formatAccount) : []
      localStorage.setItem('wallet', wallet.extensionName)
    })
    .catch((e) => {
      $consola.error('init account error', e)
    })

  // subscribe change
  wallet.subscribeAccounts((accounts) => {
    // list of supported accounts for this wallet to show in AccoutSelect
    if (accounts) {
      walletAccounts.value = accounts.map(formatAccount)
    }
  })
  hasWalletProviderExtension.value = true
  //
}
</script>
