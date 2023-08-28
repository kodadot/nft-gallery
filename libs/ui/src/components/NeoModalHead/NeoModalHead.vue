<template>
  <header v-if="isMobile" class="modal-card-head is-mobile">
    <div class="modal-card-title" @click.stop="emit('close')">
      <NeoIcon icon="chevron-left" pack="fas" />
      {{ title }}
    </div>
  </header>
  <header v-else class="modal-card-head">
    <span class="modal-card-title is-size-6 has-text-weight-bold">
      {{ title }}
    </span>
    <NeoButton
      variant="text"
      no-shadow
      icon="xmark"
      icon-pack="fa-sharp"
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
