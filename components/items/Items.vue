<template>
  <div class="flex self-start">
    <SidebarFilter />
    <div class="flex-grow pb-8">
      <div class="is-hidden-mobile">
        <div class="flex justify-between pb-4 pt-5 content-center">
          <BreadcrumbsFilter />
          <div v-if="isLoading">
            <NeoSkeleton no-margin :width="80" />
          </div>
          <div v-else-if="total" class="shrink-0">
            {{ total }} {{ $t('items') }}
          </div>
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
import BreadcrumbsFilter from '@/components/shared/BreadcrumbsFilter.vue'

const total = ref(0)
const isLoading = ref(false)
</script>
