<template>
  <div>
    <div v-if="!isMobile">
      <b-dropdown
        v-if="showSnekBsxOptions"
        aria-role="list"
        data-cy="stats"
        :triggers="['click']">
        <template #trigger>
          <div class="navbar-item" data-cy="stats">
            {{ $t('stats') }}
          </div>
        </template>
        <b-dropdown-item has-link>
          <nuxt-link data-cy="global-offers" :to="offersUrl">
            {{ $t('navbar.globalOffers') }}
          </nuxt-link>
        </b-dropdown-item>
        <b-dropdown-item has-link>
          <nuxt-link data-cy="offers-stats" :to="statsUrl">
            {{ $t('navbar.offerStats') }}
          </nuxt-link>
        </b-dropdown-item>
        <b-dropdown-item has-link>
          <nuxt-link data-cy="series-insight" to="/series-insight">
            Series</nuxt-link
          >
        </b-dropdown-item>
      </b-dropdown>
      <b-dropdown
        v-if="chain === 'rmrk' || chain === 'rmrk2'"
        data-cy="stats"
        :triggers="['click']">
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

    <MobileExpandableSection v-else :no-padding="true" :title="$t('stats')">
      <template>
        <template v-if="showSnekBsxOptions">
          <b-navbar-item
            data-cy="global-offers"
            :to="offersUrl"
            tag="nuxt-link">
            {{ $t('navbar.globalOffers') }}
          </b-navbar-item>
          <b-navbar-item data-cy="offers-stats" :to="statsUrl" tag="nuxt-link">
            {{ $t('navbar.offerStats') }}
          </b-navbar-item>
          <b-navbar-item
            data-cy="series-insight"
            to="/series-insight"
            tag="nuxt-link">
            {{ $t('series.label') }}
          </b-navbar-item>
        </template>
        <template v-if="chain === 'rmrk' || chain === 'rmrk2'">
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
<script lang="ts" setup>
const MobileExpandableSection = defineAsyncComponent(
  () => import('@/components/navbar/MobileExpandableSection.vue')
)
const { accountId } = useAuth()

const { urlPrefix } = usePrefix()
const props = defineProps<{
  chain?: string
  isMobile?: boolean
}>()

const offersUrl = computed(
  () =>
    `${
      accountId.value
        ? `/${urlPrefix.value}/offers?target=${accountId.value}`
        : `/${urlPrefix.value}/offers`
    }`
)
const statsUrl = computed(() => `/${urlPrefix.value}/stats`)

const showSnekBsxOptions = computed(
  () => props.chain === 'bsx' || props.chain === 'snek'
)
</script>
<style lang="scss">
.navbar-stats {
  .dropdown {
    width: 100%;
  }
}
</style>
