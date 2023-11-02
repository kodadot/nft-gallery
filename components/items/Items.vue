<template>
  <div class="is-flex is-align-self-flex-start">
    <SidebarFilter />
    <div class="is-flex-grow-1 pb-8">
      <div class="is-hidden-mobile">
        <div
          class="is-flex is-justify-content-space-between pb-4 pt-5 is-align-content-center">
          <BreadcrumbsFilter />
          <div v-if="isLoading">
            <NeoSkeleton no-margin :width="80" />
          </div>
          <div v-else-if="total">{{ total }} {{ $t('items') }}</div>
        </div>
        <hr class="my-0" />
      </div>
      <ItemsGrid
        :hide-relist="true"
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
