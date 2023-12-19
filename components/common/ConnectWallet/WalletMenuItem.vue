<template>
  <div class="wallet-menu-item">
    <button
      class="button my-0 flex justify-between items-center"
      @click="onClickWallet(wallet)">
      <span>
        <div class="flex justify-between items-center">
          <span class="flex items-center">
            <img
              :src="wallet.img"
              :alt="wallet.extensionName"
              width="32"
              style="vertical-align: middle" />
            <span class="is-size-6 ml-2 is-capitalized">{{ wallet.name }}</span>

            <NeoTag
              v-if="isRecent(wallet)"
              class="is-capitalized ml-2"
              variant="transparent"
              size="small">
              {{ $t('recent') }}
            </NeoTag>
          </span>

          <NeoIcon v-if="!wallet.installed" icon="download" />

          <NeoIcon v-else-if="showAccountList" icon="chevron-down" />

          <NeoIcon v-else icon="chevron-right" />
        </div>
      </span>
    </button>
    <div
      v-if="isAuth && walletAccounts.length === 0"
      class="pl-5 pt-2 pb-2 flex items-center auth-tip">
      <NeoIcon icon="spinner-third" />
      <span class="has-text-grey is-size-7 pl-4">
        {{ $t('walletConnect.authTip') }}
      </span>
    </div>

    <div v-if="walletAccounts.length && showAccountList" class="account-list">
      <div
        v-for="option in walletAccounts"
        :key="option.address"
        class="account-item">
        <a
          class="pl-5 flex items-center"
          :value="option.address"
          @click="emitAccountChange(option)">
          <Avatar
            :size="33"
            :value="option.address"
            class="mr-2 image-outline" />
          <div class="flex flex-col">
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
import Avatar from '@/components/shared/Avatar.vue'
import NeoTag from '@/components/shared/gallery/NeoTag.vue'

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
const isAuth = ref(false)

const isRecent = (wallet: BaseDotsamaWallet) =>
  walletStore.getRecentWallet === wallet.source

const emitAccountChange = (account): void => {
  emit('setAccount', account)
  const wallet = walletAccounts.value.find(
    (wallet) => wallet.address === account.address,
  )

  const walletName = wallet?.name ?? ''
  const source = wallet?.source ?? ''

  walletStore.setWallet({ name: walletName, extension: source })
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
  isAuth.value = true

  await wallet.enable()
  // init account
  try {
    const data = await wallet.getAccounts()
    walletAccounts.value = data ? data.map(formatAccount) : []
    localStorage.setItem('wallet', wallet.extensionName)
  } catch (e) {
    isAuth.value = false
    $consola.error('init account error', e)
  }

  // subscribe change
  wallet.subscribeAccounts((accounts) => {
    // list of supported accounts for this wallet to show in AccoutSelect
    if (accounts) {
      walletAccounts.value = accounts.map(formatAccount)
    }
    isAuth.value = false
  })
  hasWalletProviderExtension.value = true
  //
}
</script>
