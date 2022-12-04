<template>
  <div>
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
