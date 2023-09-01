<template>
  <div class="info-box" :class="`info-box__${variant}`">
    <div class="title-container box-padding is-flex">
      <p class="is-size-6 title">{{ title }}</p>
      <NeoIcon icon="x" class="cursor" @click.native="onClose" />
    </div>
    <div class="content box-padding">
      <slot />
    </div>

    <div v-if="$slots.footer" class="box-padding">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'

const emit = defineEmits(['close'])

defineProps<{
  title: string
  variant: 'success' | 'fail'
}>()

const onClose = () => {
  emit('close')
}
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

.box-padding {
  padding: 12px 16px;
}

$border_size: 1px;

.info-box {
  width: 100%;

  .title-container {
    .title {
      font-weight: bold;
    }
  }

  &__success {
    @include ktheme() {
      border: $border_size solid theme('k-green');
    }

    background-color: #e6f7e6;

    .title-container {
      @include ktheme() {
        border-bottom: $border_size solid theme('k-green');
      }
    }
  }

  &__fail {
    @include ktheme() {
      border: $border_size solid theme('k-red');
    }

    background-color: #ffe6e6;

    .title-container {
      @include ktheme() {
        border-bottom: $border_size solid theme('k-red');
      }
    }
  }
}
</style>
