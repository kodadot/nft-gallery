<template>
  <b-navbar
    ref="root"
    :active.sync="isBurgerMenuOpened"
    :class="{ 'navbar-shrink': !showTopNavbar }"
    close-on-click
    fixed-top
    mobile-burger
    spaced
    :wrapper-class="{ container: true, 'is-fluid': !isMobile }">
    <template #brand>
      <b-navbar-item :to="{ path: '/' }" class="logo" tag="nuxt-link">
        <img
          :src="logoSrc"
          alt="First NFT market explorer on Kusama and Polkadot"
          width="143"
          height="42" />
      </b-navbar-item>
      <div
        class="is-hidden-desktop is-flex is-flex-grow-1 is-align-items-center is-justify-content-flex-end"
        @click="closeBurgerMenu">
        <img
          v-if="showSearchOnNavbar"
          class="mobile-nav-search-btn mr-2"
          :src="
            isDarkMode
              ? '/search-mobile-navbar-dark.svg'
              : '/search-mobile-navbar.svg'
          "
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
      <nuxt-link to="/stmn/drops">
        <div class="navbar-item" data-cy="drops">
          {{ $t('drops.drops') }}

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
          <NavbarExploreOptions />
        </MobileExpandableSection>

        <ExploreDropdown
          v-else
          class="navbar-explore custom-navbar-item"
          data-cy="explore" />
      </template>

      <a
        href="https://hello.kodadot.xyz"
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
        :chain="urlPrefix" />

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
        @closeBurgerMenu="closeBurgerMenu" />
      <template v-if="isMobile">
        <MobileLanguageOption v-if="!account" />
        <div
          v-if="account"
          class="navbar-item"
          @click.stop="openWalletConnectModal">
          <span>
            {{ $t('profile.page') }}
            <NeoIcon icon="user-circle" />
          </span>
          <NeoIcon class="icon--right" icon="chevron-right" pack="fas" />
        </div>
        <ColorModeButton v-if="!account" class="navbar-item" />

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
        :chain="urlPrefix"
        data-cy="profileDropdown"
        @closeBurgerMenu="closeBurgerMenu" />
    </template>
  </b-navbar>
</template>

<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'
import { BModalConfig } from 'buefy/types/components'
import type Vue from 'vue'

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
const root = ref<Vue<Record<string, string>>>()
const showTopNavbar = ref(true)
const openMobileSearchBar = ref(false)
const fixedTitleNavAppearDistance = ref(85)
const lastScrollPosition = ref(0)
const isBurgerMenuOpened = ref(false)
const isMobile = ref(window.innerWidth < 1024)
const { urlPrefix } = usePrefix()
const { isDarkMode } = useTheme()
const identityStore = useIdentityStore()

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
  closeBurgerMenu()

  $buefy.modal.open({
    parent: root?.value,
    ...ConnectWalletModalConfig,
  } as unknown as BModalConfig)
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

const closeBurgerMenu = () => {
  isBurgerMenuOpened.value = false
}

const handleResize = () => {
  isMobile.value = window.innerWidth < 1024
}

const chainName = computed(() => getChainNameByPrefix(urlPrefix.value))

onMounted(() => {
  window.addEventListener('scroll', onScroll)
  document.body.style.overflowY = 'initial'
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  setBodyScroll(true)
  document.documentElement.classList.remove('is-clipped-touch')
  window.removeEventListener('resize', handleResize)
})
</script>
