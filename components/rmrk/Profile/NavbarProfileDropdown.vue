<template>
  <b-dropdown position="is-bottom-left" aria-role="menu">
    <template #trigger>
      <span v-if="account" class="is-mobile is-vcentered navbar__avatar">
        <!-- <Avatar class="navbar__avatar-icon" :value="account" :size="34" /> -->
        <b-button type="is-primary" icon-left="user">
          <Identity
            :address="account"
            class="navbar__address"
            hide-identity-popover />
        </b-button>
      </span>

      <template v-else>
        <ConnectWalletButton />
      </template>
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

      <hr class="dropdown-divider" aria-role="menuitem" />
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
      <b-dropdown-item v-if="showIncommingOffers" has-link aria-role="menuitem">
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

      <hr class="dropdown-divider" aria-role="menuitem" />

      <b-dropdown-item custom aria-role="menuitem">
        <div v-if="isSnek">
          <div class="has-text-left has-text-grey is-size-7">
            {{ $t('general.balance') }}
          </div>
          <TokenMoney
            v-for="token in tokens"
            :key="token.id"
            :value="token.balance"
            :token-id="token.id" />
        </div>
        <AccountBalance v-else class="is-size-7" />
      </b-dropdown-item>

      <hr class="dropdown-divider" aria-role="menuitem" />

      <b-dropdown-item custom aria-role="menuitem">
        <b-field>
          <p class="control">
            <ConnectWalletButton label="general.change_account" />
          </p>
          <p class="control">
            <b-button
              class="navbar__sign-out-button"
              icon-left="sign-out-alt"
              @click="disconnect()" />
          </p>
        </b-field>
      </b-dropdown-item>
    </template>
  </b-dropdown>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk'

import Avatar from '@/components/shared/Avatar.vue'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import AuthMixin from '@/utils/mixins/authMixin'
import useApiMixin from '@/utils/mixins/useApiMixin'
import { getAsssetBalance, getKusamaAssetId } from '@/utils/api/bsx/query'

const components = {
  Avatar,
  ConnectWalletButton: () =>
    import('@/components/shared/ConnectWalletButton.vue'),
  Identity: () => import('@/components/identity/IdentityIndex.vue'),
  AccountBalance: () => import('@/components/shared/AccountBalance.vue'),
  TokenMoney: () => import('@/components/bsx/format/TokenMoney.vue'),
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

  // private tokens = [
  //   { id: '0', balance: 0 },
  //   { id: '5', balance: 0 },
  // ]

  get account() {
    return this.$store.getters.getAuthAddress
  }

  set account(account: string) {
    this.$store.dispatch('setAuth', { address: account })
  }

  created() {
    this.updateAssetsBalance()
  }

  private async updateAssetsBalance() {
    const api = await this.useApi()
    const result = await Promise.all(
      this.tokens.map(
        async (token) => await getAsssetBalance(api, this.accountId, token.id)
      )
    )
    result.forEach((balance, idx) => {
      this.$set(this.tokens, idx, {
        ...this.tokens[idx],
        balance: balance,
      })
    })
  }

  get realBalance() {
    return this.$store.getters.getAuthBalance
  }

  get tokenAmount() {
    return this.$store.getters.getTokenBalanceOf('0')
  }

  get tokens() {
    return [
      { id: '0', balance: 0 },
      { id: getKusamaAssetId(this.urlPrefix), balance: 0 },
    ]
  }

  public disconnect() {
    this.$store.dispatch('setAuth', { address: '' }) // null not working
    localStorage.removeItem('kodaauth')
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
  }

  &__avatar-icon {
    cursor: pointer;

    @include until($desktop) {
      padding-right: 0.75rem;
    }
  }

  &__address {
    text-transform: none;
  }
  &__sign-out-button {
    border-top: $sleek-primary-border !important;
    border-bottom: 0;
    border-right: 0;
    border-left: 0;
  }
}
</style>
