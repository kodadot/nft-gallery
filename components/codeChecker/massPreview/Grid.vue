<template>
  <div class="grid grid-cols-3 gap-4">
    <div
      v-for="(loading, index) in items"
      :key="`${index}_grid_item`"
      class="relative w-full aspect-square"
    >
      <NeoSkeleton
        v-if="loading"
        class="border border-border-color overflow-hidden absolute h-full"
        width="100%"
        height="100%"
        :rounded="false"
        no-margin
      />

      <slot :index="index" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoSkeleton } from '@kodadot1/brick'

defineProps<{ items: boolean[] }>()
</script>
