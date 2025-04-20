<template>
  <header
    class="flex lg:hidden py-0 px-tw-5 min-h-[64px] items-center border-b border-border-color bg-background-color-inverse"
  >
    <button
      type="button"
      class="w-full h-full text-left cursor-pointer p-0 bg-transparent text-base/normal text-text-color-inverse flex items-center gap-2"
      data-testid="modal-close-button"
      @click="emit('close')"
    >
      <KIcon name="i-mdi:chevron-left" />
      <span>{{ title }}</span>
    </button>
  </header>
  <NeoCommonHead
    class="hidden lg:flex"
    :title="title"
    @close="emit('close')"
  />
</template>

<script lang="ts" setup>
import { NeoCommonHead } from '@kodadot1/brick'

defineProps<{
  title: string
}>()

const emit = defineEmits(['close'])
</script>
