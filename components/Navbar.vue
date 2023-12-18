<template>
  <nav
    role="navigation"
    aria-label="main navigation"
    class="navbar is-fixed-top is-spaced"
    :class="{
      'is-active': isMobileNavbarOpen,
    }">
    <div class="container items-center" :class="{ 'is-fluid': !isMobile }">
      <!-- BRAND -->
      <div class="navbar-brand">
        <nuxt-link to="/" class="navbar-item logo nuxt-link-active">
          <img
            :src="logoSrc"
            alt="First NFT market explorer on Kusama and Polkadot" />
        </nuxt-link>
        <div
          class="is-hidden-desktop flex flex-grow items-center justify-end"
          @click="closeBurgerMenu">
          <NeoButton
            v-if="isMobileNavbarOpen || showSearchOnNavbar || isTinyMobile"
            class="mobile-nav-search-btn mr-2"
            icon="magnifying-glass"
            @click="showMobileSearchBar" />

          <div v-show="openMobileSearchBar">
            <div class="fixed-stack flex items-center justify-between p-2">
              <Search
                v-if="isMobile"
                ref="mobilSearchRef"
                hide-filter
                class="flex-grow" />
              <NeoButton
                variant="text"
                class="p-3 is-shadowless no-border capitalize is-clickable"
                @click="hideMobileSearchBar">
                {{ $t('cancel') }}
              </NeoButton>
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
          <div
            v-if="showSearchOnNavbar"
            class="navbar-item is-expanded flex justify-center">
            <Search
              v-if="!isMobile"
              class="search-navbar flex-grow pb-0 is-hidden-touch"
              hide-filter
              search-column-class="flex-grow" />
          </div>
        </div>
        <!-- END NAV START -->

        <!-- NAV END -->
        <div class="navbar-end">
          <nuxt-link to="/ahp/drops" rel="nofollow">
            <div class="navbar-item" data-testid="drops">
              {{ $t('drops.title') }}

              <NeoIcon
                class="ml-1"
                icon="fire-flame-curved"
                pack="fass"
                variant="primary" />
            </div>
          </nuxt-link>

          <MobileExpandableSection
            v-if="isMobile"
            v-slot="{ onCloseMobileSubMenu }"
            :title="$t('explore')">
            <NavbarExploreOptions
              @closeMobileNavbar="showMobileNavbar"
              @closeMobileSubMenu="onCloseMobileSubMenu" />
          </MobileExpandableSection>
          <NavbarExploreDropdown
            v-else
            class="navbar-explore custom-navbar-item"
            data-testid="explore" />

          <a
            href="https://hello.kodadot.xyz"
            rel="nofollow noopener noreferrer"
            target="_blank"
            class="navbar-item"
            data-testid="learn">
            Learn
          </a>
          <CreateDropdown
            v-show="isCreateVisible"
            class="navbar-create custom-navbar-item ml-0"
            data-testid="create"
            :is-mobile="isMobile"
            :chain="urlPrefix"
            @closeMobileNavbar="showMobileNavbar" />

          <!-- commenting as part of #5889-->
          <!-- <StatsDropdown
          class="navbar-stats custom-navbar-item"
          data-testid="stats"
          :is-mobile="isMobile"
          :chain="urlPrefix" /> -->

          <MobileExpandableSection
            v-if="isMobile"
            v-slot="{ onCloseMobileSubMenu }"
            no-padding
            :title="$t('chainSelect', [chainName])">
            <NavbarChainOptions
              @select="handleMobileChainSelect"
              @closeMobileSubMenu="onCloseMobileSubMenu" />
          </MobileExpandableSection>

          <ChainSelectDropdown
            v-else
            id="NavChainSelect"
            class="navbar-chain custom-navbar-item"
            data-testid="chain-select" />

          <NotificationBoxButton
            v-if="account"
            data-testid="navbar-button-notification"
            :show-label="isMobile"
            @closeBurgerMenu="showMobileNavbar" />

          <ShoppingCartButton
            data-testid="navbar-button-cart"
            :show-label="isMobile"
            @closeBurgerMenu="showMobileNavbar" />

          <template v-if="isMobile">
            <template v-if="!account">
              <MobileExpandableSection
                v-slot="{ onCloseMobileSubMenu }"
                class="mobile-language"
                :no-padding="true"
                :title="$t('profileMenu.language')"
                icon="globe">
                <MobileLanguageOption
                  @closeLanguageOption="showMobileNavbar"
                  @closeMobileSubMenu="onCloseMobileSubMenu" />
              </MobileExpandableSection>
              <ColorModeButton class="navbar-item" />
            </template>
            <div
              v-else
              class="navbar-item"
              @click.stop="openWalletConnectModal">
              <span>
                {{ $t('profile.page') }}
                <NeoIcon icon="user-circle" class="icon" size="medium" />
              </span>
              <NeoIcon class="icon--right" icon="chevron-right" />
            </div>

            <div v-if="!account" id="NavProfile">
              <ConnectWalletButton
                class="button-connect-wallet"
                data-testid="navbar-button-connect-wallet"
                variant="connect"
                @closeBurgerMenu="showMobileNavbar" />
            </div>
          </template>

          <NavbarProfileDropdown
            v-if="!isMobile"
            id="NavProfile"
            :chain="urlPrefix"
            data-testid="navbar-profile-dropdown"
            @closeBurgerMenu="closeBurgerMenu" />
        </div>
        <!-- END NAV END -->
      </div>
      <!-- END MENU -->
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import { nextTick } from 'vue'
import { ConnectWalletModalConfig } from '@/components/common/ConnectWallet/useConnectWallet'
import ChainSelectDropdown from '@/components/navbar/ChainSelectDropdown.vue'
import CreateDropdown from '@/components/navbar/CreateDropdown.vue'
import MobileExpandableSection from '@/components/navbar/MobileExpandableSection.vue'
import MobileLanguageOption from '@/components/navbar/MobileLanguageOption.vue'
import NavbarChainOptions from '@/components/navbar/NavbarChainOptions.vue'
import NavbarExploreOptions from '@/components/navbar/NavbarExploreOptions.vue'
import NotificationBoxButton from '@/components/navbar/NotificationBoxButton.vue'
import Search from '@/components/search/Search.vue'
import ConnectWalletButton from '@/components/shared/ConnectWalletButton.vue'
import { useEventListener } from '@vueuse/core'

