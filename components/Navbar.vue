<template>
  <b-navbar
    fixed-top
    spaced
    wrapper-class="container"
    close-on-click
  >
    <template #brand>
      <b-navbar-item
        tag="router-link"
        :to="{ path: '/' }"
        class="logo"
      >
        <img
          src="/koda300x300.svg"
          alt="First NFT market explorer on Kusama and Polkadot"
          class="logo__img"
          width="60"
          height="60"
        >
      </b-navbar-item>
    </template>
    <template
      #start
      class="start"
    >
      <b-navbar-dropdown
        arrowless
        collapsible
      >
        <template #label>
          <span>{{ $t('Create') }}</span>
        </template>
        <b-navbar-item
          tag="router-link"
          :to="`/${urlPrefix}/create`"
        >
          {{ $t('Classic') }}
        </b-navbar-item>
        <b-navbar-item
          tag="router-link"
          to="/rmrk/mint"
        >
          {{ $t('Simple') }}
        </b-navbar-item>
        <b-navbar-item
          tag="router-link"
          to="/permafrost/create"
        >
          {{ $t('Permafrost') }}
        </b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-item
        tag="router-link"
        :to="`/${urlPrefix}/collections`"
      >
        {{ $t('Collections') }}
      </b-navbar-item>
      <b-navbar-item
        tag="router-link"
        :to="`/${urlPrefix}/gallery`"
      >
        {{ $t('Gallery') }}
      </b-navbar-item>
      <b-navbar-item
        tag="router-link"
        to="/spotlight"
      >
        {{ $t('Spotlight') }}
      </b-navbar-item>
      <b-navbar-item
        tag="router-link"
        to="/series-insight"
      >
        Series
      </b-navbar-item>
      <b-navbar-dropdown
        arrowless
        collapsible
        label="Extra"
      >
        <b-navbar-item
          tag="router-link"
          to="/rmrk/credit"
        >
          {{ $t('Credit') }}
        </b-navbar-item>
        <b-navbar-item
          tag="router-link"
          to="/rmrk/faq"
        >
          {{ $t('FAQ') }}
        </b-navbar-item>
        <b-navbar-item
          tag="router-link"
          to="/rmrk/admin"
        >
          {{ $t('Admin') }}
        </b-navbar-item>
        <b-navbar-item
          tag="router-link"
          to="/transfer"
        >
          {{ $t('Transfer') }}
        </b-navbar-item>
        <b-navbar-item
          tag="router-link"
          to="/settings"
        >
          {{ $t('Settings') }}
        </b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-item
        tag="router-link"
        to="/tutorials"
      >
        {{ $t('Tutorial') }}
      </b-navbar-item>
    </template>
    <template #end>
      <LocaleChanger />
      <NavbarProfileDropdown />
    </template>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import LocaleChanger from '@/components/shared/SwitchLocale.vue'
import NavbarProfileDropdown from '@/components/rmrk/Profile/NavbarProfileDropdown.vue'
import { getCurrentColor } from '@/colors'
import i18n from '@/i18n'

@Component({
  components: {
    LocaleChanger,
    NavbarProfileDropdown
  }
})
export default class NavbarMenu extends Vue {
  private prefix = this.$config.prefix
  public navbar: any = [
    {
      name: i18n.t('Gallery'),
      tag: 'router-link',
      to: { name: 'nft' },
      strong: true
    },
  ]
  public navbarExtra: any = [
    {
      name: i18n.t('Accounts'),
      icon: 'users',
      to: { name: 'accounts' },
      tag: 'router-link',
    },
    {
      name: i18n.t('Credit'),
      icon: 'users',
      to: { name: 'rmrkCredit' },
      tag: 'router-link',
      strong: true
    },
    {
      name: i18n.t('Transfer'),
      icon: 'paper-plane',
      to: { name: 'transfer' },
      tag: 'router-link',
    },
    {
      name: i18n.t('Settings'),
      icon: 'cogs',
      tag: 'router-link',
      to: { name: 'settings' },
    },
  ]
  private navbarExternal: any = [
    {
      name: 'Twitter',
      tag: 'a',
      href: 'https://twitter.com/Kodadot'
    }
  ]

  get urlPrefix() {
    return this.prefix || 'rmrk'
  }
}
</script>

<style lang="scss">
@import '@/styles/variables';

.navbar {
  &.is-spaced {
    & > .container {
      .navbar-menu {
        margin-right: 0;
      }
    }
  }

  .logo {
    padding: 0.5rem 0.75rem;

    @include desktop {
      padding-left: 0;
    }
  }

  .navbar-item {
    text-transform: uppercase;
    font-weight: 500;
  }

  .navbar-brand {
    align-items: center;
  }

  .burger {
    margin-right: 0.5rem;
  }
  .navbar-dropdown{
    box-shadow: 0px 0px 5px 0.5px #d32e79 !important;
  }
}
</style>
