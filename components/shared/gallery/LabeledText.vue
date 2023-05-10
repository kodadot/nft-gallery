<template>
  <div>
    <p class="label">
      {{ $t(label) }}
    </p>
    <p class="subtitle is-size-6">
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
  }
)
</script>
