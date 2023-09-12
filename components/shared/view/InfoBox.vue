<template>
  <div class="info-box" :class="`info-box__${variant}`">
    <div class="header-container box-padding">
      <p class="is-size-6 title">{{ title }}</p>

      <NeoButton
        variant="text"
        no-shadow
        icon="xmark"
        size="medium"
        class="cross"
        @click="onClose" />
    </div>
    <div class="box-padding body-container">
      <slot />
    </div>

    <div v-if="$slots.footer" class="box-padding">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

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
@import '@/assets/styles/abstracts/variables';

.box-padding {
  padding: 12px 16px;
}

$border_size: 1px;

.info-box {
  width: 100%;

  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-weight: bold;
      margin-bottom: 0;

      @include ktheme() {
        color: theme('text-color');
      }
    }
  }

  .body-container {
    @include ktheme() {
      color: theme('text-color');
    }
  }

  &__success {
    @include ktheme() {
      border: $border_size solid theme('green-border-color');
      background-color: theme('k-greenaccent2');
    }

    .cross {
      @include ktheme() {
        background-color: theme('k-greenaccent2') !important;
      }
    }

    .header-container {
      @include ktheme() {
        border-bottom: $border_size solid theme('green-border-color');
      }
    }
  }

  &__fail {
    @include ktheme() {
      border: $border_size solid theme('k-red');
      background-color: theme('k-redaccent2');
    }

    .cross {
      @include ktheme() {
        background-color: theme('k-redaccent2') !important;
      }
    }

    .header-container {
      @include ktheme() {
        border-bottom: $border_size solid theme('k-red');
      }
    }
  }
}
</style>
