<template>
  <div :class="{ 'mr-5 bordered sticky': open }" class="is-hidden-mobile">
    <NeoSidebar :reduce="false" :open="open" fullheight>
      <PriceFilter />
      <StatusFilter />
    </NeoSidebar>
  </div>
</template>

<script lang="ts" setup>
import { NeoSidebar } from '@kodadot1/brick'
import PriceFilter from './filters/PriceFilter.vue'
import StatusFilter from './filters/StatusFilter.vue'

const { $store } = useNuxtApp()

const open = computed(
  () => $store.getters['preferences/getSidebarfilterCollapse']
)
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
.bordered {
  border-right: 1px solid;
}

.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 72px;
  height: calc(100vh - 72px);
}
</style>
