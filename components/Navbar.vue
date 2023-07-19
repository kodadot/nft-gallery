<template>
  <nav
    role="navigation"
    aria-label="main navigation"
    class="navbar is-fixed-top is-spaced"
    :class="{
      'navbar-shrink': !showTopNavbar,
      'is-active': isMobileNavbarOpen,
    }">
    <div class="container" :class="{ 'is-fluid': !isMobile }">
      <!-- BRAND -->
      <div class="navbar-brand">
        <nuxt-link to="/" class="navbar-item logo nuxt-link-active">
          <img
            :src="logoSrc"
            alt="First NFT market explorer on Kusama and Polkadot"
            width="143"
            height="42" />
        </nuxt-link>
        <div
          class="is-hidden-desktop is-flex is-flex-grow-1 is-align-items-center is-justify-content-flex-end"
          @click="closeBurgerMenu">
          <img
            v-if="isMobileNavbarOpen || showSearchOnNavbar"
            class="mobile-nav-search-btn mr-2"
            :src="
              isDarkMode
                ? '/search-mobile-navbar-dark.svg'
                : '/search-mobile-navbar.svg'
            "
            alt="search"
            @click="showMobileSearchBar" />

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

        <!-- BURGER MENU -->
        <a
          role="button"
          class="navbar-burger"
          :class="{ 'is-active': isMobileNavbarOpen }"
          aria-label="menu"
          aria-expanded="false"
          data-target="MainNavbar"
          @click="showMobileNavbar">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
        <!-- END BURGER MENU -->
      </div>
      <!-- END BRAND -->

      <!-- MENU -->
      <div
        id="MainNavbar"
        class="navbar-menu"
        :class="{ 'is-active': isMobileNavbarOpen }">
        <!-- NAV START -->
        <div class="navbar-start">
          <div v-if="showSearchOnNavbar" class="navbar-item is-expanded">
            <Search
              class="search-navbar is-flex-grow-1 pb-0 is-hidden-touch"
              hide-filter
              search-column-class="is-flex-grow-1" />
          </div>
        </div>
        <!-- END NAV START -->

        <!-- NAV END -->
        <div class="navbar-end">
          <nuxt-link to="/stmn/drops" rel="nofollow">
            <div class="navbar-item" data-cy="drops">
              {{ $t('drops.title') }}

              <NeoIcon
                class="ml-1"
                icon="fire-flame-curved"
                custom-size="fa-solid"
                pack="fa-sharp"
                variant="primary" />
            </div>
          </nuxt-link>
          <template v-if="isExploreVisible">
            <MobileExpandableSection v-if="isMobile" :title="$t('explore')">
              <NavbarExploreOptions @closeMobileNavbar="showMobileNavbar" />
            </MobileExpandableSection>

            <ExploreDropdown
              v-else
              class="navbar-explore custom-navbar-item"
              data-cy="explore" />
          </template>

          <a
            href="https://hello.kodadot.xyz"
            rel="nofollow noopener noreferrer"
            target="_blank"
            class="navbar-item"
            data-cy="learn">
            {{ $t('learn') }}
          </a>
          <CreateDropdown
            v-show="isCreateVisible"
            class="navbar-create custom-navbar-item ml-0"
            data-cy="create"
            :is-mobile="isMobile"
            :chain="urlPrefix"
            @closeMobileNavbar="showMobileNavbar" />

          <!-- commenting as part of #5889-->
          <!-- <StatsDropdown
          class="navbar-stats custom-navbar-item"
          data-cy="stats"
          :is-mobile="isMobile"
          :chain="urlPrefix" /> -->

          <MobileExpandableSection
            v-if="isMobile"
            no-padding
            :title="$t('chainSelect', [chainName])">
            <NavbarChainOptions />
          </MobileExpandableSection>

          <ChainSelectDropdown
            v-else
            id="NavChainSelect"
            class="navbar-chain custom-navbar-item"
            data-cy="chain-select" />

          <NotificationBoxButton
            v-if="account"
            :show-label="isMobile"
            @closeBurgerMenu="showMobileNavbar" />

          <template v-if="isMobile">
            <template v-if="!account">
              <MobileLanguageOption @closeLanguageOption="showMobileNavbar" />
              <ColorModeButton class="navbar-item" />
            </template>
            <div
              v-else
              class="navbar-item"
              @click.stop="openWalletConnectModal">
              <span>
                {{ $t('profile.page') }}
                <NeoIcon icon="user-circle" />
              </span>
              <NeoIcon class="icon--right" icon="chevron-right" pack="fas" />
            </div>

            <div v-if="!account" id="NavProfile">
              <ConnectWalletButton
                class="button-connect-wallet"
                variant="connect"
                @closeBurgerMenu="showMobileNavbar" />
            </div>
          </template>

          <ProfileDropdown
            v-if="!isMobile"
            id="NavProfile"
            :chain="urlPrefix"
            data-cy="profileDropdown"
            @closeBurgerMenu="closeBurgerMenu" />
        </div>
        <!-- END NAV END -->
      </div>
      <!-- END MENU -->
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'
import { BModalConfig } from 'buefy/types/components'

