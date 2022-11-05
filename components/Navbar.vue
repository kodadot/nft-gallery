<template>
  <b-navbar
    fixed-top
    spaced
    wrapper-class="container"
    close-on-click
    mobile-burger
    :active.sync="isBurgerMenuOpened"
    :class="{ 'navbar-shrink': !showTopNavbar }">
    <template #brand>
      <b-navbar-item tag="nuxt-link" :to="{ path: '/' }" class="logo">
        <img
          :src="logoSrc"
          alt="First NFT market explorer on Kusama and Polkadot"
          width="166"
          height="34" />
      </b-navbar-item>
      <div
        class="is-hidden-desktop is-flex is-flex-grow-1 is-align-items-center is-justify-content-flex-end"
        @click="closeBurgerMenu">
        <!-- <HistoryBrowser class="navbar-item" /> -->
        <b-button
          v-if="showSearchOnNavbar"
          icon-left="search"
          class="mr-2 mobile-nav-search-btn is-flex"
          @click="showMobileSearchBar">
        </b-button>
        <Search
          ref="mobilSearchRef"
          hide-filter
          class="mt-5 search-navbar-container-mobile" />
      </div>
    </template>
    <template #start>
      <div v-if="showSearchOnNavbar" class="navbar-item is-expanded">
        <Search
          hide-filter
          class="search-navbar is-flex-grow-1 pb-0 is-hidden-touch"
          search-column-class="is-flex-grow-1" />
      </div>
    </template>
    <template #end>
      <!-- <LazyHistoryBrowser
        id="NavHistoryBrowser"
        class="custom-navbar-item navbar-link-background is-hidden-touch" /> -->

      <NavbarExplore />

      <b-navbar-dropdown
        v-show="isCreateVisible"
        id="NavCreate"
        hoverable
        arrowless
        collapsible
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

      <b-navbar-dropdown
        v-if="isBsx || isSnek"
        id="NavStats"
        arrowless
        collapsible
        data-cy="stats">
        <template #label>
          <span>{{ $t('stats') }}</span>
        </template>
        <b-navbar-item
          tag="nuxt-link"
          :to="`${
            accountId
              ? `/${urlPrefix}/offers?target=${accountId}`
              : `/${urlPrefix}/offers`
          }`"
          data-cy="global-offers">
          {{ $t('navbar.globalOffers') }}
        </b-navbar-item>
        <b-navbar-item
          tag="nuxt-link"
          :to="`/${urlPrefix}/stats`"
          data-cy="offers-stats">
          <span> {{ $t('navbar.offerStats') }}</span>
        </b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-dropdown
        v-if="isRmrk"
        id="NavStats"
        arrowless
        collapsible
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
      <LazyChainSelect
        id="NavChainSelect"
        class="navbar-item has-dropdown"
        data-cy="chain-select" />
      <NavbarProfileDropdown
        id="NavProfile"
        class="ml-2"
        :is-rmrk="isRmrk"
        :show-incomming-offers="isBsx || isSnek"
        :is-snek="isSnek"
        data-cy="profileDropdown"
        @closeBurgerMenu="closeBurgerMenu" />
    </template>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Ref, mixins } from 'nuxt-property-decorator'
import { get } from 'idb-keyval'

import BasicImage from '@/components/shared/view/BasicImage.vue'
import Identity from '@/components/identity/IdentityIndex.vue'
import NavbarProfileDropdown from '@/components/rmrk/Profile/NavbarProfileDropdown.vue'
import Search from '@/components/search/Search.vue'
import NavbarExplore from '@/components/navbar/NavbarExplore.vue'
import KodaBetaDark from '@/assets/Koda_Beta_dark.svg'
import KodaBeta from '@/assets/Koda_Beta.svg'
import PrefixMixin from '@/utils/mixins/prefixMixin'

import { createVisible } from '@/utils/config/permision.config'
import { identityStore } from '@/utils/idbStore'
import AuthMixin from '~~/utils/mixins/authMixin'
import ExperimentMixin from '~~/utils/mixins/experimentMixin'

@Component({
  components: {
    NavbarProfileDropdown,
    Search,
    Identity,
    BasicImage,
    NavbarExplore,
  },
})
export default class NavbarMenu extends mixins(
  PrefixMixin,
  AuthMixin,
  ExperimentMixin
) {
  protected showTopNavbar = true
  private isGallery: boolean = this.$route.path.includes('tab=GALLERY')
  private fixedTitleNavAppearDistance = 200
  private lastScrollPosition = 0
  private artistName = ''
  private isBurgerMenuOpened = false
  @Ref('mobilSearchRef') readonly mobilSearchRef

  get isRmrk(): boolean {
    return this.urlPrefix === 'rmrk' || this.urlPrefix === 'westend'
  }

  get isBsx(): boolean {
    return this.urlPrefix === 'bsx'
  }

  get isSnek(): boolean {
    return this.urlPrefix === 'snek' || this.urlPrefix === 'bsx'
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

  get isLandingPage() {
    return this.$route.name === 'index'
  }

  get logoSrc() {
    return this.$colorMode.preference === 'dark' ? KodaBetaDark : KodaBeta
  }

  get showSearchOnNavbar(): boolean {
    return !this.isLandingPage || !this.showTopNavbar
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

  showMobileSearchBar() {
    this.mobilSearchRef?.focusInput()
  }

  closeBurgerMenu() {
    if (this.isBurgerMenuOpened) {
      this.isBurgerMenuOpened = false
    }
  }

  mounted() {
    window.addEventListener('scroll', this.onScroll)
  }

  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll)
  }
}
</script>
