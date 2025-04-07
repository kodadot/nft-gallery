<template>
  <section class="modal-card-body">
    <div class="buttons m-0">
      <WalletMenuItem
        v-for="(wallet, index) in installedWallet"
        :key="index"
        :wallet="wallet"
        @set-account="setAccount"
      />
    </div>

    <div
      v-if="showUninstalledWallet"
      class="px-8! pt-6!"
    >
      <div class="font-bold capitalize mb-3 text-xl">
        {{ $t('walletConnect.newToKoda') }}
      </div>
      <div class="text-sm mb-6!">
        {{ $t('walletConnect.startConnect') }}
      </div>
      <div class="border py-4 px-6! mb-6! bg-k-grey-light border-k-grey">
        <div class="mb-3">
          {{ $t('walletConnect.quickSteps') }}
        </div>
        <ol class="text-sm font-bold pl-4">
          <li class="mb-3">
            {{ $t('walletConnect.chooseWallet')
            }}<span class="font-normal">{{
              $t('walletConnect.chooseBelow')
            }}</span>
          </li>
          <li>
            {{ $t('walletConnect.downloadAndConnect')
            }}<span class="font-normal">{{
              $t('walletConnect.setUpConnect')
            }}</span>
          </li>
        </ol>
      </div>
      <div class="font-bold mb-3 capitalize">
        {{ $t('walletConnect.selectWallet') }}
      </div>
    </div>

    <a
      v-else
      class="flex items-center pt-4 pb-3 text-xs text-k-grey mx-6 my-0 hover:text-k-hover-grey border-t border-k-shade2"
      @click="toggleShowUninstalledWallet"
    >
      {{ $t('walletConnect.moreOption') }}
      <KIcon
        v-if="isUninstalledWalletExpand"
        class="ml-1"
        name="i-mdi:chevron-down"
      />

      <KIcon
        v-else
        class="ml-1"
        name="i-mdi:chevron-right"
      />
    </a>
    <div
      v-if="showUninstalledWallet || isUninstalledWalletExpand"
      class="buttons"
    >
      <WalletMenuItem
        v-for="wallet in uninstalledWallet"
        :key="wallet.name"
        :wallet="wallet"
      />
    </div>

    <div
      v-if="showUninstalledWallet"
      class="px-6"
    >
      <hr class="my-0!">
      <NeoButton
        class="w-full! my-6!"
        variant="outlined-rounded"
        @click="checkWallet"
      >
        <div class="flex items-center justify-center gap-2">
          <span>{{ $t('walletConnect.walletHeading') }}</span>
          <KIcon name="i-mdi:arrow-right" />
        </div>
      </NeoButton>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
import WalletMenuItem from '@/components/common/ConnectWallet/WalletMenuItem.vue'
import type { BaseDotsamaWallet } from '@/utils/config/wallets/BaseDotsamaWallet'
import type {
  WalletAccount as SubstrateWalletAccount } from '@/utils/config/wallets'
import {
  SupportedWallets,
} from '@/utils/config/wallets'

const emits = defineEmits(['select'])

const { toast } = useToast()

const forceWalletSelect = ref(false)
const wallets = ref<BaseDotsamaWallet[]>([])

const uninstalledWallet = computed(() => {
  return wallets.value.filter(wallet => !wallet.installed)
})

const showUninstalledWallet = computed(() => !installedWallet.value.length)

const installedWallet = computed(() => {
  return wallets.value.filter(wallet => wallet.installed)
})

const setAccount = (account: SubstrateWalletAccount) => {
  forceWalletSelect.value = false
  emits('select', {
    account: {
      address: account.address,
      extension: account.source,
      name: account.name,
      vm: 'SUB',
    } as WalletAccount,
  })
}

const refreshWallets = () => {
  wallets.value = SupportedWallets()
}

const checkWallet = () => {
  refreshWallets()
  if (showUninstalledWallet.value) {
    toast('Please download a wallet first')
  }
}

const isUninstalledWalletExpand = ref(!showUninstalledWallet.value)
const toggleShowUninstalledWallet = () => {
  isUninstalledWalletExpand.value = !isUninstalledWalletExpand.value
}

onMounted(refreshWallets)
</script>
