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
import { Component, mixins, Vue } from 'nuxt-property-decorator'
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
