<template>
  <div class="flex flex-col w-full">
    <slot />
    <div
      v-if="show"
      class="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-md p-3 !mt-2"
    >
      <NeoIcon
        icon="warning"
        class="text-yellow-500 flex-shrink-0"
        size="small"
      />
      <p class="text-sm text-yellow-700">
        {{ $t('mint.notRecommendedModify') }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'

defineProps<{
  show: boolean
}>()
</script>
