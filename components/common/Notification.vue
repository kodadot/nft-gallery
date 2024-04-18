<template>
  <NeoMessage
    :duration="duration"
    :title="title"
    :variant="variant"
    auto-close
    show-progress-bar
    @close="emit('close')">
    <div class="flex gap-2 flex-col">
      <p class="text-k-grey text-sm">{{ message }}</p>

      <a
        v-if="action"
        class="text-[16px] !text-text-color"
        :href="action.url"
        target="_blank">
        {{ action.label }}
      </a>
    </div>
  </NeoMessage>
</template>

<script lang="ts" setup>
import { NeoMessage, NeoMessageVariant } from '@kodadot1/brick'

type NotificationAction = { label: string; url: string }

const emit = defineEmits(['close'])
withDefaults(
  defineProps<{
    title?: string
    message?: string
    duration?: number
    variant?: NeoMessageVariant
    action?: NotificationAction
  }>(),
  {
    variant: 'success',
    duration: 10000,
  },
)
</script>
