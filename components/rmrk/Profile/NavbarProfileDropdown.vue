<template>
  <b-dropdown position="is-bottom-left" aria-role="menu">
    <template #trigger>
      <span v-if="account" class="is-mobile is-vcentered navbar__avatar">
        <!-- <Avatar class="navbar__avatar-icon" :value="account" :size="34" /> -->
        <b-button
          type="is-primary navbar-link-background is-bordered-light"
          class="navbar__button">
          <Identity
            :address="account"
            class="navbar__address"
            hideIdentityPopover
            inline />
        </b-button>
      </span>

      <template v-else>
        <ConnectWalletButton class="navbar__button" />
      </template>
    </template>

    <template v-if="account">
      <b-dropdown-item has-link aria-role="menuitem">
        <nuxt-link :to="`/${urlPrefix}/u/${account}`">
          {{ $t('profile.page') }}
        </nuxt-link>
      </b-dropdown-item>
      <b-dropdown-item has-link aria-role="menuitem">
        <nuxt-link to="/settings">{{ $t('settings') }}</nuxt-link>
      </b-dropdown-item>

      <hr class="dropdown-divider" aria-role="menuitem" />

      <b-dropdown-item v-if="isRmrk" has-link aria-role="menuitem">
        <nuxt-link to="/rmrk/admin">{{ $t('Admin') }}</nuxt-link>
      </b-dropdown-item>
      <b-dropdown-item has-link aria-role="menuitem">
        <a @click="showRampSDK">
          {{ $t('credit') }}
        </a>
      </b-dropdown-item>
      <b-dropdown-item has-link aria-role="menuitem">
        <nuxt-link :to="{ name: 'identity' }">
          {{ $t('identity.page') }}
        </nuxt-link>
      </b-dropdown-item>
      <b-dropdown-item has-link aria-role="menuitem">
        <nuxt-link to="/teleport">{{ $t('teleport.page') }}</nuxt-link>
      </b-dropdown-item>
      <b-dropdown-item has-link aria-role="menuitem">
        <nuxt-link to="/transfer">{{ $t('transfer') }}</nuxt-link>
      </b-dropdown-item>
      <b-dropdown-item has-link aria-role="menuitem">
        <nuxt-link to="/transform">{{ $t('transform') }}</nuxt-link>
      </b-dropdown-item>

      <hr class="dropdown-divider" aria-role="menuitem" />

      <b-dropdown-item custom aria-role="menuitem">
        <b-field>
          <p class="control">
            <ConnectWalletButton label="general.change_account" />
          </p>
          <p class="control">
            <b-button
              class="navbar__sign-out-button"
              icon-left="sign-out-alt"
              @click="disconnect()" />
          </p>
        </b-field>
      </b-dropdown-item>
    </template>
  </b-dropdown>
</template>

<script lang="ts">
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import Avatar from '@/components/shared/Avatar.vue'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk'

const components = {
  Avatar,
  ConnectWalletButton: () =>
    import('@/components/shared/ConnectWalletButton.vue'),
  Identity: () => import('@/components/shared/format/Identity.vue'),
}

@Component({ components })
export default class NavbarProfileDropdown extends mixins(PrefixMixin) {
  @Prop() public value!: any
  @Prop() public isRmrk!: boolean

  protected disconnect() {
    this.$store.dispatch('setAuth', { address: '' }) // null not working
    localStorage.removeItem('kodaauth')
  }

  set account(account: string) {
    this.$store.dispatch('setAuth', { address: account })
  }

  get account() {
    return this.$store.getters.getAuthAddress
  }

  protected showRampSDK(): void {
    new RampInstantSDK({
      defaultAsset: 'KSM', // todo: prefix
      userAddress: this.account,
      hostAppName: 'KodaDot',
      hostApiKey: 'a99bfvomhhbvzy6thaycxbawz7d3pssuz2a8hsrc', // env
      hostLogoUrl: 'https://kodadot.xyz/apple-touch-icon.png',
      variant: 'desktop',
    }).show()
  }
}
</script>

<style lang="scss">
@import 'bulma/sass/utilities/mixins.sass';
@import '@/styles/variables';

.navbar {
  &__identity {
    @include from($desktop) {
      display: none;
    }
  }

  &__button {
    border: 0;
    border-top: 2px solid $primary !important;
  }

  &__avatar {
    display: flex;
    align-items: center;
  }

  &__avatar-icon {
    cursor: pointer;

    @include until($desktop) {
      padding-right: 0.75rem;
    }
  }

  &__address {
    text-transform: none;
  }
  &__sign-out-button {
    border-top: $sleek-primary-border !important;
    border-bottom: 0;
    border-right: 0;
    border-left: 0;
  }
}
</style>
