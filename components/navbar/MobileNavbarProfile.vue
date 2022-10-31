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

<script lang="ts">
import Identity from '@/components/identity/IdentityIndex.vue'
import { Component, mixins } from 'nuxt-property-decorator'
import { clearSession } from '~/utils/cachingStrategy'

@Component({
  components: {
    Identity,
  },
})
export default class MobileNavbarProfile extends mixins() {
  get account() {
    return this.$store.getters.getAuthAddress
  }

  public disconnect() {
    this.$store.dispatch('setAuth', { address: '' }) // null not working
    clearSession()
  }
}
</script>
