<template>
  <div class="is-flex is-align-items-center">
    <b-dropdown
      position="is-bottom-left"
      aria-role="menu"
      class="ml-2"
      :close-on-click="false">
      <template #trigger>
        <span class="is-mobile is-vcentered navbar__avatar">
          <Avatar
            v-if="account"
            :value="account"
            class="navbar__avatar-icon"
            :size="27" />

          <svg
            v-else
            width="27"
            height="27"
            viewBox="0 0 27 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_2684_707)">
              <rect width="27" height="27" rx="13.5" fill="white" />
              <g filter="url(#filter0_d_2684_707)">
                <rect
                  x="3.375"
                  y="18.7681"
                  width="20.4146"
                  height="16.4634"
                  rx="8.23171"
                  fill="white" />
                <rect
                  x="4.125"
                  y="19.5181"
                  width="18.9146"
                  height="14.9634"
                  rx="7.48171"
                  stroke="black"
                  stroke-width="1.5" />
              </g>
              <g filter="url(#filter1_d_2684_707)">
                <circle cx="13.6643" cy="11.3599" r="5.7622" fill="white" />
                <circle
                  cx="13.6643"
                  cy="11.3599"
                  r="5.0122"
                  stroke="black"
                  stroke-width="1.5" />
              </g>
            </g>
            <rect
              x="0.75"
              y="0.75"
              width="25.5"
              height="25.5"
              rx="12.75"
              stroke="black"
              stroke-width="1.5" />
            <defs>
              <filter
                id="filter0_d_2684_707"
                x="3.375"
                y="18.7681"
                width="21.2583"
                height="17.3071"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha" />
                <feOffset dx="0.84375" dy="0.84375" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_2684_707" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_2684_707"
                  result="shape" />
              </filter>
              <filter
                id="filter1_d_2684_707"
                x="7.9021"
                y="5.59766"
                width="12.3682"
                height="12.3682"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha" />
                <feOffset dx="0.84375" dy="0.84375" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_2684_707" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_2684_707"
                  result="shape" />
              </filter>
              <clipPath id="clip0_2684_707">
                <rect width="27" height="27" rx="13.5" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </span>
      </template>

      <template v-if="account && !isLanguageMenu">
        <b-dropdown-item has-link aria-role="menuitem">
          <nuxt-link :to="`/${urlPrefix}/u/${account}`">
            {{ $t('profile.page') }}
          </nuxt-link>
        </b-dropdown-item>
        <b-dropdown-item has-link aria-role="menuitem">
          <nuxt-link to="/settings">{{ $t('settings') }}</nuxt-link>
        </b-dropdown-item>
        <template v-if="isRmrk">
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
          <b-dropdown-item has-link aria-role="menuitem">
            <nuxt-link to="/teleport">{{ $t('navbar.teleport') }}</nuxt-link>
          </b-dropdown-item>
          <b-dropdown-item has-link aria-role="menuitem">
            <nuxt-link to="/transform">{{ $t('transform') }}</nuxt-link>
          </b-dropdown-item>
        </template>
        <b-dropdown-item
          v-if="showIncommingOffers"
          has-link
          aria-role="menuitem">
          <nuxt-link :to="`/${urlPrefix}/incomingoffers`">{{
            $t('incomingOffers')
          }}</nuxt-link>
        </b-dropdown-item>
        <b-dropdown-item v-if="isSnek" has-link aria-role="menuitem">
          <nuxt-link :to="`/${urlPrefix}/assets`">{{ $t('assets') }}</nuxt-link>
        </b-dropdown-item>
        <b-dropdown-item has-link aria-role="menuitem">
          <nuxt-link to="/transfer">{{ $t('transfer') }}</nuxt-link>
        </b-dropdown-item>
      </template>

      <!-- <b-dropdown-item v-if="!isLanguageMenu" has-link aria-role="menuitem">
        <span @click="isLanguageMenu = !isLanguageMenu">{{
          $t('profileMenu.language')
        }}</span>
      </b-dropdown-item> -->
      <b-dropdown-item v-if="!isLanguageMenu" has-link aria-role="menuitem">
        <ColorModeButton />
      </b-dropdown-item>

      <template v-if="isLanguageMenu">
        <b-dropdown-item
          v-for="lang in langsFlags"
          :key="lang.value"
          aria-role="listitem"
          :value="userLang"
          :class="{ 'is-active': userLang === lang.value }"
          @click="setUserLang(lang.value)">
          {{ lang.flag }}
          {{ lang.label }}
        </b-dropdown-item>
      </template>
    </b-dropdown>

    <b-dropdown
      position="is-bottom-left"
      aria-role="menu"
      class="ml-4"
      :close-on-click="false">
      <template #trigger>
        <span v-if="account" class="is-mobile is-vcentered navbar__avatar">
          <svg
            width="28"
            height="23"
            viewBox="0 0 28 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <rect
              x="0.75"
              y="1.25"
              width="23.5"
              height="20.5"
              fill="white"
              stroke="black"
              stroke-width="1.5" />
            <g filter="url(#filter0_d_2684_755)">
              <rect x="15" y="7.5" width="12" height="9" fill="white" />
              <rect
                x="15.75"
                y="8.25"
                width="10.5"
                height="7.5"
                stroke="black"
                stroke-width="1.5" />
            </g>
            <rect x="19" y="10.5" width="3" height="3" rx="1.5" fill="black" />
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
        </span>

        <template v-else>
          <ConnectWalletButton />
        </template>
      </template>

      <template v-if="account">
        <b-dropdown-item custom aria-role="menuitem">
          <div class="has-text-grey is-size-7 mt-2">Wallet</div>
          <Identity
            :address="account"
            class="navbar__address"
            hide-identity-popover />
        </b-dropdown-item>

        <hr class="dropdown-divider" aria-role="menuitem" />

        <b-dropdown-item custom aria-role="menuitem">
          <div v-if="isSnek">
            <div class="has-text-left has-text-grey is-size-7">
              {{ $t('general.balance') }}
            </div>
            <SimpleAccountBalance
              v-for="token in tokens"
              :key="token"
              :token-id="token" />
          </div>
          <AccountBalance v-else class="is-size-7" />
        </b-dropdown-item>

        <hr class="dropdown-divider" aria-role="menuitem" />

        <b-dropdown-item custom aria-role="menuitem" paddingless class="ml-5">
          <p class="control">
            <b-button
              class="navbar__sign-out-button menu-item mb-2"
              @click="disconnect()">
              {{ $t('profileMenu.disconnect') }}
            </b-button>
          </p>
        </b-dropdown-item>
      </template>
    </b-dropdown>
  </div>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk'

