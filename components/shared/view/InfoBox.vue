<template>
  <div class="info-box" :class="`info-box__${variant}`">
    <div v-if="title" class="header-container box-padding">
      <p class="is-size-6 title">{{ title }}</p>

      <NeoButton
        variant="text"
        no-shadow
        icon="xmark"
        size="medium"
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
  variant: 'success' | 'fail' | 'warning'
  title?: string
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

@mixin variantTheme($borderColor, $backgroundColor) {
  border: $border_size solid $borderColor;
  background-color: $backgroundColor;

  .header-container {
    @include ktheme() {
      border-bottom: $border_size solid $borderColor;
    }
  }
}

.info-box {
  width: 100%;

  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-weight: 700;
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
      @include variantTheme(
        theme('green-border-color'),
        theme('k-greenaccent2')
      );
    }
  }

  &__fail {
    @include ktheme() {
      @include variantTheme(theme('k-red'), theme('k-redaccent2'));
    }
  }

  &__warning {
    @include ktheme() {
      @include variantTheme(theme('k-orange'), theme('k-yellow'));
    }
  }
}
</style>
