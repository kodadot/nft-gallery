<template>
  <div class="is-flex is-align-items-center is-justify-content-space-between">
    <IdentityItem
      :account="account"
      :label="display || shortenedAddress"
      :prefix="urlPrefix"
      variant="button" />
    <div class="is-flex is-flex-direction-column">
      <a v-clipboard:copy="account" @click="toast('Copied to clipboard')">
        <NeoIcon icon="copy" />
      </a>
      <hr class="my-1" />
      <a @click="logout()">
        <NeoIcon icon="right-from-bracket" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
import { useIdentityStore } from '@/stores/identity'
import { useShoppingCartStore } from '@/stores/shoppingCart'
import { useWalletStore, walletHistory } from '@/stores/wallet'

const identityStore = useIdentityStore()
const shoppingCartStore = useShoppingCartStore()
const walletStore = useWalletStore()
const { urlPrefix } = usePrefix()
const { toast } = useToast()

const account = computed(() => identityStore.getAuthAddress)

const { display, shortenedAddress } = useIdentity({
  address: account,
})

const logout = () => {
  identityStore.resetAuth()
  sessionStorage.clear()
  process.client && localStorage.clear()
  shoppingCartStore.clear()

  walletHistory.value = walletStore.history
}
</script>
