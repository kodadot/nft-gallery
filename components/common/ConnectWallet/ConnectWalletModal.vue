<template>
  <div
    class="wallet-modal-container flex flex-col"
    data-testid="wallet-connect-sidebar-modal">
    <NeoModalHead
      :title="
        showAccount
          ? $i18n.t('profile.page')
          : $i18n.t('walletConnect.walletHeading')
      "
      @close="emit('close', ModalCloseType.BACK)" />
    <section v-if="showAccount">
      <WalletAsset />
    </section>
    <section v-else class="modal-card-body">
      <div class="buttons m-0">
        <WalletMenuItem
          v-for="(wallet, index) in installedWallet"
          :key="index"
          :wallet="wallet"
          @set-account="setAccount" />
      </div>

      <div v-if="showUninstalledWallet" class="!px-8 !pt-6">
        <div class="font-bold capitalize mb-3 text-xl">
          {{ $i18n.t('walletConnect.newToKoda') }}
        </div>
        <div class="text-sm !mb-6">
          {{ $i18n.t('walletConnect.startConnect') }}
        </div>
        <div class="border py-4 !px-6 !mb-6 bg-k-grey-light border-k-grey">
          <div class="mb-3">{{ $i18n.t('walletConnect.quickSteps') }}</div>
          <ol class="text-sm font-bold pl-4">
            <li class="mb-3">
              {{ $i18n.t('walletConnect.chooseWallet')
              }}<span class="font-normal">{{
                $i18n.t('walletConnect.chooseBelow')
              }}</span>
            </li>
            <li>
              {{ $i18n.t('walletConnect.downloadAndConnect')
              }}<span class="font-normal">{{
                $i18n.t('walletConnect.setUpConnect')
              }}</span>
            </li>
          </ol>
        </div>
        <div class="font-bold mb-3 capitalize">
          {{ $i18n.t('walletConnect.selectWallet') }}
        </div>
      </div>

      <a
        v-else
        class="flex items-center pt-4 pb-3 text-xs text-k-grey mx-6 my-0 hover:text-k-hover-grey border-t border-k-shade2"
        @click="toggleShowUninstalledWallet">
        {{ $i18n.t('walletConnect.moreOption') }}
        <NeoIcon
          v-if="isUninstalledWalletExpand"
          class="ml-1"
          icon="chevron-down" />

        <NeoIcon v-else class="ml-1" icon="chevron-right" />
      </a>
      <div
        v-if="showUninstalledWallet || isUninstalledWalletExpand"
        class="buttons">
        <WalletMenuItem
          v-for="wallet in uninstalledWallet"
          :key="wallet.name"
          :wallet="wallet" />
      </div>

      <div v-if="showUninstalledWallet" class="px-6">
        <hr class="!my-0" />
        <NeoButton
          class="!w-full !my-6"
          variant="outlined-rounded"
          @click="checkWallet">
          {{ $t('walletConnect.walletHeading') }}
          <NeoIcon icon="arrow-right" />
        </NeoButton>
      </div>
    </section>

    <div v-if="!showAccount" class="bg-k-grey-light p-4 flex items-center mx-6">
      <NeoIcon class="ml-1" icon="circle-info" variant="k-grey" />
      <div class="text-xs text-neutral-7 ml-3">
        {{ $i18n.t('walletConnect.authText') }}
      </div>
    </div>

    <div v-if="!showAccount" class="px-6 !pb-6 pt-2">
      <a
        class="text-sm text-k-blue hover:text-k-blue-hover flex items-center flex justify-center"
        href="https://hello.kodadot.xyz/tutorial/wallet"
        target="_blank"
        rel="nofollow noopener noreferrer">
        {{ $i18n.t('walletConnect.walletLink') }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SupportedWallets } from '@/utils/config/wallets'
import { BaseDotsamaWallet } from '@/utils/config/wallets/BaseDotsamaWallet'
import { NeoButton, NeoIcon, NeoModalHead } from '@kodadot1/brick'
import { Auth, useIdentityStore } from '@/stores/identity'
import WalletMenuItem from '@/components/common/ConnectWallet/WalletMenuItem.vue'
import WalletAsset from '@/components/common/ConnectWallet/WalletAsset.vue'
import { ModalCloseType } from '@/components/navbar/types'
const { $i18n } = useNuxtApp()
const selectedWalletProvider = ref<BaseDotsamaWallet>()
const forceWalletSelect = ref(false)
const wallets = ref<BaseDotsamaWallet[]>([])
const identityStore = useIdentityStore()
const { urlPrefix } = usePrefix()
const emit = defineEmits(['close', 'connect'])
const { toast } = useToast()
const account = computed(() => identityStore.auth.address)
const showAccount = computed(() => account.value)
const installedWallet = computed(() => {
  return wallets.value.filter((wallet) => wallet.installed)
})
const uninstalledWallet = computed(() => {
  return wallets.value.filter((wallet) => !wallet.installed)
})
const showUninstalledWallet = computed(() => !installedWallet.value.length)

const refreshWallets = () => {
  wallets.value = SupportedWallets()
}

const checkWallet = () => {
  refreshWallets()
  if (showUninstalledWallet.value) {
    toast('Please download a wallet first')
  }
}

const setAccount = (account: Auth) => {
  forceWalletSelect.value = false
  identityStore.setAuth(account)
  emit('connect', account)

  if (selectedWalletProvider.value) {
    localStorage.setItem('wallet', selectedWalletProvider.value.extensionName)
  }
}

const isUninstalledWalletExpand = ref(!showUninstalledWallet.value)
const toggleShowUninstalledWallet = () => {
  isUninstalledWalletExpand.value = !isUninstalledWalletExpand.value
}

watch(account, (account) => {
  setAccount({ address: account })
})

watch([urlPrefix], () => {
  emit('close', ModalCloseType.NAVIGATION)
})

onMounted(refreshWallets)
</script>
