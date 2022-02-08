<template>
  <b-dropdown position="is-bottom-left" aria-role="menu">
    <template #trigger>
      <span v-if="account" class="is-mobile is-vcentered navbar__avatar">
        <!-- <Avatar class="navbar__avatar-icon" :value="account" :size="34" /> -->
        <b-button type="is-primary" class="navbar__button">
          <Identity
            :address="account"
            :inline="true"
            class="navbar__address"
            hideIdentityPopover />
        </b-button>

        <!-- <span class="navbar__identity subtitle is-4 is-align-self-center"><Identity :address="account" :inline="true"/></span> -->
      </span>
      <template v-else>
        <b-button
          type="is-primary"
          class="navbar__button"
          @click="checkExtension()">
          Log in
        </b-button>
      </template>
    </template>
    <template v-if="account">
      <b-dropdown-item has-link aria-role="menuitem">
        <nuxt-link :to="`/${urlPrefix}/u/${account}`">
          {{ $t('Profile') }}
        </nuxt-link>
      </b-dropdown-item>
      <b-dropdown-item has-link aria-role="menuitem">
        <nuxt-link to="/settings">{{ $t('Settings') }}</nuxt-link>
      </b-dropdown-item>

      <hr class="dropdown-divider" aria-role="menuitem" />

      <b-dropdown-item v-if="isRmrk" has-link aria-role="menuitem">
        <nuxt-link to="/rmrk/admin">{{ $t('Admin') }}</nuxt-link>
      </b-dropdown-item>
      <b-dropdown-item has-link aria-role="menuitem">
        <a @click="showRampSDK">
          {{ $t('Credit') }}
        </a>
      </b-dropdown-item>
      <b-dropdown-item has-link aria-role="menuitem">
        <router-link :to="{ name: 'identity' }">
          {{ $t('Identity') }}
        </router-link>
      </b-dropdown-item>
      <b-dropdown-item has-link aria-role="menuitem">
        <nuxt-link to="/teleport">{{ $t('Teleport') }}</nuxt-link>
      </b-dropdown-item>
      <b-dropdown-item has-link aria-role="menuitem">
        <nuxt-link to="/transfer">{{ $t('Transfer') }}</nuxt-link>
      </b-dropdown-item>
      <b-dropdown-item has-link aria-role="menuitem">
        <nuxt-link to="/transform">{{ $t('Transform') }}</nuxt-link>
      </b-dropdown-item>

      <hr class="dropdown-divider" aria-role="menuitem" />
    </template>

    <b-dropdown-item v-if="account" custom aria-role="menuitem">
      <b-button
        type="is-primary"
        expanded
        @click="changeAccount = !changeAccount">
        Change account
      </b-button>
    </b-dropdown-item>
    <b-dropdown-item
      v-if="!isExtension && (changeAccount || !account)"
      custom
      aria-role="menuitem">
      <AccountSelect
        v-model="account"
        :label="$i18n.t('Account')"
        :tooltip-visible="false" />
    </b-dropdown-item>
    <template v-if="isExtension && (changeAccount || !account)">
      <b-dropdown-item has-link aria-role="menuitem">
        <a
          href="https://polkadot.js.org/extension/"
          rel="noopener noreferrer"
          target="_blank"
          class="is-flex is-align-items-center pl-3">
          Install Desktop Wallet Extension
        </a>
      </b-dropdown-item>
      <b-dropdown-item has-link aria-role="menuitem">
        <a
          href="https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd"
          rel="noopener noreferrer"
          target="_blank"
          class="is-flex is-align-items-center pl-3">
          Install Chrome Wallet Extension
        </a>
      </b-dropdown-item>
      <b-dropdown-item has-link aria-role="menuitem">
        <a
          href="https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/"
          rel="noopener noreferrer"
          target="_blank"
          class="is-flex is-align-items-center pl-3">
          Install Firefox Wallet Extension
        </a>
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
  AccountSelect: () => import('@/components/shared/AccountSelect.vue'),
  Identity: () => import('@/components/shared/format/Identity.vue'),
}

@Component({ components })
export default class NavbarProfileDropdown extends mixins(PrefixMixin) {
  @Prop() public value!: any
  @Prop() public isRmrk!: boolean
  protected changeAccount = false
  protected isExtension = false

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

  protected checkExtension(): void {
    if (!(window as any).injectedWeb3['polkadot-js']) {
      this.isExtension = true
      this.$buefy.toast.open({
        message: 'You need to install the browser extension - polkadot.js!',
        duration: 90000,
      })
    }
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
}
</style>
