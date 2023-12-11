<template>
  <header
    class="flex lg:hidden py-0 px-tw-5 min-h-[64px] items-center border-b border-border-color bg-background-color-inverse">
    <button
      type="button"
      class="w-full h-full text-left cursor-pointer p-0 bg-transparent text-base/normal text-text-color-inverse"
      data-testid="modal-close-button"
      @click="emit('close')">
      <NeoIcon icon="chevron-left" />
      <span>{{ title }}</span>
    </button>
  </header>
  <header
    class="hidden lg:flex py-4 px-tw-8 justify-between items-center border-b border-border-color bg-background-color">
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
import { NeoButton, NeoIcon } from '@kodadot1/brick'

defineProps<{
  title: string
}>()

const emit = defineEmits(['close'])
</script>
