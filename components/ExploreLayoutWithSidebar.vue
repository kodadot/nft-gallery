<template>
  <div
    class="grow relative w-full max-w-none mx-auto my-0 md:!px-10 !px-5"
    :class="{ '!pl-0': isSidebarOpen }"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
// convert to nested layout:  explore-layout-with-sidebar -> explore-layout
const { getsidebarFilterCollapse: isSidebarOpen } = storeToRefs(usePreferencesStore())
</script>
