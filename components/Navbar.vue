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
        hideFilter
        showDefaultSuggestions
        class="search-navbar is-flex-grow-1 pb-0 is-hidden-touch"
        searchColumnClass="is-flex-grow-1" />
    </template>
    <template #end v-if="showTopNavbar || isBurgerMenuOpened">
      <LazyHistoryBrowser
        class="custom-navbar-item navbar-link-background is-hidden-touch"
        id="NavHistoryBrowser" />
      <b-navbar-dropdown
        arrowless
        collapsible
        id="NavCreate"
        v-show="isCreateVisible"
        data-cy="create-dropdown">
        <template #label>
          <span>{{ $t('create') }}</span>
        </template>
        <b-tooltip
          label="Start by creating your collection and add NFTs to it"
          position="is-right">
          <b-navbar-item
            tag="nuxt-link"
            :to="`/${urlPrefix}/create`"
            data-cy="classic">
            {{ $t('classic') }}
          </b-navbar-item>
        </b-tooltip>
        <template v-if="isRmrk">
          <b-tooltip
            label="Simplified process to create your NFT in a single step"
            position="is-right"
            style="display: block">
            <b-navbar-item
              tag="nuxt-link"
              :to="`/${urlPrefix}/mint`"
              data-cy="simple">
              {{ $t('simple') }}
            </b-navbar-item>
          </b-tooltip>
          <b-tooltip
            label="AI powered process to create your NFT"
            position="is-right"
            append-to-body>
            <b-navbar-item
              tag="nuxt-link"
              :to="`/${urlPrefix}/creative`"
              data-cy="creative">
              {{ $t('creative') }}
            </b-navbar-item>
          </b-tooltip>
        </template>
      </b-navbar-dropdown>
      <b-navbar-item
        tag="nuxt-link"
        :to="`/${urlPrefix}/explore`"
        data-cy="explore">
        <span>{{ $t('explore') }}</span>
      </b-navbar-item>
      <b-navbar-item
        v-if="isBsx"
        tag="nuxt-link"
        :to="`/${urlPrefix}/stats`"
        data-cy="stats">
        <span>{{ $t('stats') }}</span>
      </b-navbar-item>
      <b-navbar-dropdown
        arrowless
        collapsible
        v-if="isRmrk"
        id="NavStats"
        data-cy="stats">
        <template #label>
          <span>{{ $t('stats') }}</span>
        </template>
        <template>
          <b-navbar-item tag="nuxt-link" to="/spotlight" data-cy="spotlight">
            {{ $t('spotlight.page') }}
          </b-navbar-item>
          <b-navbar-item
            tag="nuxt-link"
            to="/series-insight"
            data-cy="series-insight">
            Series
          </b-navbar-item>
          <b-navbar-item tag="nuxt-link" to="/sales" data-cy="sales">
            Sales
          </b-navbar-item>
          <b-navbar-item tag="nuxt-link" to="/hot" data-cy="hot">
            Hot
          </b-navbar-item>
        </template>
      </b-navbar-dropdown>
      <LazyChainSelect class="navbar-item has-dropdown" id="NavChainSelect" />
      <LazySwitchLocale
        class="navbar-item has-dropdown"
        id="NavLocaleChanger"
        data-cy="localChanger" />
      <ColorModeButton />
      <NavbarProfileDropdown
        :isRmrk="isRmrk"
        :isBsx="isBsx"
        id="NavProfile"
        data-cy="profileDropdown" />
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
import ColorModeButton from '@/components/common/ColorModeButton.vue'
import { createVisible } from '@/utils/config/permision.config'

import { identityStore } from '@/utils/idbStore'
import { get } from 'idb-keyval'

@Component({
  components: {
    NavbarProfileDropdown,
    Search,
    Identity,
    BasicImage,
    ColorModeButton,
  },
})
export default class NavbarMenu extends mixins(PrefixMixin) {
  protected mobileGallery = false
  protected showTopNavbar = true
  private isGallery: boolean = this.$route.path.includes('tab=GALLERY')
  private fixedTitleNavAppearDistance = 200
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

  get isBsx(): boolean {
    return this.urlPrefix === 'bsx'
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

  get isCreateVisible(): boolean {
    return createVisible(this.urlPrefix)
  }

  get isTargetPage(): boolean {
    // why?
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
    this.showTopNavbar =
      currentScrollPosition < this.fixedTitleNavAppearDistance
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

// Reserved for future adjustments

//@media only screen and (min-width: 1024px) and (max-width: 1200px) {
//  a#NavCreate {
//    display: none;
//  }
//}

//@media only screen and (min-width: 1024px) and (max-width: 1250px) {
//  div#NavChainSelect {
//    display: none;
//  }
//}

//@media only screen and (min-width: 1024px) and (max-width: 1340px) {
//  div#NavLocaleChanger {
//    display: none;
//  }
//}

@include touch {
  .navbar {
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
  background-color: inherit;
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

  &.navbar-shrink {
    box-shadow: none;
    max-height: 70px;
    padding-top: 6px !important;
    padding-bottom: 6px !important;
    background-color: rgba(12, 12, 12, 0.7) !important;
  }

  .navbar-item {
    text-transform: capitalize;
    font-weight: 500;
    margin: 0.5em;
  }

  .custom-navbar-item {
    margin-left: 0.5em;
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
  }

  .search-navbar {
    background-color: transparent;
    box-shadow: none;
    width: min-content;
    min-width: 140px;
    margin: 0 1rem;
    .icon {
      color: $placeholder-color !important;
    }
    input {
      border: inherit;
      background-color: #e5e5e5;
      &::placeholder {
        color: $placeholder-color !important;
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
      background-color: $search-navbar-background-color;
      padding: 0;
      z-index: 1;
      &:focus {
        box-shadow: none !important;
        border-top: 2px solid $primary;
        background: $search-navbar-background-color;
      }
    }
  }
}
</style>
