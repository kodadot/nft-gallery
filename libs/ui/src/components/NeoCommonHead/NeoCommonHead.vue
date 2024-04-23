<template>
  <header
    class="flex py-4 px-tw-8 justify-between items-center border-b border-border-color bg-background-color">
    <span class="text-base font-bold">
      {{ title }}
    </span>
    <NeoButton
      class="py-1 px-2"
      variant="text"
      no-shadow
      icon="xmark"
      size="medium"
      data-testid="modal-close-button"
      @click="emit('close')" />
  </header>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'

defineProps<{
  title: string
}>()

const emit = defineEmits(['close'])
</script>
