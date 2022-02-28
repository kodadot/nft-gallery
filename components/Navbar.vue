<template>
  <b-navbar
    fixed-top
    spaced
    wrapper-class="container"
    close-on-click
    :class="{ 'navbar-shrink': !showNavbar }">
    <template #brand>
      <b-navbar-item tag="nuxt-link" :to="{ path: '/' }" class="logo">
        <img
          src="~/assets/Koda_Beta.svg"
          alt="First NFT market explorer on Kusama and Polkadot"
          height="32" />
      </b-navbar-item>
    </template>
    <template #start>
      <Search
        v-if="!mobileExplorer"
        :class="{ 'nav-search-shrink': !showNavbar }"
        hideFilter
        class="search-navbar"
        searchColumnClass="is-flex-grow-1" />
    </template>
    <template #end>
      <HistoryBrowser class="ml-2" />
      <b-navbar-dropdown arrowless collapsible>
        <template #label>
          <span>{{ $t('Create') }}</span>
        </template>
        <b-tooltip
          label="Start by creating your collection and add NFTs to it"
          position="is-right">
          <b-navbar-item tag="nuxt-link" :to="`/${urlPrefix}/create`">
            {{ $t('Classic') }}
          </b-navbar-item>
        </b-tooltip>
        <template v-if="isRmrk">
          <b-tooltip
            label="Simplified process to create your NFT in a single step"
            position="is-right"
            style="display: block">
            <b-navbar-item tag="nuxt-link" :to="`/${urlPrefix}/mint`">
              {{ $t('Simple') }}
            </b-navbar-item>
          </b-tooltip>
        </template>
      </b-navbar-dropdown>
      <b-navbar-dropdown arrowless collapsible>
        <template #label>
          <span>{{ $t('Explore') }}</span>
        </template>
        <b-navbar-item tag="nuxt-link" :to="`/${urlPrefix}/collections`">
          {{ $t('Collections') }}
        </b-navbar-item>
        <b-navbar-item tag="nuxt-link" :to="`/${urlPrefix}/gallery`">
          {{ $t('Gallery') }}
        </b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-dropdown arrowless collapsible v-if="isRmrk">
        <template #label>
          <span>{{ $t('Stats') }}</span>
        </template>
        <template>
          <b-navbar-item tag="nuxt-link" to="/spotlight">
            {{ $t('Spotlight') }}
          </b-navbar-item>
          <b-navbar-item tag="nuxt-link" to="/series-insight">
            Series
          </b-navbar-item>
        </template>
      </b-navbar-dropdown>
      <ChainSelect class="ml-2" />
      <LocaleChanger class="ml-2" />
      <NavbarProfileDropdown :isRmrk="isRmrk" />
    </template>
  </b-navbar>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import LocaleChanger from '@/components/shared/SwitchLocale.vue'
import ChainSelect from '@/components/shared/ChainSelect.vue'
import HistoryBrowser from '@/components/shared/history/HistoryBrowser.vue'
import NavbarProfileDropdown from '@/components/rmrk/Profile/NavbarProfileDropdown.vue'
import PrefixMixin from '~/utils/mixins/prefixMixin'

@Component({
  components: {
    LocaleChanger,
    HistoryBrowser,
    NavbarProfileDropdown,
    ChainSelect,
    Search: () => import('@/components/rmrk/Gallery/Search/SearchBar.vue'),
  },
})
export default class NavbarMenu extends mixins(PrefixMixin) {
  public mobileExplorer = false
  private isExplorer: boolean =
    this.$route.path == '/rmrk/collections' ||
    this.$route.path == '/rmrk/gallery'

  created() {
    if (this.isExplorer) {
      window.addEventListener('resize', this.onResize)
      return (this.mobileExplorer = window.innerWidth <= 1023)
    }
  }

  private onResize(e) {
    return (this.mobileExplorer = window.innerWidth <= 1023)
  }

  private showNavbar = true
  private lastScrollPosition = 0

  get isRmrk(): boolean {
    return this.urlPrefix === 'rmrk' || this.urlPrefix === 'westend'
  }

  onScroll() {
    const currentScrollPosition = document.documentElement.scrollTop
    if (currentScrollPosition < 0) {
      return
    }
    if (Math.abs(currentScrollPosition - this.lastScrollPosition) < 60) {
      return
    }
    this.showNavbar = currentScrollPosition < this.lastScrollPosition
    this.lastScrollPosition = currentScrollPosition
  }

  mounted() {
    window.addEventListener('scroll', this.onScroll)
  }

  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll)
  }

  destroyed() {
    window.removeEventListener('resize', this.onResize)
  }
}
</script>

<style lang="scss">
@import '@/styles/variables';

@media (min-width: 1024px) {
  .navbar-shrink {
    box-shadow: none;
    max-height: 70px;
    padding-top: 6px !important;
    padding-bottom: 6px !important;
  }
  .nav-search-shrink {
    padding-bottom: 0 !important;
  }
}
.navbar {
  transition: 0.3s ease;
  -webkit-transition: 0.3s ease;
  &.is-spaced {
    & > .container {
      .navbar-menu {
        margin-right: 0;
        .button {
          height: 42px;
        }
      }
      .navbar-start {
        flex-grow: 1;
      }
    }
  }

  .navbar-link {
    &:hover {
      background-color: $primary !important;
      color: $text !important;
    }
  }

  .navbar-item {
    text-transform: uppercase;
    font-weight: 500;
    border-top: 2px solid $primary;
    margin-left: 0.5em;
    transition: 0.3s;
    &:hover {
      background-color: $primary;
      color: $text;
    }
  }

  .logo {
    border: none !important;
    margin-left: 0;
  }

  .navbar-brand {
    align-items: center;
  }

  .burger {
    margin-right: 0.5rem;
  }
  .navbar-dropdown {
    border: 2px solid $primary-light !important;
    box-shadow: $dropdown-content-shadow !important;
    .navbar-item {
      border: none !important;
      margin-left: 0 !important;
    }
  }
  .search-navbar {
    flex-grow: 1;
    margin: 0 1rem;
    input {
      border: inherit;
      background-color: #29292f;
      &::placeholder {
        color: #898991 !important;
      }
    }
  }
}
</style>
