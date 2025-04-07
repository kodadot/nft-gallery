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

<style lang="scss" scoped>
.bordered {
  border-right: 1px solid;
}

.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 84px;
  height: calc(100vh - 84px);
  overflow-y: auto;
  shrink: 0;
  @apply mr-fluid-container-padding;
}

.o-side {
  position: relative;
}
</style>
