<template>
  <div class="collections pb-6">
    <div
      class="is-flex is-flex-direction-row is-justify-content-space-between py-5">
      <BreadcrumbsFilter />

      <div v-if="total">{{ total }} {{ $t('items') }}</div>
      <div v-else-if="isLoading">
        <NeoSkeleton no-margin :width="80" />
      </div>
    </div>
    <hr class="mt-0" />

    <CollectionGrid
      :id="id"
      class="pb-8"
      @total="(v) => (total = v)"
      @isLoading="(l) => (isLoading = l)" />
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
