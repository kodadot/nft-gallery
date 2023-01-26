<template>
  <div class="wallet-menu-item">
    <b-button
      size="is-medium"
      :icon-right="walletIcon"
      expanded
      class="px-5 my-0 is-flex is-justify-content-space-between is-align-items-center"
      @click="onClickWallet(wallet)">
      <b-image
        :src="wallet.img"
        class="is-32x32 is-inline-block"
        style="vertical-align: middle"></b-image>
      <span class="is-size-6 ml-2">{{ wallet.name }}</span>
    </b-button>

    <div v-if="walletAccounts.length && showAccountList" class="account-list">
      <div
        v-for="option in walletAccounts"
        :key="option.address"
        class="mx-5 py-1 account-item">
        <a
          class="pl-5 is-flex is-align-items-center"
          :value="option.address"
          @click="emitAccountChange(option.address)">
          <Avatar
            :size="33"
            :value="option.address"
            class="mr-2 image-outline" />
          <div class="is-flex is-flex-direction-column">
            <span class="has-text-grey is-size-7">{{ option.name }}</span>
            <div>
              {{ shortAddress(option.address, 6, -3) }}
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SupportedWallets, WalletAccount } from '@/utils/config/wallets'
import { BaseDotsamaWallet } from '@/utils/config/wallets/BaseDotsamaWallet'
import shouldUpdate from '@/utils/shouldUpdate'
import { formatAddress } from '@/utils/account'
import shortAddress from '@/utils/shortAddress'

const props = defineProps<{
  wallet: BaseDotsamaWallet
}>()

const { wallet } = props
const installed = wallet.installed

const { chainProperties } = useChain()
const { $store, $consola } = useNuxtApp()
const hasWalletProviderExtension = ref(false)
const walletAccounts = ref<WalletAccount[]>([])
const account = ref<string>($store.getters.getAuthAddress)
const showAccountList = ref(false)
const emit = defineEmits(['setWallet', 'setAccount'])

const walletIcon = computed(() =>
  installed
    ? showAccountList.value
      ? 'chevron-down'
      : 'chevron-right'
    : 'download'
)
const emitAccountChange = (address: string): void => {
  emit('setAccount', address)
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

const setWallet = (wallet: BaseDotsamaWallet): void => {
  emit('setWallet', wallet)
  // web3 wallet connect logic here & show accountSelect, async or not?
  wallet.enable()

  // init account
  wallet
    .getAccounts()
    .then((data) => {
      walletAccounts.value = data ? data.map(formatAccount) : []
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