import KodaBeta from '@/assets/Koda_Beta.svg'
import KodaBetaDark from '@/assets/Koda_Beta_dark.svg'
import { ConnectWalletModalConfig } from '@/components/common/ConnectWallet/useConnectWallet'
import ChainSelectDropdown from '@/components/navbar/ChainSelectDropdown.vue'
import CreateDropdown from '@/components/navbar/CreateDropdown.vue'
import ExploreDropdown from '@/components/navbar/ExploreDropdown.vue'
import MobileExpandableSection from '@/components/navbar/MobileExpandableSection.vue'
import MobileLanguageOption from '@/components/navbar/MobileLanguageOption.vue'
import NavbarChainOptions from '@/components/navbar/NavbarChainOptions.vue'
import NavbarExploreOptions from '@/components/navbar/NavbarExploreOptions.vue'
import NotificationBoxButton from '@/components/navbar/NotificationBoxButton.vue'
import ProfileDropdown from '@/components/navbar/ProfileDropdown.vue'
import Search from '@/components/search/Search.vue'
import ConnectWalletButton from '@/components/shared/ConnectWalletButton.vue'

import { useIdentityStore } from '@/stores/identity'
import { getChainNameByPrefix } from '@/utils/chain'
import { createVisible, explorerVisible } from '@/utils/config/permision.config'

const { $buefy, $nextTick } = useNuxtApp()
const instance = getCurrentInstance()
const showTopNavbar = ref(true)
const openMobileSearchBar = ref(false)
const fixedTitleNavAppearDistance = ref(85)
const lastScrollPosition = ref(0)
const isBurgerMenuOpened = ref(false)
const isMobile = ref(window.innerWidth < 1024)
const { urlPrefix } = usePrefix()
const { isDarkMode } = useTheme()
const identityStore = useIdentityStore()
const isMobileNavbarOpen = ref(false)

const mobilSearchRef = ref<{ focusInput: () => void } | null>(null)

const route = useRoute()

const account = computed(() => identityStore.getAuthAddress)

const isCreateVisible = computed(() => createVisible(urlPrefix.value))
const isExploreVisible = computed(() => explorerVisible(urlPrefix.value))
const isLandingPage = computed(() => route.name === 'index')

const logoSrc = computed(() => (isDarkMode.value ? KodaBetaDark : KodaBeta))

const showSearchOnNavbar = computed(
  () => !isLandingPage.value || !showTopNavbar.value || isBurgerMenuOpened.value
)

const openWalletConnectModal = (): void => {
  showMobileNavbar()

  $buefy.modal.open({
    parent: instance?.proxy,
    ...ConnectWalletModalConfig,
  } as unknown as BModalConfig)
}

const showMobileNavbar = () => {
  document.body.classList.toggle('is-clipped')
  isMobileNavbarOpen.value = !isMobileNavbarOpen.value
}

const closeBurgerMenu = () => {
  isBurgerMenuOpened.value = false
}

watch([isBurgerMenuOpened], () => {
  setBodyScroll(!isBurgerMenuOpened.value)
})

const onScroll = () => {
  const currentScrollPosition = document.documentElement.scrollTop
  const searchBarPosition = document
    .getElementById('networkList')
    ?.getBoundingClientRect()?.top
  if (currentScrollPosition <= 0) {
    showTopNavbar.value = true
    return
  }
  if (Math.abs(currentScrollPosition - lastScrollPosition.value) < 30) {
    return
  }
  if (isLandingPage.value && searchBarPosition) {
    showTopNavbar.value = searchBarPosition > fixedTitleNavAppearDistance.value
  } else {
    showTopNavbar.value =
      currentScrollPosition < fixedTitleNavAppearDistance.value
  }
  lastScrollPosition.value = currentScrollPosition
}

const setBodyScroll = (allowScroll: boolean) => {
  $nextTick(() => {
    const body = document.querySelector('body') as HTMLBodyElement
    if (allowScroll) {
      body.classList.remove('is-clipped')
    } else {
      body.classList.add('is-clipped')
    }
  })
}

const showMobileSearchBar = () => {
  openMobileSearchBar.value = true
  $nextTick(() => {
    mobilSearchRef.value?.focusInput()
  })
  setBodyScroll(false)
}

const hideMobileSearchBar = () => {
  openMobileSearchBar.value = false
  setBodyScroll(true)
}

const handleResize = () => {
  isMobile.value = window.innerWidth < 1024
}

const chainName = computed(() => getChainNameByPrefix(urlPrefix.value))

onMounted(() => {
  window.addEventListener('scroll', onScroll)
  document.body.style.overflowY = 'initial'
  document.body.className = 'has-navbar-fixed-top has-spaced-navbar-fixed-top'
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  setBodyScroll(true)
  document.documentElement.classList.remove('is-clipped-touch')
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
:deep .navbar-explore {
  .navbar-item {
    height: 4.5rem;
  }
  .o-drop__menu {
    margin: 0;
  }
  .o-drop__item {
    padding: 1.5rem 2rem;
    min-width: 18.75rem;

    &:hover {
      background-color: unset;
    }
  }
}
</style>
