<template>
  <div>
    <p class="label text-xs/normal">
      {{ $t(label) }}
    </p>
    <p class="subtitle text-base">
      <slot v-if="!isLoading">~</slot>
      <NeoSkeleton :active="isLoading"></NeoSkeleton>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { NeoSkeleton } from '@kodadot1/brick'

withDefaults(
  defineProps<{
    label: string
    type?: boolean
    isLoading?: boolean
  }>(),
  {
    label: 'general.label',
    type: false,
    isLoading: false,
  },
)
</script>
