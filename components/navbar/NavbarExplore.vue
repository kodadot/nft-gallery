<template>
  <b-dropdown :triggers="['click', 'hover']" class="navbar-explore">
    <template #trigger>
      <div class="navbar-item" data-cy="explore">
        {{ $t('explore') }}
        <svg
          class="ml-1"
          fill="none"
          height="7"
          viewBox="0 0 14 7"
          width="14"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13.0002 1L7.00024 6L1.00025 0.999999"
            stroke="currentColor"
            stroke-width="1.26984" />
        </svg>
      </div>
    </template>
    <b-dropdown-item aria-role="menuitem" class="is-size-6" custom>
      <NavbarExploreOptions />
    </b-dropdown-item>
  </b-dropdown>
</template>

<script lang="ts" setup>
const NavbarExploreOptions = defineAsyncComponent(
  () => import('./NavbarExploreOptions.vue')
)
</script>
