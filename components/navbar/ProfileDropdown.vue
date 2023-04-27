<template>
  <div class="is-flex is-align-items-center">
    <b-dropdown
      position="is-bottom-left"
      aria-role="menu"
      :triggers="['hover']">
      <template #trigger>
        <a class="navbar-item" role="button">
          <Avatar
            v-if="account"
            :value="account"
            class="navbar__avatar-icon"
            :size="27" />
          <img v-else :src="profileIcon" />
        </a>
      </template>

      <template v-if="account">
        <b-dropdown-item has-link aria-role="menuitem">
          <nuxt-link :to="`/${urlPrefix}/u/${account}`">
            {{ $t('profile.page') }}
          </nuxt-link>
        </b-dropdown-item>
        <b-dropdown-item has-link aria-role="menuitem">
          <nuxt-link to="/settings">{{ $t('settings') }}</nuxt-link>
        </b-dropdown-item>
        <template v-if="chain === 'rmrk' || chain === 'ksm'">
          <b-dropdown-item has-link aria-role="menuitem">
            <a @click="showRampSDK">
              {{ $t('credit') }}
            </a>
          </b-dropdown-item>
          <b-dropdown-item has-link aria-role="menuitem">
            <nuxt-link :to="{ name: 'identity' }">
              {{ $t('identity.page') }}
            </nuxt-link>
          </b-dropdown-item>
        </template>
        <b-dropdown-item v-if="isSnekOrBsx" has-link aria-role="menuitem">
          <nuxt-link :to="`/${urlPrefix}/incomingoffers`"
            >{{ $t('incomingOffers') }}
          </nuxt-link>
        </b-dropdown-item>
        <b-dropdown-item v-if="isSnekOrBsx" has-link aria-role="menuitem">
          <nuxt-link :to="`/${urlPrefix}/assets`">{{ $t('assets') }}</nuxt-link>
        </b-dropdown-item>
        <b-dropdown-item has-link aria-role="menuitem">
          <nuxt-link to="/transfer">{{ $t('transfer') }}</nuxt-link>
        </b-dropdown-item>
        <b-dropdown-item has-link aria-role="menuitem">
          <nuxt-link to="/teleport-bridge"
            >{{ $t('navbar.teleportBridge') }}
          </nuxt-link>
        </b-dropdown-item>
      </template>

      <b-dropdown-item has-link aria-role="menuitem">
        <a class="is-flex is-align-items-center" @click="toggleLanguageMenu"
          >{{ $t('profileMenu.language') }}
          <svg
            width="14"
            height="13"
            class="ml-2"
            viewBox="0 0 14 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1 6.5C1 9.8138 3.6862 12.5 7 12.5C10.3138 12.5 13 9.8138 13 6.5C13 3.1862 10.3138 0.5 7 0.5C3.6862 0.5 1 3.1862 1 6.5Z"
              fill="white"
              stroke="black"
              stroke-width="0.9"
              stroke-linecap="round"
              stroke-linejoin="round" />
            <path
              d="M7.59993 0.530273C7.59993 0.530273 9.39993 2.90027 9.39993 6.50027C9.39993 10.1003 7.59993 12.4703 7.59993 12.4703M6.39993 12.4703C6.39993 12.4703 4.59993 10.1003 4.59993 6.50027C4.59993 2.90027 6.39993 0.530273 6.39993 0.530273M1.37793 8.60027H12.6219M1.37793 4.40027H12.6219"
              stroke="black"
              stroke-width="0.9"
              stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </a>
      </b-dropdown-item>
      <b-dropdown-item has-link aria-role="menuitem">
        <ColorModeButton />
      </b-dropdown-item>
    </b-dropdown>

    <a
      v-if="account"
      class="navbar-item"
      role="button"
      @click="toggleWalletConnectModal">
      <svg
        width="28"
        height="27"
        viewBox="0 0 28 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <rect
          x="0.75"
          y="1.25"
          width="23.5"
          height="20.5"
          fill="none"
          :stroke="isDarkMode ? 'white' : 'black'"
          stroke-width="1.5" />
        <g filter="url(#filter0_d_2684_755)">
          <rect
            x="15"
            y="7.5"
            width="12"
            height="9"
            :fill="isDarkMode ? 'black' : 'white'" />
          <rect
            x="15.75"
            y="8.25"
            width="10.5"
            height="7.5"
            :stroke="isDarkMode ? 'white' : 'black'"
            stroke-width="1.5" />
        </g>
        <rect
          x="19"
          y="10.5"
          width="3"
          height="3"
          rx="1.5"
          :fill="isDarkMode ? 'white' : 'black'" />
        <defs>
          <filter
            id="filter0_d_2684_755"
            x="15"
            y="7.5"
            width="13"
            height="10"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha" />
            <feOffset dx="1" dy="1" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_2684_755" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_2684_755"
              result="shape" />
          </filter>
        </defs>
      </svg>
    </a>

    <div v-else>
      <ConnectWalletButton
        class="button-connect-wallet px-4"
        variant="k-accent"
        no-shadow
        @toggleConnectModal="toggleWalletConnectModal" />
    </div>

    <b-dropdown
      ref="languageDropdown"
      position="is-bottom-left"
      aria-role="menu"
      :toggle="toggleLanguageMenu">
      <b-dropdown-item
        aria-role="listitem"
        class="is-active is-flex is-align-items-center"
        @click="toggleLanguageMenu">
        {{ $t('profileMenu.language') }}
        <svg
          width="14"
          height="13"
          class="ml-2"
          viewBox="0 0 14 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1 6.5C1 9.8138 3.6862 12.5 7 12.5C10.3138 12.5 13 9.8138 13 6.5C13 3.1862 10.3138 0.5 7 0.5C3.6862 0.5 1 3.1862 1 6.5Z"
            fill="white"
            stroke="black"
            stroke-width="0.9"
            stroke-linecap="round"
            stroke-linejoin="round" />
          <path
            d="M7.59993 0.530273C7.59993 0.530273 9.39993 2.90027 9.39993 6.50027C9.39993 10.1003 7.59993 12.4703 7.59993 12.4703M6.39993 12.4703C6.39993 12.4703 4.59993 10.1003 4.59993 6.50027C4.59993 2.90027 6.39993 0.530273 6.39993 0.530273M1.37793 8.60027H12.6219M1.37793 4.40027H12.6219"
            stroke="black"
            stroke-width="0.9"
            stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </b-dropdown-item>

      <b-dropdown-item
        v-for="lang in langsFlags"
        :key="lang.value"
        aria-role="listitem"
        has-link
        :value="userLang"
        :class="{ 'is-active': userLang === lang.value }"
        @click="setUserLang(lang.value)">
        <a
          >{{ lang.flag }}
          {{ lang.label }}
        </a>
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, mixins } from 'nuxt-property-decorator'
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk'
import { NeoButton } from '@kodadot1/brick'

