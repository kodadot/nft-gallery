<template>
  <div
    class="flex justify-between items-center"
  >
    <div
      class="flex gap-4 items-center"
    >
      <BaseMediaItem
        class="image size-8"
        :class="imageClass"
        :alt="name"
        :src="image"
        preview
        is-detail
      />

      <slot name="name">
        <span>
          {{ name }}
        </span>
      </slot>
    </div>

    <NeoButton
      v-if="!hideRemove"
      size="small"
      variant="icon"
      icon="xmark"
      @click="emit('remove')"
    />
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

const emit = defineEmits(['remove'])

defineProps<{
  name?: string
  image: string
  imageClass?: string
  hideRemove?: boolean
}>()
</script>
