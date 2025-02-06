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

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.box-padding {
  padding: 12px 16px;
}

$border_size: 1px;

@mixin variantTheme($borderColor, $backgroundColor) {
  border: $border_size solid var($borderColor);
  background-color: var($backgroundColor);

  .header-container {
    border-bottom: $border_size solid var($borderColor);
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

      color: var(--text-color);
    }
  }

  .body-container {
    color: var(--text-color);
  }

  &__success {
    @include variantTheme(
      --green-border-color,
      --k-green-accent-2
    );
  }

  &__fail {
    @include variantTheme(
      --k-red,
      --k-red-accent-2
    );
  }

  &__warning {
    @include variantTheme(
      --k-orange,
      --k-yellow
    );
  }
}
</style>
