<template>
  <div
    :class="{ 'bordered sticky': open }"
    class="is-hidden-mobile"
  >
    <NeoSidebar
      :reduce="false"
      :open="open"
      fullheight
    >
      <Filters />
    </NeoSidebar>
  </div>
</template>

<script lang="ts" setup>
import { NeoSidebar } from '@kodadot1/brick'
import Filters from '@/components/shared/filters/Filters.vue'

const { getsidebarFilterCollapse: open } = storeToRefs(usePreferencesStore())
</script>

<style scoped>
@reference '@/assets/css/tailwind.css';

.bordered {
  border-right: 1px solid;
}

.sticky {
  top: 84px;
  height: calc(100vh - 84px);
  overflow-y: auto;
  @apply mr-fluid-container-padding sticky shrink-0;
}

.o-side {
  position: relative;
}
</style>
