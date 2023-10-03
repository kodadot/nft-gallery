<template>
  <header v-if="isMobile" class="modal-card-head">
    <div class="modal-card-title" @click.stop="emit('close')">
      <NeoIcon icon="chevron-left" />
      {{ title }}
    </div>
  </header>
  <header
    v-else
    class="modal-card-head is-flex is-justify-content-space-between border-bottom">
    <span class="modal-card-title is-size-6 has-text-weight-bold">
      {{ title }}
    </span>
    <NeoButton
      class="py-1 px-2"
      variant="text"
      no-shadow
      icon="xmark"
      size="medium"
      @click.native="emit('close')" />
  </header>
</template>

<script lang="ts" setup>
import { NeoButton, NeoIcon } from '@kodadot1/brick'

defineProps<{
  title: string
}>()

const isMobile = ref(window.innerWidth < 1024)

const emit = defineEmits(['close'])
</script>

<style lang="scss">
@import './NeoModalHead.scss';
</style>