import Avatar from '@/components/shared/Avatar.vue'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import AuthMixin from '@/utils/mixins/authMixin'
import useApiMixin from '@/utils/mixins/useApiMixin'
import { langsFlags as langsFlagsList } from '@/utils/config/i18n'
import { ConnectWalletModalConfig } from '@/components/common/ConnectWallet/useConnectWallet'
import { useLangStore } from '@/stores/lang'
import { useWalletStore } from '@/stores/wallet'
import { useIdentityStore } from '@/stores/identity'

const components = {
  Avatar,
  NeoButton,
  ConnectWalletButton: () =>
    import('@/components/shared/ConnectWalletButton.vue'),
  Identity: () => import('@/components/identity/IdentityIndex.vue'),
  AccountBalance: () => import('@/components/shared/AccountBalance.vue'),
  SimpleAccountBalance: () =>
    import('@/components/shared/SimpleAccountBalance.vue'),
  ColorModeButton: () => import('@/components/common/ColorModeButton.vue'),
  ProfileAssetsList: () =>
    import('@/components/rmrk/Profile/ProfileAssetsList.vue'),
}

@Component({ components })
export default class ProfileDropdown extends mixins(
  PrefixMixin,
  AuthMixin,
  useApiMixin
) {
  @Prop() public value!: any
  @Prop() public showIncomingOffers!: boolean
  @Prop() public chain!: string
  @Ref('languageDropdown') readonly languageDropdown
  private modal: { close: () => void; isActive?: boolean } | null = null

  get isDarkMode() {
    return (
      this.$colorMode.preference === 'dark' ||
      document.documentElement.className.includes('dark-mode')
    )
  }

  get profileIcon() {
    return this.isDarkMode ? '/profile-dark.svg' : '/profile.svg'
  }

  get langsFlags(): { value: string; flag: string; label: string }[] {
    return langsFlagsList
  }

  get identityStore() {
    return useIdentityStore()
  }

  get langStore() {
    return useLangStore()
  }

  get walletStore() {
    return useWalletStore()
  }

  get userLang(): string {
    this.$i18n.locale = this.langStore.language.userLang
    return this.langStore.language.userLang
  }

  get account() {
    return this.identityStore.getAuthAddress
  }

  set account(account: string) {
    this.identityStore.setAuth({ address: account })
  }

  public toggleWalletConnectModal(): void {
    if (this.modal?.isActive) {
      this.modal.close()
      this.modal = null
      return
    }
    this.modal = this.$buefy.modal.open({
      parent: this,
      ...ConnectWalletModalConfig,
    })

    this.closeBurgerMenu()
  }

  public closeBurgerMenu(): void {
    this.$emit('closeBurgerMenu')
  }

  setUserLang(value: string) {
    this.$i18n.locale = value
    this.langStore.setLanguage({ userLang: value })
  }

  public toggleLanguageMenu() {
    this.$refs.languageDropdown?.toggle()
  }

  public showRampSDK(): void {
    new RampInstantSDK({
      defaultAsset: 'KSM', // todo: prefix
      userAddress: this.account,
      hostAppName: 'KodaDot',
      hostApiKey: 'a99bfvomhhbvzy6thaycxbawz7d3pssuz2a8hsrc', // env
      hostLogoUrl: 'https://kodadot.xyz/apple-touch-icon.png',
      variant: 'desktop',
    }).show()
  }

  get isSnekOrBsx() {
    return this.chain === 'snek' || this.chain === 'bsx'
  }
}
</script>

