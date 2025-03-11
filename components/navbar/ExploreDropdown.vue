<template>
  <NeoDropdown
    animation=""
    :triggers="!isMobileDevice ? ['hover'] : []"
  >
    <template #trigger>
      <div>
        <nuxt-link :to="`/${urlPrefix}/explore/collectibles`">
          <div
            class="navbar-item"
            data-testid="explore"
          >
            {{ $t('explore') }}
            <KIcon
              v-if="!isMobileDevice"
              name="i-mdi:chevron-down"
              class="ml-1"
            />
          </div>
        </nuxt-link>
      </div>
    </template>
    <NeoDropdownItem
      aria-role="menuitem"
      class="text-base"
      custom
    >
      <NavbarExploreOptions @select="onSelect" />
    </NeoDropdownItem>
  </NeoDropdown>
</template>

<script lang="ts" setup>
import { NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'
import NavbarExploreOptions from './NavbarExploreOptions.vue'
import { isMobileDevice } from '@/utils/extension'

const { urlPrefix } = usePrefix()
const { neoModal } = useProgrammatic()

const onSelect = () => neoModal.closeAll()
</script>
