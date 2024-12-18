<template>
  <div
    class="info-box"
    :class="`info-box__${variant}`"
  >
    <div
      v-if="title"
      class="header-container box-padding"
    >
      <p class="text-base title">
        {{ title }}
      </p>

      <NeoButton
        variant="text"
        no-shadow
        icon="xmark"
        size="medium"
        @click="onClose"
      />
    </div>
    <div class="box-padding body-container">
      <slot />
    </div>

    <div
      v-if="$slots.footer"
      class="box-padding"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

const emit = defineEmits(['close'])

defineProps<{
  variant: 'success' | 'fail' | 'warning'
  title?: string
}>()

const onClose = () => {
  emit('close')
}
</script>
