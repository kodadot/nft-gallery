<template>
  <div class="columns mb-6">
    <div class="column is-half">
      <div
        class="is-flex is-flex-direction-column is-justify-content-space-between h-full">
        <div>
          <div class="migrate-title">
            <img src="/migrate/title-arrow.svg" alt="Migrate Your Art" />
            <h1 class="title">{{ $t('migrate.heading') }}</h1>
          </div>
          <p>{{ $t('migrate.subHeading') }}</p>
        </div>

        <div class="is-flex is-align-items-center mt-4">
          <div class="is-relative">
            <p class="text-destination">Source</p>
            <NeoButton rounded no-shadow variant="pill">
              <img
                src="/token/ksm.svg"
                alt="Polkadot Asset Hub"
                class="mr-2"
                width="20" />
              <span>Kusama</span>
            </NeoButton>
          </div>
          <div class="mx-4">
            <img src="/migrate/arrow.svg" alt="Destination" />
          </div>
          <div class="is-relative">
            <p class="text-destination">Destination</p>
            <NeoDropdown v-model="currentDestination" aria-role="list">
              <template #trigger="{ active }">
                <NeoButton rounded no-shadow variant="pill">
                  <img
                    :src="currentDestination.logo"
                    alt="Polkadot Asset Hub"
                    class="mr-2"
                    width="20" />
                  <span class="mr-2">{{ currentDestination.label }}</span>
                  <NeoIcon :icon="active ? 'chevron-up' : 'chevron-down'" />
                </NeoButton>
              </template>

              <NeoDropdownItem
                v-for="item in destination"
                :key="item.value"
                aria-role="listitem"
                :label="item.label"
                :value="item" />
            </NeoDropdown>
          </div>
        </div>
      </div>
    </div>

    <div class="column is-half"><MigrateFaq /></div>
  </div>
</template>

<script setup lang="ts">
import {
  NeoButton,
  NeoDropdown,
  NeoDropdownItem,
  NeoIcon,
} from '@kodadot1/brick'
import MigrateFaq from './MigrateHeaderFaq.vue'

const destination = [
  {
    label: 'Polkadot Asset Hub',
    logo: '/token/polkadot_asset_hub.svg',
    value: 'ahp',
  },
  {
    label: 'Kusama Asset Hub',
    logo: '/token/kusama_asset_hub.svg',
    value: 'ahk',
  },
]
const currentDestination = ref({
  label: 'Polkadot Asset Hub',
  logo: '/token/polkadot_asset_hub.svg',
  value: 'ahp',
})
</script>

<style lang="scss" scoped>
.migrate-title {
  position: relative;
  margin-bottom: 1rem;

  img {
    position: absolute;
    top: -26px;
    left: -26px;
  }

  h1 {
    margin-left: 4.5rem;
  }
}

.text-destination {
  position: absolute;
  top: -100%;
}
</style>
