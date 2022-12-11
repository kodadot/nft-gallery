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
      <b-button
        class="navbar__sign-out-button menu-item mb-4 is-size-7"
        @click="disconnect()">
        {{ $t('profileMenu.disconnect') }}
      </b-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { clearSession } from '~/utils/cachingStrategy'

const Identity = defineAsyncComponent(
  () => import('@/components/identity/IdentityIndex.vue')
)

const { $store, $i18n } = useNuxtApp()
const account = $store.getters.getAuthAddress

const disconnect = () => {
  $store.dispatch('setAuth', { address: '' }) // null not working
  clearSession()
}
</script>
