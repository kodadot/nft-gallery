<template>
  <div>
    <div v-if="!isMobile">
      <NeoDropdown
        v-if="showSnekBsxOptions"
        aria-role="list"
        data-testid="stats"
        :triggers="['click']">
        <template #trigger>
          <div class="navbar-item" data-testid="stats">
            {{ $t('stats') }}
          </div>
        </template>
        <NeoDropdownItem>
          <nuxt-link data-testid="global-offers" :to="offersUrl">
            {{ $t('navbar.globalOffers') }}
          </nuxt-link>
        </NeoDropdownItem>
        <NeoDropdownItem>
          <nuxt-link data-testid="offers-stats" :to="statsUrl">
            {{ $t('navbar.offerStats') }}
          </nuxt-link>
        </NeoDropdownItem>
        <NeoDropdownItem>
          <nuxt-link data-testid="series-insight" to="/series-insight">
            Series</nuxt-link
          >
        </NeoDropdownItem>
      </NeoDropdown>
      <NeoDropdown
        v-if="chain === 'rmrk' || chain === 'ksm'"
        data-testid="stats"
        :triggers="['click']">
        <template #trigger>
          <div class="navbar-item" data-testid="stats">
            {{ $t('stats') }}
          </div>
        </template>
        <NeoDropdownItem aria-role="menu-item">
          <nuxt-link data-testid="spotlight" to="/spotlight">
            {{ $t('spotlight.page') }}
          </nuxt-link>
        </NeoDropdownItem>
        <NeoDropdownItem>
          <nuxt-link data-testid="series-insight" to="/series-insight">
            Series</nuxt-link
          >
        </NeoDropdownItem>
        <NeoDropdownItem>
          <nuxt-link data-testid="sales" to="/sales"> Sales</nuxt-link>
        </NeoDropdownItem>
        <NeoDropdownItem>
          <nuxt-link data-testid="hot" to="/hot"> Hot</nuxt-link>
        </NeoDropdownItem>
      </NeoDropdown>
    </div>

    <!-- <MobileExpandableSection v-else :no-padding="true" :title="$t('stats')">
      <template>
        <template v-if="showSnekBsxOptions">
          <b-navbar-item
            data-testid="global-offers"
            :to="offersUrl"
            tag="nuxt-link">
            {{ $t('navbar.globalOffers') }}
          </b-navbar-item>
          <b-navbar-item
            data-testid="offers-stats"
            :to="statsUrl"
            tag="nuxt-link">
            {{ $t('navbar.offerStats') }}
          </b-navbar-item>
          <b-navbar-item
            data-testid="series-insight"
            to="/series-insight"
            tag="nuxt-link">
            {{ $t('series.label') }}
          </b-navbar-item>
        </template>
        <template v-if="chain === 'rmrk' || chain === 'ksm'">
          <b-navbar-item
            data-testid="spotlight"
            to="/spotlight"
            tag="nuxt-link">
            {{ $t('spotlight.page') }}
          </b-navbar-item>
          <b-navbar-item
            data-testid="series-insight"
            to="/series-insight"
            tag="nuxt-link">
            {{ $t('series.label') }}
          </b-navbar-item>
          <b-navbar-item data-testid="sales" to="/sales" tag="nuxt-link">
            {{ $t('sales.page') }}
          </b-navbar-item>
          <b-navbar-item data-testid="hot" to="/hot" tag="nuxt-link">
            {{ $t('hot.label') }}
          </b-navbar-item>
        </template>
      </template>
    </MobileExpandableSection> -->
  </div>
</template>
<script lang="ts" setup>
import { NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'

// const MobileExpandableSection = defineAsyncComponent(
//   () => import('./MobileExpandableSection.vue'),
// )
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
    }`,
)
const statsUrl = computed(() => `/${urlPrefix.value}/stats`)

const showSnekBsxOptions = computed(
  () => props.chain === 'bsx' || props.chain === 'snek',
)
</script>