import Avatar from '@/components/shared/Avatar.vue'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import AuthMixin from '@/utils/mixins/authMixin'
import useApiMixin from '@/utils/mixins/useApiMixin'
import { getKusamaAssetId } from '@/utils/api/bsx/query'
import { clearSession } from '@/utils/cachingStrategy'

const components = {
  Avatar,
  ConnectWalletButton: () =>
    import('@/components/shared/ConnectWalletButton.vue'),
  Identity: () => import('@/components/identity/IdentityIndex.vue'),
  AccountBalance: () => import('@/components/shared/AccountBalance.vue'),
  SimpleAccountBalance: () =>
    import('@/components/shared/SimpleAccountBalance.vue'),
  ColorModeButton: () => import('@/components/common/ColorModeButton.vue'),
}

@Component({ components })
export default class NavbarProfileDropdown extends mixins(
  PrefixMixin,
  AuthMixin,
  useApiMixin
) {
  @Prop() public value!: any
  @Prop() public isRmrk!: boolean
  @Prop() public showIncommingOffers!: boolean
  @Prop() public isSnek!: boolean
  public isLanguageMenu = false

  get langsFlags(): string {
    return this.$store.getters['lang/getLangsFlags']
  }

  get userFlag(): string {
    return this.$store.getters['lang/getUserFlag']
  }

  get userLang(): string {
    this.$i18n.locale = this.$store.getters['lang/getUserLang']
    return this.$store.getters['lang/getUserLang']
  }

  get tokens() {
    return ['', getKusamaAssetId(this.urlPrefix)]
  }

  get account() {
    return this.$store.getters.getAuthAddress
  }

  set account(account: string) {
    this.$store.dispatch('setAuth', { address: account })
  }

  setUserLang(value: string) {
    this.$store.dispatch('lang/setLanguage', { userLang: value })
    this.$i18n.locale = value
  }

  public disconnect() {
    this.$store.dispatch('setAuth', { address: '' }) // null not working
    clearSession()
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
}
</script>

<style lang="scss">
@import 'bulma/sass/utilities/mixins.sass';
@import '@/styles/abstracts/variables';

.navbar {
  &__identity {
    @include from($desktop) {
      display: none;
    }
  }

  &__button {
    border: 0;
    border-top: 2px solid $primary !important;
  }

  &__avatar {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  &__avatar-icon {
    border: 1.5px solid $black;
    border-radius: 24.5px;
    @include until($desktop) {
      padding-right: 0.75rem;
    }
  }

  &__address {
    text-transform: none;
    color: $k-blue;
  }
  &__sign-out-button {
    border: 1px solid $black;
    box-shadow: 4px 4px 0px $black;
    border-radius: 0;
    &:hover {
      border: 1px solid $black;
    }
  }
}
</style>
