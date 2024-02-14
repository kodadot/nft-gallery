<template>
  <div>
    <NeoIcon
      :icon="passed ? 'check' : 'xmark'"
      class="text-lg"
      :class="{ 'text-k-red': !passed, 'text-k-green': passed }" />
    <span class="ml-[20px]">{{ description }}</span>
  </div>
</template>

<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'

defineProps<{
  passed: boolean
  description: string
}>()
</script>
