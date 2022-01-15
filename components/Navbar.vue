<template>
  <b-navbar
    fixed-top
    spaced
    wrapper-class="container"
    close-on-click
  >
    <template #brand>
      <b-navbar-item
        tag="nuxt-link"
        :to="{ path: '/' }"
        class="logo"
      >
        <img
          src="~/assets/Koda_Beta.svg"
          alt="First NFT market explorer on Kusama and Polkadot"
          height="32"
        >
      </b-navbar-item>
    </template>
    <template #start>
      <b-navbar-dropdown
        arrowless
        collapsible
      >
        <template #label>
          <span>{{ $t('Create') }}</span>
        </template>
        <b-navbar-item
          tag="nuxt-link"
          :to="`/${urlPrefix}/create`"
        >
          {{ $t('Classic') }}
        </b-navbar-item>
        <template v-if="isRmrk">
          <b-navbar-item
            tag="nuxt-link"
            to="/rmrk/mint"
          >
            {{ $t('Simple') }}
          </b-navbar-item>
          <b-navbar-item
            tag="nuxt-link"
            to="/permafrost/create"
          >
            {{ $t('Permafrost') }}
          </b-navbar-item>
        </template>
      </b-navbar-dropdown>
      <b-navbar-item
        tag="nuxt-link"
        :to="`/${urlPrefix}/collections`"
      >
        {{ $t('Collections') }}
      </b-navbar-item>
      <b-navbar-item
        tag="nuxt-link"
        :to="`/${urlPrefix}/gallery`"
      >
        {{ $t('Gallery') }}
      </b-navbar-item>
      <template v-if="isRmrk">
        <b-navbar-item
          tag="nuxt-link"
          to="/spotlight"
        >
          {{ $t('Spotlight') }}
        </b-navbar-item>
        <b-navbar-item
          tag="nuxt-link"
          to="/series-insight"
        >
          Series
        </b-navbar-item>
      </template>
      <b-navbar-dropdown
        arrowless
        collapsible
        label="Extra"
      >
        <b-navbar-item
          tag="nuxt-link"
          to="/rmrk/credit"
        >
          {{ $t('Credit') }}
        </b-navbar-item>
        <b-navbar-item
          tag="nuxt-link"
          to="/rmrk/faq"
        >
          {{ $t('FAQ') }}
        </b-navbar-item>
        <b-navbar-item
          v-if="isRmrk"
          tag="nuxt-link"
          to="/rmrk/admin"
        >
          {{ $t('Admin') }}
        </b-navbar-item>
        <b-navbar-item
          tag="nuxt-link"
          to="/transfer"
        >
          {{ $t('Transfer') }}
        </b-navbar-item>
        <b-navbar-item
          tag="nuxt-link"
          to="/transform"
        >
          {{ $t('Transform') }}
        </b-navbar-item>
        <b-navbar-item
          tag="nuxt-link"
          to="/teleport"
        >
          {{ $t('Teleport') }}
        </b-navbar-item>
        <b-navbar-item
          tag="nuxt-link"
          to="/settings"
        >
          {{ $t('Settings') }}
        </b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-item
        tag="nuxt-link"
        to="/tutorials"
      >
        {{ $t('Tutorial') }}
      </b-navbar-item>
    </template>
    <template #end>
      <HistoryBrowser />
      <LocaleChanger />
      <NavbarProfileDropdown />
    </template>
  </b-navbar>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import LocaleChanger from '@/components/shared/SwitchLocale.vue'
import HistoryBrowser from '@/components/shared/history/HistoryBrowser.vue'
import NavbarProfileDropdown from '@/components/rmrk/Profile/NavbarProfileDropdown.vue'
import PrefixMixin from '~/utils/mixins/prefixMixin'

@Component({
  components: {
    LocaleChanger,
    HistoryBrowser,
    NavbarProfileDropdown
  }
})
export default class NavbarMenu extends mixins(PrefixMixin) {
  get isRmrk(): boolean {
    return this.urlPrefix === 'rmrk'
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
    border: 2px solid $primary-light !important;
    box-shadow: 13px 14px $primary-dark-transparent !important;
  }
}
</style>
