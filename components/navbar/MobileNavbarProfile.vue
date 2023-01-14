<template>
  <div class="is-flex">
    <div>
      <small class="is-small">Logged As:</small>
      <Identity
        :address="account"
        class="navbar__address is-size-6"
        hide-identity-popover />
    </div>
    <div
      class="is-flex is-flex-direction-column is-justify-content-space-between is-align-items-end">
      <ConnectWalletButton
        label="general.change_account"
        class="menu-item mb-4 is-size-7"
        variant="connect-dropdown"
        @closeBurgerMenu="closeBurgerMenu" />
      <NeoButton
        class="menu-item mb-4 is-size-7"
        :label="$t('profileMenu.disconnect')"
        variant="connect-dropdown"
        @click="disconnect()" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { clearSession } from '~/utils/cachingStrategy'
import { NeoButton } from '@kodadot1/brick'

const Identity = defineAsyncComponent(
  () => import('@/components/identity/IdentityIndex.vue')
)
const ConnectWalletButton = defineAsyncComponent(
  () => import('@/components/shared/ConnectWalletButton.vue')
)

const { $store, $emit } = useNuxtApp()
const account = $store.getters.getAuthAddress

const closeBurgerMenu = (): void => {
  $emit('closeBurgerMenu')
}
const disconnect = () => {
  $store.dispatch('setAuth', { address: '' }) // null not working
  clearSession()
}
</script>