import { useIdentityStore } from '@/stores/identity'
import { getChainNameByPrefix } from '@/utils/chain'
import { createVisible } from '@/utils/config/permission.config'
import ShoppingCartButton from './navbar/ShoppingCartButton.vue'

const { neoModal } = useProgrammatic()
const showTopNavbar = ref(true)
const openMobileSearchBar = ref(false)
const fixedTitleNavAppearDistance = ref(85)
const lastScrollPosition = ref(0)
const isBurgerMenuOpened = ref(false)
const { width } = useWindowSize()
const isMobile = ref(window.innerWidth < 1024)
const isMobileWithoutTablet = ref(window.innerWidth < 768)
const isTinyMobile = computed(() => width.value < 480)
const { urlPrefix } = usePrefix()
const { isDarkMode } = useTheme()
const identityStore = useIdentityStore()
const isMobileNavbarOpen = ref(false)
const updateAuthBalanceTimer = ref()

const mobilSearchRef = ref<{ focusInput: () => void } | null>(null)

const route = useRoute()

const account = computed(() => identityStore.getAuthAddress)

const isCreateVisible = computed(() => createVisible(urlPrefix.value))
const isLandingPage = computed(
  () => route.name === 'index' || route.name === 'prefix',
)

const logoSrc = computed(() => {
  const variant = isMobile.value ? 'Koda' : 'Koda_Beta'
  const color = isDarkMode.value ? '_dark' : ''
  return `/${variant}${color}.svg`
})

const showSearchOnNavbar = computed(
  () =>
    !isLandingPage.value || !showTopNavbar.value || isBurgerMenuOpened.value,
)

const handleMobileChainSelect = () => {
  showMobileNavbar()
}

const openWalletConnectModal = (): void => {
  showMobileNavbar()

  neoModal.closeAll()
  neoModal.open({
    ...ConnectWalletModalConfig,
    ...(isMobileWithoutTablet.value ? { animation: 'none' } : {}),
  })
}

const showMobileNavbar = () => {
  document.body.classList.toggle('is-clipped')
  isMobileNavbarOpen.value = !isMobileNavbarOpen.value
  if (!isMobileNavbarOpen.value) {
    document.documentElement.scrollTop = lastScrollPosition.value
  }
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
  nextTick(() => {
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
  nextTick(() => {
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

const updateAuthBalance = () => {
  account.value && identityStore.fetchBalance({ address: account.value })
}

onMounted(() => {
  document.body.style.overflowY = 'initial'
  document.body.className = 'has-navbar-fixed-top has-spaced-navbar-fixed-top'
  updateAuthBalanceTimer.value = setInterval(updateAuthBalance, 30000)
})

onBeforeUnmount(() => {
  setBodyScroll(true)
  document.documentElement.classList.remove('is-clipped-touch')
  clearInterval(updateAuthBalanceTimer.value)
})
useEventListener(window, 'scroll', onScroll)
useEventListener(window, 'resize', handleResize)
</script>

<style lang="scss" scoped>
:deep(.navbar-explore) {
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
