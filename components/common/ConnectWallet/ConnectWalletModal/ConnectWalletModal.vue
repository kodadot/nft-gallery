<template>
  <div
    class="wallet-modal-container flex flex-col"
    data-testid="wallet-connect-sidebar-modal">
    <NeoModalHead
      :title="
        showAccount ? $t('profile.page') : $t('walletConnect.walletHeading')
      "
      @close="emit('close', ModalCloseType.BACK)" />

    <section v-if="showAccount">
      <WalletAsset />
    </section>

    <template v-else>
      <div
        v-if="disconnecting"
        class="flex items-start justify-center pt-10 h-full">
        <span class="text-k-grey inline-flex gap-1">
          {{ $t('disconnecting') }}
          <div class="dots w-2" />
        </span>
      </div>

      <template v-else>
        <WalletTabs v-model="selectedTab" />

        <ConnectWalletModalSubstrate
          v-if="selectedTab === 'SUB'"
          @select="setAccount" />

        <ConnectWalletModalEvm v-else class="!px-7" @select="setAccount" />
      </template>

      <ConnectWalletModalMnemonicNotice />
    </template>
  </div>
</template>

<script setup lang="ts">
import { NeoModalHead } from '@kodadot1/brick'
import WalletAsset from '@/components/common/ConnectWallet/WalletAsset.vue'
import { ModalCloseType } from '@/components/navbar/types'
import ConnectWalletModalEvm from './Evm.vue'
import ConnectWalletModalSubstrate from './Substrate.vue'
import ConnectWalletModalMnemonicNotice from './MnemonicNotice.vue'
import WalletTabs from './WalletTabs.vue'
import { type ChainVM, DEFAULT_VM_PREFIX } from '@kodadot1/static'

const emit = defineEmits(['close', 'connect'])

const { urlPrefix, setUrlPrefix } = usePrefix()
const { redirectAfterChainChange } = useChainRedirect()
const { selected: account, disconnecting } = storeToRefs(useWalletStore())
const identityStore = useIdentityStore()

const selectedTab = ref<ChainVM>('SUB')

const showAccount = computed(() => Boolean(account.value))

const setAccount = (account: Auth) => {
  identityStore.setAuth(account)

  if (
    !getAvailableChainsByVM(selectedTab.value)
      .map(({ value }) => value)
      .includes(urlPrefix.value)
  ) {
    const newChain = DEFAULT_VM_PREFIX[selectedTab.value]
    setUrlPrefix(newChain)
    redirectAfterChainChange(newChain)
  }

  emit('connect', account)
}

watch(account, (account) => {
  setAccount({ address: account })
})

watch([urlPrefix], () => {
  emit('close', ModalCloseType.NAVIGATION)
})
</script>
