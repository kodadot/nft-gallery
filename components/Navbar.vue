<template>
  <b-navbar
    fixed-top
    spaced
    wrapper-class="container"
    close-on-click
    :class="{ 'navbar-shrink': !showTopNavbar }">
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
        v-if="!mobileGallery"
        :class="{ 'nav-search-shrink': !showTopNavbar }"
        hideFilter
        class="search-navbar"
        searchColumnClass="is-flex-grow-1" />
    </template>
    <template #end v-if="showTopNavbar">
      <HistoryBrowser
        class="ml-2 navbar-link-background"
        id="NavHistoryBrowser" />
      <b-navbar-dropdown arrowless collapsible id="NavCreate">
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
      <b-navbar-dropdown arrowless collapsible id="NavExplore">
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
      <b-navbar-dropdown arrowless collapsible v-if="isRmrk" id="NavStats">
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
      <ChainSelect class="ml-2" id="NavChainSelect" />
      <LocaleChanger class="ml-2" id="NavLocaleChanger" />
      <NavbarProfileDropdown :isRmrk="isRmrk" id="NavProfile" />
    </template>
    <template #end v-else>
      <div class="image is-32x32 mr-2">
        <BasicImage
          v-show="inCollectionPage && currentCollection.image"
          :src="currentCollection.image"
          :alt="navBarTitle"
          rounded />
      </div>
      <div class="title is-4">{{ navBarTitle }}</div>
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
import Identity from '@/components/shared/format/Identity.vue'
import Search from '@/components/rmrk/Gallery/Search/SearchBar.vue'
import BasicImage from '@/components/shared/view/BasicImage.vue'

import { identityStore } from '@/utils/idbStore'
import { get } from 'idb-keyval'

@Component({
  components: {
    LocaleChanger,
    HistoryBrowser,
    NavbarProfileDropdown,
    ChainSelect,
    Search,
    Identity,
    BasicImage,
  },
})
export default class NavbarMenu extends mixins(PrefixMixin) {
  private mobileGallery = false
  private isGallery: boolean = this.$route.path == '/rmrk/gallery'
  private showTopNavbar = true
  private lastScrollPosition = 0
  private artistName = ''

  private onResize() {
    return (this.mobileGallery = window.innerWidth <= 1023)
  }

  get isRmrk(): boolean {
    return this.urlPrefix === 'rmrk' || this.urlPrefix === 'westend'
  }

  get inCollectionPage(): boolean {
    return this.$route.name === 'rmrk-collection-id'
  }
  get inGalleryDetailPage(): boolean {
    return this.$route.name === 'rmrk-gallery-id'
  }
  get inUserProfilePage(): boolean {
    return this.$route.name === 'rmrk-u-id'
  }

  get isTargetPage(): boolean {
    return (
      this.inCollectionPage ||
      this.inGalleryDetailPage ||
      this.inUserProfilePage
    )
  }
  get currentCollection() {
    return this.$store.getters['history/getCurrentlyViewedCollection'] || {}
  }
  get currentGalleryItemName() {
    return this.$store.getters['history/getCurrentlyViewedItem']?.name || ''
  }

  get navBarTitle(): string {
    let title = ''
    if (this.inCollectionPage) {
      title = this.currentCollection.name
    } else if (this.inGalleryDetailPage) {
      title = this.currentGalleryItemName
    } else if (this.inUserProfilePage) {
      const address = this.$route.params.id
      title = this.artistName ? this.artistName : address
      if (!this.artistName) {
        this.fetchArtistIdentity(address)
      }
    }
    return title
  }

  async fetchArtistIdentity(address) {
    const identity = await get(address, identityStore)
    if (identity && identity.display) {
      this.artistName = identity.display
    }
  }

  onScroll() {
    const currentScrollPosition = document.documentElement.scrollTop
    if (currentScrollPosition <= 0) {
      this.showTopNavbar = true
      return
    }
    if (Math.abs(currentScrollPosition - this.lastScrollPosition) < 30) {
      return
    }
    const fixedTitleNavAppearDistance = 200
    this.showTopNavbar =
      currentScrollPosition < fixedTitleNavAppearDistance || !this.isTargetPage
    this.lastScrollPosition = currentScrollPosition
  }

  mounted() {
    window.addEventListener('scroll', this.onScroll)
    if (this.isGallery) {
      window.addEventListener('resize', this.onResize)
      return (this.mobileGallery = window.innerWidth <= 1023)
    }
  }

  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll)
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

// Reserved for future adjustments

// @media only screen and (min-width: 1215px) and (max-width: 1140px) {
//   a#NavProfile {
//     display: none;
//   }
// }

// @media only screen and (min-width: 1215px) and (max-width: 1160px) {
//   a#NavStats {
//     display: none;
//   }
// }

// @media only screen and (min-width: 1215px) and (max-width: 1190px) {
//   div#NavHistoryBrowser {
//     display: none;
//   }
// }

@media only screen and (min-width: 1024px) and (max-width: 1337px) {
  .navbar-menu .search-navbar {
    width: 300px !important;
  }
}

@media only screen and (min-width: 1024px) and (max-width: 1180px) {
  div#NavChainSelect {
    display: none;
  }
}

@media only screen and (min-width: 1024px) and (max-width: 1220px) {
  div#NavLocaleChanger {
    display: none;
  }
}

.navbar {
  background: rgba(12, 12, 12, 0.7);
  backdrop-filter: blur(20px);
  transform: translateZ(0px);
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
    border-top: 1px solid $primary;
    margin-left: 0.5em;
    transition: 0.3s;
    background: rgba(9, 9, 9, 0.55);
    &:hover {
      background-color: $primary;
      color: $text;
    }
  }

  .logo {
    border: none !important;
    margin-left: 0;
    background: transparent;
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
    margin: 0rem 1rem;
    background-color: transparent;
    box-shadow: none;
    width: 400px;
    margin: 0 1rem;
    input {
      border: inherit;
      background-color: rgba(41, 41, 47, 0.5);
      &::placeholder {
        color: #898991 !important;
      }
      &:focus {
        box-shadow: none !important;
        border-top: 2px solid $primary;
      }
    }
  }
}
</style>
