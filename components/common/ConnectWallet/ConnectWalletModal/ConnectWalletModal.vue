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
      <WalletTabs v-model="selectedTab" />

      <ConnectWalletModalSubstrate
        v-if="selectedTab === 'SUB'"
        @select="setAccount" />

      <ConnectWalletModalEvm v-else class="!px-7" @select="setAccount" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { NeoModalHead } from '@kodadot1/brick'
import WalletAsset from '@/components/common/ConnectWallet/WalletAsset.vue'
import { ModalCloseType } from '@/components/navbar/types'
import ConnectWalletModalEvm from './Evm.vue'
import ConnectWalletModalSubstrate from './Substrate.vue'
import WalletTabs from './WalletTabs.vue'
import { ChainVM } from '@kodadot1/static'

const emit = defineEmits(['close', 'connect'])

const { urlPrefix } = usePrefix()
const { selected: account } = storeToRefs(useWalletStore())
const identityStore = useIdentityStore()

const selectedTab = ref<ChainVM>('SUB')

const showAccount = computed(() => Boolean(account.value))

const setAccount = (account: Auth) => {
  identityStore.setAuth(account)
  emit('connect', account)
}

watch(account, (account) => {
  setAccount({ address: account })
})

watch([urlPrefix], () => {
  emit('close', ModalCloseType.NAVIGATION)
})
</script>
