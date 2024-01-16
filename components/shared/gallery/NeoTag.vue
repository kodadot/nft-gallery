<template>
  <!-- NeoTag -->
  <div
    attached
    closable
    class="tag"
    data-testid="neo-tag-component"
    :class="[`tag--${variant}`, `tag-size--${size}`]">
    <slot></slot>
    <NeoIcon
      v-if="closable"
      aria-close-label="clear filter"
      icon="xmark"
      class="ml-2 is-clickable cross-icon"
      @click="onClose" />
  </div>
</template>

<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'

type TagSize = 'small' | 'medium'
type TagVariant = 'primary' | 'k-blue' | 'transparent'

withDefaults(
  defineProps<{
    closable?: boolean
    size?: TagSize
    variant?: TagVariant
  }>(),
  {
    closable: false,
    size: 'medium',
    variant: 'primary',
  },
)

const emit = defineEmits(['close'])
const onClose = () => {
  emit('close')
}
</script>

<style lang="scss">
@import '@/assets/styles/abstracts/variables';

.tag {
  background: transparent;
  @apply text-base rounded-2xl text-text-color #{!important};

  &--primary {
    @include ktheme() {
      border: 1px solid theme('k-primary');
      background-color: theme('k-accentlight2');
      .cross-icon {
        &:hover {
          color: theme('k-grey');
        }
      }
    }
  }

  &--transparent {
    @include ktheme() {
      border: 1px solid theme('border-color');
      background: transparent;
    }
  }

  &--k-blue {
    @include ktheme() {
      border: 1px solid theme('k-blue');
      background-color: theme('blue-light-hover-color');
    }
  }

  &.tag-size {
    &--medium {
      padding: 0.75rem;
    }

    &--small {
      font-size: 0.75rem !important;
      padding: 0 0.5rem !important;
      height: min-content;
    }
  }

  .tag {
    margin-bottom: 0;
    padding: 0;
    background-color: inherit;

    @include ktheme() {
      color: theme('text-color');
    }

    &:first-child {
      margin-right: 0.3rem;
      cursor: default;
    }
    &.is-delete {
      &:hover,
      &:focus {
        background-color: inherit;
        @include ktheme() {
          color: theme('k-grey');
        }
      }
    }
  }
}
</style>