<!-- <script setup lang="ts">
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk'
import { BModalComponent, BModalConfig } from 'buefy/types/components'
import type Vue from 'vue'
import { ModalProgrammatic as Modal } from 'buefy'
import { langsFlags } from '@/utils/config/i18n'
import { ConnectWalletModalConfig } from '@/components/common/ConnectWallet/useConnectWallet'
import { useLangStore } from '@/stores/lang'

const { accountId } = useAuth()
const { isDarkMode } = useTheme()
const { urlPrefix } = usePrefix()
const langStore = useLangStore()
const modal = ref<BModalComponent | null>()
const root = ref<Vue<Record<string, string>>>()
const emit = defineEmits(['closeBurgerMenu'])
const toggleLanguageMenu = ref(false)

const profileIcon = computed(() => isDarkMode.value ? '/profile-dark.svg' : '/profile.svg')
const isSnekOrBsx = computed(() => urlPrefix.value === 'snek' || urlPrefix.value === 'bsx')
const userLang = computed(() => langStore.language.userLang)

const toggleWalletConnectModal = () => {
  if (modal.value?.isActive) {
    modal.value.close()
    modal.value = null
    return
  }
  modal.value = Modal.open({
    parent: root?.value,
    ...ConnectWalletModalConfig,
  } as unknown as BModalConfig)
  emit('closeBurgerMenu')
}

const closeBurgerMenu = () => {
  emit('closeBurgerMenu')
}

const setUserLang = (value: string) => {
  langStore.setLanguage({ userLang: value })
}

const showRampSDK = () => {
  new RampInstantSDK({
    defaultAsset: 'KSM', // todo: prefix
    userAddress: accountId.value,
    hostAppName: 'KodaDot',
    hostApiKey: 'a99bfvomhhbvzy6thaycxbawz7d3pssuz2a8hsrc', // env
    hostLogoUrl: 'https://kodadot.xyz/apple-touch-icon.png',
    variant: 'desktop',
  }).show()
}
</script> -->
