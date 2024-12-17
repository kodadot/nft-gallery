<template>
  <div
    class="container is-fluid"
    :class="{ '!pl-0': isSidebarOpen }"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
// convert to nested layout:  explore-layout-with-sidebar -> explore-layout
const { getsidebarFilterCollapse: isSidebarOpen } = storeToRefs(usePreferencesStore())
</script>
