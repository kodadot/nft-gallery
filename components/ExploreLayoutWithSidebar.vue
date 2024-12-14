<template>
  <div
    class="container is-fluid"
    :class="{ 'sidebar-padding-left': isSidebarOpen }"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
// convert to nested layout:  explore-layout-with-sidebar -> explore-layout
const { getsidebarFilterCollapse: isSidebarOpen } = storeToRefs(usePreferencesStore())
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.sidebar-padding-left {
  padding-left: 0;
}

// this cover the edge case where sidebar is open and then screen size changes to mobile
// for exmpale on rotation of tablet device
// in that case the padding need to match that of the fluid container
@include mobile {
  .sidebar-padding-left {
    padding-left: $fluid-container-padding-mobile;
  }
}
</style>
