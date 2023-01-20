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
        <KodaBetaLogoDark v-if="isDarkMode" width="143" height="42" />
        <KodaBetaLogo v-else width="143" height="42" />
      </b-navbar-item>
      <div
        class="is-hidden-desktop is-flex is-flex-grow-1 is-align-items-center is-justify-content-flex-end"
        @click="closeBurgerMenu">
        <!-- <HistoryBrowser class="navbar-item" /> -->
        <div
          v-if="showSearchOnNavbar"
          class="mobile-nav-search-btn mr-2"
          @click="showMobileSearchBar">
          <SearchMobileNavbarIconDark v-if="isDarkMode" />
          <SearchMobileNavbarIcon v-else />
        </div>

        <div v-show="openMobileSearchBar">
          <div
            class="fixed-stack is-flex is-align-items-center is-justify-content-space-between p-2">
            <Search
              ref="mobilSearchRef"
              hide-filter
              class="is-flex-grow-1 mt-3" />
            <b-button class="cancel-btn" @click="hideMobileSearchBar">
              {{ $t('cancel') }}
            </b-button>
          </div>
        </div>
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
    <template #end>
      <ExploreDropdown
        v-if="!isMobile"
        class="navbar-explore custom-navbar-item"
        data-cy="explore" />
      <MobileExpandableSection v-if="isMobile" :title="$t('explore')">
        <NavbarExploreOptions />
      </MobileExpandableSection>

      <CreateDropdown
        v-show="isCreateVisible"
        class="navbar-create custom-navbar-item ml-0"
        data-cy="create"
        :is-mobile="isMobile"
        :chain="chain" />
      <StatsDropdown
        class="navbar-stats custom-navbar-item"
        data-cy="stats"
        :is-mobile="isMobile"
        :chain="chain" />

      <ChainSelectDropdown
        v-if="!isMobile"
        id="NavChainSelect"
        class="navbar-chain custom-navbar-item"
        data-cy="chain-select" />
      <template v-if="isMobile">
        <MobileLanguageOption v-if="!account" />
        <MobileExpandableSection
          v-if="account"
          :no-padding="true"
          :title="$t('account')"
          icon="user-circle"
          icon-family="fa">
          <b-navbar-item
            :to="`/${urlPrefix}/u/${account}`"
            data-cy="hot"
            tag="nuxt-link">
            {{ $t('profile.page') }}
          </b-navbar-item>
          <b-navbar-item
            :to="{ name: 'identity' }"
            data-cy="hot"
            tag="nuxt-link">
            {{ $t('identity.page') }}
          </b-navbar-item>
          <b-navbar-item data-cy="hot" tag="nuxt-link" to="/settings">
            {{ $t('settings') }}
          </b-navbar-item>
          <MobileLanguageOption />
          <MobileNavbarProfile
            id="NavProfile"
            @closeBurgerMenu="closeBurgerMenu" />
        </MobileExpandableSection>
        <MobileExpandableSection
          v-if="account"
          :no-padding="true"
          :title="$t('wallet')"
          icon="wallet">
          <b-navbar-item class="navbar-item--noBorder">
            <div class="has-text-grey is-size-7 mt-2">
              {{ $t('profileMenu.wallet') }}
            </div>
            <Identity
              :address="account"
              class="navbar__address is-size-6"
              hide-identity-popover />

            <hr aria-role="menuitem" class="dropdown-divider" />

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

            <hr aria-role="menuitem" class="dropdown-divider" />

            <div
              aria-role="menuitem"
              class="is-flex is-justify-content-space-between"
              custom
              paddingless>
              <ConnectWalletButton
                label="general.change_account"
                variant="connect-dropdown"
                class="menu-item is-size-7 mr-3 w-100"
                @closeBurgerMenu="closeBurgerMenu" />
              <NeoButton
                class="button is-size-7 is-capitalized w-100"
                :label="$t('profileMenu.disconnect')"
                variant="connect-dropdown"
                @click.native="disconnect()" />
            </div>
          </b-navbar-item>
        </MobileExpandableSection>
        <ColorModeButton class="navbar-item" />

        <div v-if="!account" id="NavProfile">
          <ConnectWalletButton
            class="button-connect-wallet"
            variant="connect"
            @closeBurgerMenu="closeBurgerMenu" />
        </div>
      </template>
      <ProfileDropdown
        v-if="!isMobile"
        id="NavProfile"
        :chain="chain"
        data-cy="profileDropdown"
        @closeBurgerMenu="closeBurgerMenu" />
    </template>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Ref, Watch, mixins } from 'nuxt-property-decorator'
