<template>
  <div>
    <div v-if="!isMobile">
      <b-dropdown
        v-if="chain === 'bsx' || chain === 'snek'"
        aria-role="list"
        data-cy="stats"
        :triggers="['click']">
        <template #trigger>
          <div class="navbar-item" data-cy="stats">
            {{ $t('stats') }}
          </div>
        </template>
        <b-dropdown-item has-link>
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
        <b-dropdown-item has-link>
          <nuxt-link data-cy="series-insight" to="/series-insight">
            Series</nuxt-link
          >
        </b-dropdown-item>
      </b-dropdown>
      <b-dropdown v-if="chain === 'rmrk'" data-cy="stats" :triggers="['click']">
        <template #trigger>
          <div class="navbar-item" data-cy="stats">
            {{ $t('stats') }}
          </div>
        </template>
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

    <MobileExpandableSection
      v-if="isMobile"
      :no-padding="true"
      :title="$t('stats')">
      <template>
        <template v-if="chain === 'bsx' || chain === 'snek'">
          <b-navbar-item
            data-cy="global-offers"
            :to="`${
              accountId
                ? `/${urlPrefix}/offers?target=${accountId}`
                : `/${urlPrefix}/offers`
            }`"
            tag="nuxt-link">
            {{ $t('navbar.globalOffers') }}
          </b-navbar-item>
          <b-navbar-item
            data-cy="offers-stats"
            :to="`/${urlPrefix}/stats`"
            tag="nuxt-link">
            {{ $t('navbar.offerStats') }}
          </b-navbar-item>
          <b-navbar-item
            data-cy="series-insight"
            to="/series-insight"
            tag="nuxt-link">
            {{ $t('series.label') }}
          </b-navbar-item>
        </template>
        <template v-if="chain === 'rmrk'">
          <b-navbar-item data-cy="spotlight" to="/spotlight" tag="nuxt-link">
            {{ $t('spotlight.page') }}
          </b-navbar-item>
          <b-navbar-item
            data-cy="series-insight"
            to="/series-insight"
            tag="nuxt-link">
            {{ $t('series.label') }}
          </b-navbar-item>
          <b-navbar-item data-cy="sales" to="/sales" tag="nuxt-link">
            {{ $t('sales.page') }}
          </b-navbar-item>
          <b-navbar-item data-cy="hot" to="/hot" tag="nuxt-link">
            {{ $t('hot.label') }}
          </b-navbar-item>
        </template>
      </template>
    </MobileExpandableSection>
  </div>
</template>
<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import { getChainTestList } from '~/utils/constants'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import AuthMixin from '~~/utils/mixins/authMixin'
import { isMobileDevice } from '~~/utils/extension'
import MobileExpandableSection from '@/components/navbar/MobileExpandableSection.vue'

@Component({
  components: {
    MobileExpandableSection,
  },
})
export default class NavbarCreate extends mixins(PrefixMixin, AuthMixin) {
  @Prop({ type: String }) chain!: string

  public isMobile = window.innerWidth < 1024 ? true : isMobileDevice

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
<style lang="scss">
.navbar-stats {
  .dropdown {
    width: 100%;
  }
}
</style>
