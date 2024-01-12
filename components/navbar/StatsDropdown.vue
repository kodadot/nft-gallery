<template>
  <div>
    <div v-if="!isMobile">
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
    </MobileExpandableSection> -->
  </div>
</template>
<script lang="ts" setup>
import { NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'

defineProps<{
  chain?: string
  isMobile?: boolean
}>()
</script>
