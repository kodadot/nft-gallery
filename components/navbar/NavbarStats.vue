<template>
  <div>
    <b-dropdown
      v-if="isBsx || isSnek"
      id="NavStats"
      class="navbar-chain"
      data-cy="stats"
      :triggers="['click', 'hover']">
      <template #trigger>
        <div class="navbar-item" data-cy="stats">
          {{ $t('stats') }}
        </div>
      </template>
      <b-dropdown-item has-link data-cy="global-offers">
        <nuxt-link
          :to="`${
            accountId
              ? `/${urlPrefix}/offers?target=${accountId}`
              : `/${urlPrefix}/offers`
          }`">
          {{ $t('navbar.globalOffers') }}
        </nuxt-link>
      </b-dropdown-item>
      <b-dropdown-item has-link data-cy="offers-stats">
        <nuxt-link :to="`/${urlPrefix}/stats`">
          {{ $t('navbar.offerStats') }}
        </nuxt-link>
      </b-dropdown-item>
    </b-dropdown>
    <b-dropdown
      v-if="isRmrk"
      id="NavStats"
      class="navbar-chain"
      data-cy="stats"
      :triggers="['click', 'hover']">
      <template #trigger>
        <div class="navbar-item" data-cy="stats">
          {{ $t('stats') }}
        </div>
      </template>
      <template>
        <b-dropdown-item has-link aria-role="menu-item" data-cy="spotlight">
          <nuxt-link to="/spotlight">
            {{ $t('spotlight.page') }}
          </nuxt-link>
        </b-dropdown-item>
        <b-dropdown-item has-link data-cy="series-insight">
          <nuxt-link to="/series-insight"> Series</nuxt-link>
        </b-dropdown-item>
        <b-dropdown-item has-link data-cy="sales">
          <nuxt-link to="/sales"> Sales</nuxt-link>
        </b-dropdown-item>
        <b-dropdown-item has-link data-cy="hot">
          <nuxt-link to="/hot"> Hot</nuxt-link>
        </b-dropdown-item>
      </template>
    </b-dropdown>
  </div>
</template>
<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { getChainTestList } from '~/utils/constants'
import PrefixMixin from '@/utils/mixins/prefixMixin'

import AuthMixin from '~~/utils/mixins/authMixin'
import { createVisible } from '~/utils/config/permision.config'

@Component({})
export default class NavbarCreate extends mixins(PrefixMixin, AuthMixin) {
  get options() {
    const availableUrlPrefixes = this.$store.getters['availableUrlPrefixes']

    if (!this.$config.dev) {
      return availableUrlPrefixes.filter(
        (urlPrefix) => !getChainTestList().includes(urlPrefix.value as string)
      )
    }
    return availableUrlPrefixes
  }

  get isBsx(): boolean {
    return this.urlPrefix === 'bsx'
  }

  get isSnek(): boolean {
    return this.urlPrefix === 'snek' || this.urlPrefix === 'bsx'
  }

  get(): boolean {
    return createVisible(this.urlPrefix)
  }

  get isRmrk(): boolean {
    return this.urlPrefix === 'rmrk' || this.urlPrefix === 'westend'
  }
}
</script>
