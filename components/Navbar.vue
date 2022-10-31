<template>
  <b-navbar
    :active.sync="isBurgerMenuOpened"
    :class="{ 'navbar-shrink': !showTopNavbar }"
    close-on-click
    fixed-top
    mobile-burger
    spaced
    wrapper-class="container">
    <template #brand>
      <b-navbar-item :to="{ path: '/' }" class="logo" tag="nuxt-link">
        <img
          :src="logoSrc"
          alt="First NFT market explorer on Kusama and Polkadot"
          height="34"
          width="166" />
      </b-navbar-item>
      <div
        class="is-hidden-desktop is-flex is-flex-grow-1 is-align-items-center is-justify-content-flex-end"
        @click="closeBurgerMenu">
        <!-- <HistoryBrowser class="navbar-item" /> -->
        <b-button
          v-if="showSearchOnNavbar"
          class="mr-2 mobile-nav-search-btn is-flex"
          icon-left="search"
          @click="showMobileSearchBar">
        </b-button>
        <Search
          ref="mobilSearchRef"
          class="mt-5 search-navbar-container-mobile"
          hide-filter />
      </div>
    </template>
    <template #start>
      <div v-if="showSearchOnNavbar" class="navbar-item is-expanded">
        <Search
          class="search-navbar is-flex-grow-1 pb-0 is-hidden-touch"
          hide-filter
          search-column-class="is-flex-grow-1" />
      </div>
    </template>
    <template v-if="showTopNavbar || isBurgerMenuOpened" #end>
      <!-- <LazyHistoryBrowser
        id="NavHistoryBrowser"
        class="custom-navbar-item navbar-link-background is-hidden-touch" /> -->

      <NavbarExplore v-if="!isMobile" />
      <MobileExpandableSection v-else :title="$t('explore')">
        <NavbarExploreOptions />
      </MobileExpandableSection>

      <b-navbar-dropdown
        v-show="isCreateVisible"
        id="NavCreate"
        arrowless
        collapsible
        data-cy="create-dropdown"
        hoverable>
        <template #label>
          <span>{{ $t('create') }}</span>
        </template>
        <b-tooltip
          label="Start by creating your collection and add NFTs to it"
          position="is-right">
          <b-navbar-item
            :to="`/${urlPrefix}/create`"
            data-cy="classic"
            tag="nuxt-link">
            {{ $t('classic') }}
          </b-navbar-item>
        </b-tooltip>
        <template v-if="isRmrk">
          <b-tooltip
            label="Simplified process to create your NFT in a single step"
            position="is-right"
            style="display: block">
            <b-navbar-item
              :to="`/${urlPrefix}/mint`"
              data-cy="simple"
              tag="nuxt-link">
              {{ $t('simple') }}
            </b-navbar-item>
          </b-tooltip>
          <b-tooltip
            append-to-body
            label="AI powered process to create your NFT"
            position="is-right">
            <b-navbar-item
              :to="`/${urlPrefix}/creative`"
              data-cy="creative"
              tag="nuxt-link">
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
          :to="`${
            accountId
              ? `/${urlPrefix}/offers?target=${accountId}`
              : `/${urlPrefix}/offers`
          }`"
          data-cy="global-offers"
          tag="nuxt-link">
          {{ $t('navbar.globalOffers') }}
        </b-navbar-item>
        <b-navbar-item
          :to="`/${urlPrefix}/stats`"
          data-cy="offers-stats"
          tag="nuxt-link">
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
          <b-navbar-item data-cy="spotlight" tag="nuxt-link" to="/spotlight">
            {{ $t('spotlight.page') }}
          </b-navbar-item>
          <b-navbar-item
            data-cy="series-insight"
            tag="nuxt-link"
            to="/series-insight">
            Series
          </b-navbar-item>
          <b-navbar-item data-cy="sales" tag="nuxt-link" to="/sales">
            Sales
          </b-navbar-item>
          <b-navbar-item data-cy="hot" tag="nuxt-link" to="/hot">
            Hot
          </b-navbar-item>
        </template>
      </b-navbar-dropdown>
      <MobileLanguageOption v-if="isMobile && !account" />
      <MobileExpandableSection
        v-if="isMobile && account"
        :no-padding="true"
        :title="$t('account')"
        icon="person-circle-outline">
        <b-navbar-item
          :to="`/${urlPrefix}/u/${account}`"
          data-cy="hot"
          tag="nuxt-link">
          {{ $t('profile.page') }}
        </b-navbar-item>
        <b-navbar-item :to="{ name: 'identity' }" data-cy="hot" tag="nuxt-link">
          {{ $t('identity.page') }}
        </b-navbar-item>
        <b-navbar-item data-cy="hot" tag="nuxt-link" to="/settings">
          {{ $t('settings') }}
        </b-navbar-item>
        <MobileLanguageOption />
        <MobileNavbarProfile id="NavProfile" />
      </MobileExpandableSection>
      <MobileExpandableSection
        v-if="isMobile && account"
        :no-padding="true"
        :title="$t('wallet')"
        icon="wallet-outline">
        <b-navbar-item class="navbar-item--noBorder">
          <div class="has-text-grey is-size-7 mt-2">
            {{ $t('profileMenu.wallet') }}
          </div>
          <Identity
            :address="account"
            class="navbar__address is-size-6"
            hide-identity-popover />

          <hr aria-role="menuitem" class="dropdown-divider mx-4" />

          <div v-if="isSnek">
            <div class="has-text-left has-text-grey is-size-7">
              {{ $t('general.balance') }}
            </div>
            <SimpleAccountBalance
              v-for="token in tokens"
              :key="token"
              :token-id="token"
              class="is-size-6" />
          </div>
          <AccountBalance v-else class="is-size-7" />

          <hr aria-role="menuitem" class="dropdown-divider mx-4" />

          <div
            aria-role="menuitem"
            class="is-flex is-justify-content-center"
            custom
            paddingless>
            <b-button
              class="navbar__sign-out-button menu-item mb-4 is-size-7"
              @click="disconnect()">
              {{ $t('profileMenu.disconnect') }}
            </b-button>
          </div>
        </b-navbar-item>
      </MobileExpandableSection>
      <ColorModeButton v-if="isMobile" />

      <div v-if="!account && isMobile" id="NavProfile">
        <ConnectWalletButton
          class="button-connect-wallet"
          @closeBurgerMenu="closeBurgerMenu" />
      </div>

      <NavbarProfileDropdown
        v-if="!isMobile"
        id="NavProfile"
        :is-rmrk="isRmrk"
        :is-snek="isSnek"
        :show-incomming-offers="isBsx || isSnek"
        class="ml-2"
        data-cy="profileDropdown"
        @closeBurgerMenu="closeBurgerMenu" />
    </template>
    <template v-else #end>
      <div class="image is-32x32 mr-2">
        <BasicImage
          v-show="inCollectionPage && currentCollection.image"
          :alt="navBarTitle"
          :src="currentCollection.image"
          rounded />
      </div>
      <div class="title is-4">{{ navBarTitle }}</div>
    </template>
  </b-navbar>
</template>

<script lang="ts">
import KodaBeta from '@/assets/Koda_Beta.svg'
import KodaBetaDark from '@/assets/Koda_Beta_dark.svg'
import Identity from '@/components/identity/IdentityIndex.vue'
import MobileExpandableSection from '@/components/navbar/MobileExpandableSection.vue'
import NavbarExplore from '@/components/navbar/NavbarExplore.vue'
import NavbarExploreOptions from '@/components/navbar/NavbarExploreOptions.vue'
import NavbarProfileDropdown from '@/components/rmrk/Profile/NavbarProfileDropdown.vue'
import Search from '@/components/search/Search.vue'
import BasicImage from '@/components/shared/view/BasicImage.vue'
import { createVisible } from '@/utils/config/permision.config'
import { isMobileDevice } from '@/utils/extension'
import { identityStore } from '@/utils/idbStore'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import { get } from 'idb-keyval'
import { Component, Ref, Watch, mixins } from 'nuxt-property-decorator'
import ColorModeButton from '~/components/common/ColorModeButton.vue'
import MobileLanguageOption from '~/components/navbar/MobileLanguageOption.vue'
import MobileNavbarProfile from '~/components/navbar/MobileNavbarProfile.vue'
import ConnectWalletButton from '~/components/shared/ConnectWalletButton.vue'
import { getKusamaAssetId } from '~/utils/api/bsx/query'
import { clearSession } from '~/utils/cachingStrategy'
import AuthMixin from '~~/utils/mixins/authMixin'
import ExperimentMixin from '~~/utils/mixins/experimentMixin'

@Component({
  components: {
    MobileLanguageOption,
    NavbarProfileDropdown,
    Search,
    Identity,
    BasicImage,
    MobileExpandableSection,
    ConnectWalletButton,
    MobileNavbarProfile,
    NavbarExploreOptions,
    ColorModeButton,
    NavbarExplore,
  },
})
export default class NavbarMenu extends mixins(
  PrefixMixin,
  AuthMixin,
  ExperimentMixin
) {
  @Ref('mobilSearchRef') readonly mobilSearchRef
  protected showTopNavbar = true
  private isMobile = isMobileDevice
  private isGallery: boolean = this.$route.path.includes('tab=GALLERY')
  private fixedTitleNavAppearDistance = 200
  private lastScrollPosition = 0
  private artistName = ''
  private isBurgerMenuOpened = false

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

  get account() {
    return this.$store.getters.getAuthAddress
  }

  get inGalleryDetailPage(): boolean {
    return this.$route.name === 'rmrk-gallery-id'
  }

  get tokens() {
    return ['', getKusamaAssetId(this.urlPrefix)]
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

  public disconnect() {
    this.$store.dispatch('setAuth', { address: '' }) // null not working
    clearSession()
  }

  @Watch('isBurgerMenuOpened')
  onBurgerMenuOpenedChanged() {
    document.documentElement.style.overflow = this.isBurgerMenuOpened
      ? 'hidden'
      : 'auto'
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
