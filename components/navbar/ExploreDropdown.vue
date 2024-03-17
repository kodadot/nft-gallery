<template>
  <NeoDropdown animation="" :triggers="!isMobileDevice ? ['hover'] : []">
    <template #trigger>
      <div>
        <nuxt-link :to="`/${urlPrefix}/explore/collectibles`">
          <div class="navbar-item" data-testid="explore">
            {{ $t('explore') }}
            <svg
              v-if="!isMobileDevice"
              class="ml-1"
              width="14"
              height="7"
              viewBox="0 0 14 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13.0002 1L7.00024 6L1.00025 0.999999"
                stroke="currentColor"
                stroke-width="1.26984" />
            </svg>
          </div>
        </nuxt-link>
      </div>
    </template>
    <NeoDropdownItem aria-role="menuitem" class="text-base" custom>
      <NavbarExploreOptions @select="onSelect" />
    </NeoDropdownItem>
  </NeoDropdown>
</template>

<script lang="ts" setup>
import { NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'
import { isMobileDevice } from '@/utils/extension'
import NavbarExploreOptions from './NavbarExploreOptions.vue'

const { urlPrefix } = usePrefix()
const { neoModal } = useProgrammatic()

const onSelect = () => neoModal.closeAll()
</script>
