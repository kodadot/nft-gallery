<template>
  <div class="is-flex">
    <div>
      <small class="is-small">Logged As:</small>
      <Identity
        :address="account"
        class="navbar__address is-size-6"
        hide-identity-popover />
    </div>
    <div class="has-text-right">
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

const { $store } = useNuxtApp()
const account = $store.getters.getAuthAddress

const disconnect = () => {
  $store.dispatch('setAuth', { address: '' }) // null not working
  clearSession()
}
</script>
