<template>
  <b-dropdown :triggers="!isMobileDevice ? ['hover'] : ''">
    <template #trigger>
      <nuxt-link :to="`/${urlPrefix}/explore`">
        <div class="navbar-item" data-cy="explore">
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
    </template>
    <b-dropdown-item aria-role="menuitem" class="is-size-6" custom>
      <NavbarExploreOptions />
    </b-dropdown-item>
  </b-dropdown>
</template>

<script lang="ts" setup>
import { isMobileDevice } from '~/utils/extension'

const NavbarExploreOptions = defineAsyncComponent(
  () => import('./NavbarExploreOptions.vue')
)
const { urlPrefix } = usePrefix()
</script>
