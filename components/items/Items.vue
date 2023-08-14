<template>
  <div class="is-flex is-align-self-flex-start">
    <SidebarFilter />
    <div class="is-flex-grow-1">
      <div class="is-hidden-mobile">
        <div
          class="is-flex is-justify-content-space-between pb-4 pt-5 is-align-content-center">
          <BreadcrumbsFilter />
          <div v-if="isLoading" class="skeleton-container-fixed-width">
            <NeoSkeleton no-margin />
          </div>
          <div v-else-if="total">{{ total }} {{ $t('items') }}</div>
        </div>
        <hr class="my-0" />
      </div>
      <ItemsGrid
        @total="(v) => (total = v)"
        @loading="
          (loading) => {
            isLoading = loading
          }
        " />
    </div>
  </div>
</template>

<script setup lang="ts">
import SidebarFilter from '@/components/shared/filters/SidebarFilter.vue'
import ItemsGrid from './ItemsGrid/ItemsGrid.vue'
import { NeoSkeleton } from '@kodadot1/brick'

const total = ref(0)
const isLoading = ref(false)
</script>

<style lang="scss" scoped>
.skeleton-container-fixed-width {
  width: 80px;
}
</style>
