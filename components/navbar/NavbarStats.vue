<template>
  <div>
    <b-dropdown
      v-if="isBsx || isSnek"
      aria-role="list"
      data-cy="stats"
      :triggers="['hover']">
      <template #trigger>
        <div class="navbar-item" data-cy="stats">
          {{ $t('stats') }}
        </div>
      </template>
      <b-dropdown-item has->
        <nuxt-link
          data-cy="global-offers"
          :to="`${
            accountId
              ? `/${urlPrefix}/offers?target=${accountId}`
              : `/${urlPrefix}/offers`
          }`">
          {{ $t('navbar.globalOffers') }}
        </nuxt-link>
      </b-dropdown-item>
      <b-dropdown-item has-link>
        <nuxt-link data-cy="offers-stats" :to="`/${urlPrefix}/stats`">
          {{ $t('navbar.offerStats') }}
        </nuxt-link>
      </b-dropdown-item>
    </b-dropdown>
    <b-dropdown v-if="isRmrk" data-cy="stats" :triggers="['hover']">
      <template #trigger>
        <div class="navbar-item" data-cy="stats">
          {{ $t('stats') }}
        </div>
      </template>
      =
      <b-dropdown-item has-link aria-role="menu-item">
        <nuxt-link data-cy="spotlight" to="/spotlight">
          {{ $t('spotlight.page') }}
        </nuxt-link>
      </b-dropdown-item>
      <b-dropdown-item has-link>
        <nuxt-link data-cy="series-insight" to="/series-insight">
          Series</nuxt-link
        >
      </b-dropdown-item>
      <b-dropdown-item has-link>
        <nuxt-link data-cy="sales" to="/sales"> Sales</nuxt-link>
      </b-dropdown-item>
      <b-dropdown-item has-link>
        <nuxt-link data-cy="hot" to="/hot"> Hot</nuxt-link>
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>
<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import { getChainTestList } from '~/utils/constants'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import AuthMixin from '~~/utils/mixins/authMixin'

@Component({})
export default class NavbarCreate extends mixins(PrefixMixin, AuthMixin) {
  // prop for isBsx isRmrk and isSnek
  @Prop({ type: Boolean }) isBsx!: boolean
  @Prop({ type: Boolean }) isRmrk!: boolean
  @Prop({ type: Boolean }) isSnek!: boolean

  get options() {
    const availableUrlPrefixes = this.$store.getters['availableUrlPrefixes']

    if (!this.$config.dev) {
      return availableUrlPrefixes.filter(
        (urlPrefix) => !getChainTestList().includes(urlPrefix.value as string)
      )
    }
    return availableUrlPrefixes
  }
}
</script>
