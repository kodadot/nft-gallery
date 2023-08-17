<template>
  <div class="collections">
    <div
      class="is-flex is-flex-direction-row is-justify-content-space-between py-5">
      <BreadcrumbsFilter />

      <div v-if="total">{{ total }} {{ $t('items') }}</div>
      <div v-else-if="isLoading" class="skeleton-container-fixed-width">
        <NeoSkeleton no-margin />
      </div>
    </div>
    <hr class="mt-0" />

    <CollectionGrid
      :id="id"
      @total="(v) => (total = v)"
      @isLoading="(l) => (isLoading = L)" />
  </div>
</template>

<script lang="ts" setup>
import { NeoSkeleton } from '@kodadot1/brick'

import CollectionGrid from './CollectionGrid.vue'

defineProps<{
  id?: string
}>()

const isLoading = ref(true)
const total = ref(0)
</script>

<style lang="scss" scoped>
.skeleton-container-fixed-width {
  width: 80px;
}
</style>
