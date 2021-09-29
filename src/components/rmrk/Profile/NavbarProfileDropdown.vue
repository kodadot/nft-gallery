<template>
  <b-dropdown position="is-bottom-left" aria-role="menu">
    <template #trigger>
      <span v-if="account" class="is-mobile is-vcentered navbar__avatar">
        <!-- <Avatar class="navbar__avatar-icon" :value="account" :size="34" /> -->
        <b-button type="is-primary" class="navbar__button">
          <Identity :address="account" :inline="true" class="navbar__address" />
        </b-button>

        <!-- <span class="navbar__identity subtitle is-4 is-align-self-center"><Identity :address="account" :inline="true"/></span> -->
      </span>
      <template v-else>
        <b-button type="is-primary" class="navbar__button ml-3 my-3" @click="checkExtension()">Log in</b-button>
      </template>
    </template>

    <template v-if="account">
      <b-dropdown-item has-link aria-role="menuitem">
        <router-link :to="{ name: 'profile', params: { id: account } }">
          Profile
        </router-link>
      </b-dropdown-item>
      <b-dropdown-item has-link aria-role="menuitem">
        <router-link :to="{ name: 'rmrkCredit' }">
          {{ $t("Credit") }}
        </router-link>
      </b-dropdown-item>
      <b-dropdown-item has-link aria-role="menuitem">
        <router-link :to="{ name: 'rmrkFaq' }" >
          F.A.Q.
        </router-link>
      </b-dropdown-item>
      <hr class="dropdown-divider" aria-role="menuitem" />
      <b-dropdown-item has-link aria-role="menuitem">
        <a href="https://twitter.com/kodadot" target="_blank" rel="noopener noreferrer" class="is-flex is-align-items-center pl-3">
          <b-icon pack="fab" icon="twitter" class="mr-1"> </b-icon>
          <strong>KodaDot</strong>
        </a>
      </b-dropdown-item>
      <b-dropdown-item has-link aria-role="menuitem">
        <a href="https://discord.gg/u6ymnbz4PR" target="_blank" rel="noopener noreferrer" class="is-flex is-align-items-center pl-3">
          <b-icon pack="fab" icon="discord" class="mr-1"> </b-icon>
          <strong>Discord</strong>
        </a>
      </b-dropdown-item>
      <hr class="dropdown-divider" aria-role="menuitem" />
    </template>
    <b-dropdown-item v-if="account" custom aria-role="menuitem">
      <b-button
        type="is-primary"
        @click="changeAccount = !changeAccount"
        expanded
      >
        Change account
      </b-button>
    </b-dropdown-item>
    <b-dropdown-item
      v-if="!isExtension && (changeAccount || !account)"
      custom
      aria-role="menuitem"
    >
      <AccountSelect
        :label="$i18n.t('Account')"
        v-model="account"
        :tooltipVisible="false"
      />
    </b-dropdown-item>
    <template v-if="isExtension && (changeAccount || !account)">
      <b-dropdown-item has-link aria-role="menuitem">
        <a href="https://polkadot.js.org/extension/" rel="noopener noreferrer" target="_blank" class="is-flex is-align-items-center pl-3">
          Install Desktop Wallet Extension
        </a>
      </b-dropdown-item>
      <b-dropdown-item has-link aria-role="menuitem">
        <a href="https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd" rel="noopener noreferrer" target="_blank" class="is-flex is-align-items-center pl-3">
          Install Chrome Wallet Extension
        </a>
      </b-dropdown-item>
      <b-dropdown-item has-link aria-role="menuitem">
        <a href="https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/" rel="noopener noreferrer" target="_blank" class="is-flex is-align-items-center pl-3">
          Install Firefox Wallet Extension
        </a>
      </b-dropdown-item>
    </template>
  </b-dropdown>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Avatar from '@/components/shared/Avatar.vue'

const components = {
  Avatar,
  AccountSelect: () => import('@/components/shared/AccountSelect.vue'),
  Identity: () => import('@/components/shared/format/Identity.vue')
}

@Component({ components })
export default class NavbarProfileDropdown extends Vue {
  @Prop() public value!: any;
  protected changeAccount = false;
  protected isExtension = false;

  set account(account: string) {
    console.log('setAuth', account)
    this.$store.dispatch('setAuth', { address: account })
  }

  get account() {
    return this.$store.getters.getAuthAddress
  }

  checkExtension() {
    if (!(window as any).injectedWeb3['polkadot-js']) {
      this.isExtension = true
      this.$buefy.toast.open({
        message:  'You need to install the browser extension - polkadot.js!',
        duration: 90000
      })
    }
  }
}
</script>

<style lang="scss">
@import "bulma/bulma.sass";

.navbar {
  &__identity {
    @include from($desktop) {
      display: none;
    }
  }

  &__avatar {
    display: flex;
    align-items: center;

    @include until($desktop) {
      padding: 0.5rem 0.75rem;
    }
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