import BasicImage from '@/components/shared/view/BasicImage.vue'
import MobileExpandableSection from '@/components/navbar/MobileExpandableSection.vue'
import NavbarExploreOptions from '@/components/navbar/NavbarExploreOptions.vue'
import Identity from '@/components/identity/IdentityIndex.vue'
import ProfileDropdown from '~/components/navbar/ProfileDropdown.vue'
import Search from '@/components/search/Search.vue'
import ExploreDropdown from '~/components/navbar/ExploreDropdown.vue'
import CreateDropdown from '~/components/navbar/CreateDropdown.vue'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import ColorModeButton from '~/components/common/ColorModeButton.vue'
import MobileLanguageOption from '~/components/navbar/MobileLanguageOption.vue'
import { createVisible } from '@/utils/config/permision.config'
import { identityStore } from '@/utils/idbStore'
import AuthMixin from '@/utils/mixins/authMixin'
import ExperimentMixin from '@/utils/mixins/experimentMixin'
import ChainSelectDropdown from '~/components/navbar/ChainSelectDropdown.vue'
import StatsDropdown from '~/components/navbar/StatsDropdown.vue'
import MobileNavbarProfile from '~/components/navbar/MobileNavbarProfile.vue'
import ConnectWalletButton from '~/components/shared/ConnectWalletButton.vue'
import { getKusamaAssetId } from '~/utils/api/bsx/query'
import { clearSession } from '~/utils/cachingStrategy'
import { NeoButton } from '@kodadot1/brick'

@Component({
  components: {
    NeoButton,
    Search,
    Identity,
    BasicImage,
    MobileExpandableSection,
    ProfileDropdown,
    ExploreDropdown,
    CreateDropdown,
    ChainSelectDropdown,
    StatsDropdown,
    MobileNavbarProfile,
    NavbarExploreOptions,
    ConnectWalletButton,
    ColorModeButton,
    MobileLanguageOption,

    KodaBetaLogoDark: () => import('@/assets/Koda_Beta_dark.svg?inline'),
    KodaBetaLogo: () => import('@/assets/Koda_Beta.svg?inline'),
    SearchMobileNavbarIconDark: () =>
      import('@/assets/search-mobile-navbar-dark.svg?inline'),
    SearchMobileNavbarIcon: () =>
      import('@/assets/search-mobile-navbar.svg?inline'),
  },
})
export default class NavbarMenu extends mixins(
  PrefixMixin,
  AuthMixin,
  ExperimentMixin
) {
  public showTopNavbar = true
  public openMobileSearchBar = false
  private fixedTitleNavAppearDistance = 85
  private lastScrollPosition = 0
  private artistName = ''
  public isBurgerMenuOpened = false
  private isMobile = window.innerWidth < 1024

  @Ref('mobilSearchRef') readonly mobilSearchRef

  get account() {
    return this.$store.getters.getAuthAddress
  }

  get chain(): string {
    return this.urlPrefix
  }

  get tokens() {
    return ['', getKusamaAssetId(this.urlPrefix)]
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

  get isSnek(): boolean {
    return this.urlPrefix === 'snek'
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

  get isDarkMode() {
    return (
      this.$colorMode.preference === 'dark' ||
      document.documentElement.className.includes('dark-mode')
    )
  }

  get showSearchOnNavbar(): boolean {
    return !this.isLandingPage || !this.showTopNavbar || this.isBurgerMenuOpened
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
    this.setBodyScroll(!this.isBurgerMenuOpened)
  }

  async fetchArtistIdentity(address) {
    const identity = await get(address, identityStore)
    if (identity && identity.display) {
      this.artistName = identity.display
    }
  }

  onScroll() {
    const currentScrollPosition = document.documentElement.scrollTop
    const searchBarPosition = document
      .getElementById('networkList')
      ?.getBoundingClientRect()?.top
    if (currentScrollPosition <= 0) {
      this.showTopNavbar = true
      return
    }
    if (Math.abs(currentScrollPosition - this.lastScrollPosition) < 30) {
      return
    }
    if (this.isLandingPage && searchBarPosition) {
      this.showTopNavbar = searchBarPosition > this.fixedTitleNavAppearDistance
    } else {
      this.showTopNavbar =
        currentScrollPosition < this.fixedTitleNavAppearDistance
    }
    this.lastScrollPosition = currentScrollPosition
  }
  setBodyScroll(allowScroll: boolean) {
    this.$nextTick(() => {
      const body = document.querySelector('body') as HTMLBodyElement
      if (allowScroll) {
        body.classList.remove('is-clipped')
      } else {
        body.classList.add('is-clipped')
      }
    })
  }

  showMobileSearchBar() {
    this.openMobileSearchBar = true
    this.$nextTick(() => {
      this.mobilSearchRef?.focusInput()
    })
    this.setBodyScroll(false)
  }

  hideMobileSearchBar() {
    this.openMobileSearchBar = false
    this.setBodyScroll(true)
  }

  closeBurgerMenu() {
    this.isBurgerMenuOpened = false
  }

  handleResize() {
    this.isMobile = window.innerWidth < 1024
  }

  mounted() {
    window.addEventListener('scroll', this.onScroll)
    document.body.style.overflowY = 'initial'
    window.addEventListener('resize', this.handleResize)
  }

  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll)
    this.setBodyScroll(true)
    document.documentElement.classList.remove('is-clipped-touch')
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>
