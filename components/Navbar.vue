<template>
  <b-navbar
    fixed-top
    spaced
    wrapper-class="container"
    close-on-click
    :mobile-burger="!showMobileSearchBar"
    :active.sync="isBurgerMenuOpened"
    :class="{ 'navbar-shrink': !showTopNavbar }">
    <template #brand>
      <b-navbar-item tag="nuxt-link" :to="{ path: '/' }" class="logo">
        <img
          src="~/assets/Koda_Beta.svg"
          alt="First NFT market explorer on Kusama and Polkadot"
          width="130"
          height="35" />
      </b-navbar-item>
      <div
        v-if="showMobileSearchBar"
        class="search-navbar-container-mobile is-hidden-desktop is-flex is-align-items-center">
        <b-button @click="toggleSearchBarDisplay" icon-left="times" />
        <Search
          v-if="showMobileSearchBar"
          showDefaultSuggestions
          hideFilter
          class="is-flex-grow-1 pr-1 is-hidden-desktop mt-5" />
      </div>

      <div
        v-else
        class="is-hidden-desktop is-flex is-flex-grow-1 is-align-items-center is-justify-content-flex-end"
        @click="closeBurgerMenu">
        <div>
          <HistoryBrowser />

          <b-button
            @click="toggleSearchBarDisplay"
            type="is-primary is-bordered-light"
            class="navbar-link-background"
            icon-right="search" />
        </div>
      </div>
    </template>
    <template #start>
      <Search
        v-if="!mobileGallery"
        :class="{
          'nav-search-shrink': !showTopNavbar,
        }"
        hideFilter
        showDefaultSuggestions
        class="search-navbar is-flex-grow-1 is-hidden-touch"
        searchColumnClass="is-flex-grow-1" />
    </template>
    <template #end v-if="showTopNavbar">
      <LazyHistoryBrowser
        class="custom-navbar-item navbar-link-background is-hidden-touch"
        id="NavHistoryBrowser" />
      <b-navbar-dropdown arrowless collapsible id="NavCreate">
        <template #label>
          <span>{{ $t('create') }}</span>
        </template>
        <b-tooltip
          label="Start by creating your collection and add NFTs to it"
          position="is-right">
          <b-navbar-item tag="nuxt-link" :to="`/${urlPrefix}/create`">
            {{ $t('classic') }}
          </b-navbar-item>
        </b-tooltip>
        <template v-if="isRmrk">
          <b-tooltip
            label="Simplified process to create your NFT in a single step"
            position="is-right"
            style="display: block">
            <b-navbar-item tag="nuxt-link" :to="`/${urlPrefix}/mint`">
              {{ $t('simple') }}
            </b-navbar-item>
          </b-tooltip>
        </template>
      </b-navbar-dropdown>
      <b-navbar-item tag="nuxt-link" :to="`/${urlPrefix}/explore`">
        <span>{{ $t('explore') }}</span>
      </b-navbar-item>
      <b-navbar-dropdown arrowless collapsible v-if="isRmrk" id="NavStats">
        <template #label>
          <span>{{ $t('stats') }}</span>
        </template>
        <template>
          <b-navbar-item tag="nuxt-link" to="/spotlight">
            {{ $t('spotlight.page') }}
          </b-navbar-item>
          <b-navbar-item tag="nuxt-link" to="/series-insight">
            Series
          </b-navbar-item>
          <b-navbar-item tag="nuxt-link" to="/sales"> Sales </b-navbar-item>
        </template>
      </b-navbar-dropdown>
      <LazyChainSelect class="custom-navbar-item" id="NavChainSelect" />
      <LazySwitchLocale class="custom-navbar-item" id="NavLocaleChanger" />
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
import NavbarProfileDropdown from '@/components/rmrk/Profile/NavbarProfileDropdown.vue'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import Identity from '@/components/shared/format/Identity.vue'
import Search from '@/components/rmrk/Gallery/Search/SearchBar.vue'
import BasicImage from '@/components/shared/view/BasicImage.vue'

import { identityStore } from '@/utils/idbStore'
import { get } from 'idb-keyval'

@Component({
  components: {
    NavbarProfileDropdown,
    Search,
    Identity,
    BasicImage,
  },
})
export default class NavbarMenu extends mixins(PrefixMixin) {
  private mobileGallery = false
  private isGallery: boolean = this.$route.path.includes('tab=GALLERY')
  private showTopNavbar = true
  private lastScrollPosition = 0
  private artistName = ''
  private showMobileSearchBar = false
  private isBurgerMenuOpened = false

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

  toggleSearchBarDisplay() {
    this.showMobileSearchBar = !this.showMobileSearchBar
  }

  closeBurgerMenu() {
    if (this.isBurgerMenuOpened) {
      this.isBurgerMenuOpened = false
    }
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

@include tablet {
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

@media only screen and (min-width: 1024px) and (max-width: 1100px) {
  div#NavHistoryBrowser {
    display: none;
  }
}

@media only screen and (min-width: 1024px) and (max-width: 1200px) {
  a#NavCreate {
    display: none;
  }
}

@media only screen and (min-width: 1024px) and (max-width: 1250px) {
  div#NavChainSelect {
    display: none;
  }
}

@media only screen and (min-width: 1024px) and (max-width: 1340px) {
  div#NavLocaleChanger {
    display: none;
  }
}

@include touch {
  .navbar {
    .navbar-item,
    .custom-navbar-item {
      margin-left: 0 !important;
    }
    .navbar-dropdown .b-tooltip {
      width: 100%;
    }
    #NavProfile {
      margin-left: 0;
      .dropdown-trigger .button {
        width: 100vw;
        background: $primary;
      }
    }
    .dropdown.is-mobile-modal > .dropdown-menu {
      -webkit-transform: translate3d(-50%, 10%, 0);
      transform: translate3d(-50%, 10%, 0);
    }
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
          height: 40px;
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

  .custom-navbar-item {
    margin-left: 0.5em;
  }

  .logo {
    border: none !important;
    background: transparent;
    @include tablet {
      margin-left: 0;
    }
  }

  .navbar-brand {
    align-items: center;
  }

  .navbar-start {
    flex: 1;
    margin-top: 24px;
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
    background-color: transparent;
    box-shadow: none;
    min-width: 350px;
    margin: 0 1rem;
    input {
      border: inherit;
      background-color: rgba(41, 41, 47, 0.5);
      &::placeholder {
        color: #898991 !important;
      }
      &:focus {
        box-shadow: none !important;
        border-top: $sleek-primary-border;
      }
    }
  }
  .search-navbar-container-mobile {
    position: fixed;
    left: 0;
    width: 100%;

    input {
      background-color: rgba(41, 41, 47);
      padding: 0;
      z-index: 1;
      &:focus {
        box-shadow: none !important;
        border-top: 2px solid $primary;
        background: rgba(41, 41, 47);
      }
    }
  }
}
</style>
