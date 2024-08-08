<template>
  <div
    class="wallet-modal-container flex flex-col"
    data-testid="wallet-connect-sidebar-modal"
  >
    <NeoModalHead
      :title="
        showAccount ? $t('profile.page') : $t('walletConnect.walletHeading')
      "
      @close="emit('close', ModalCloseType.BACK)"
    />

    <section v-if="showAccount">
      <WalletAsset />
    </section>

    <template v-else>
      <div
        v-if="disconnecting"
        class="flex items-start justify-center pt-10 h-full"
      >
        <span class="text-k-grey inline-flex gap-1">
          {{ $t('disconnecting') }}
          <div class="dots w-2" />
        </span>
      </div>

      <template v-else>
        <WalletTabs
          v-model="selectedTab"
          :preselected="preselected"
        />

        <ConnectSubstrate
          v-if="selectedTab === 'SUB'"
          @select="setAccount"
        />

        <ConnectEvm
          v-else
          class="!px-7"
          :preselected="preselected"
          @select="setAccount"
        />
      </template>

      <MnemonicNotice />
    </template>
  </div>
</template>

<script setup lang="ts">
import { NeoModalHead } from '@kodadot1/brick'
import { type ChainVM, DEFAULT_VM_PREFIX } from '@kodadot1/static'
import WalletAsset from '@/components/common/ConnectWallet/WalletAsset.vue'
import { ModalCloseType } from '@/components/navbar/types'

const emit = defineEmits(['close', 'connect'])
const props = defineProps<{ preselected?: ChainVM }>()

const { urlPrefix, setUrlPrefix } = usePrefix()
const { redirectAfterChainChange } = useChainRedirect()
const walletStore = useWalletStore()
const { selected: account, disconnecting } = storeToRefs(walletStore)
const identityStore = useIdentityStore()

const selectedTab = ref<ChainVM>(props.preselected ?? 'SUB')

const showAccount = computed(() => Boolean(account.value))

const isCurrentPrefixAvailableForVm = (vm: ChainVM) =>
  getAvailableChainsByVM(vm)
    .map(({ value }) => value)
    .includes(urlPrefix.value)

const setAccount = (account: WalletAccount) => {
  walletStore.setWallet(account)
  identityStore.setAuth({ address: account.address })

  if (!isCurrentPrefixAvailableForVm(account.vm)) {
    const newChain = DEFAULT_VM_PREFIX[account.vm]
    setUrlPrefix(newChain)
    redirectAfterChainChange(newChain)
  }

  emit('connect', account)
}

onMounted(() => walletStore.setDisconnecting(false))

watch([urlPrefix], () => {
  emit('close', ModalCloseType.NAVIGATION)
})
</script>
