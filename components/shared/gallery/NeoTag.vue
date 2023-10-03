<template>
  <!-- NeoTag -->
  <div
    attached
    closable
    class="neo-tag tag p-3"
    :class="{
      'is-blue-tag': isBlueTag,
    }">
    <slot></slot>
    <NeoIcon
      aria-close-label="clear filter"
      icon="xmark"
      class="ml-2 is-clickable cross-icon"
      @click="onClose" />
  </div>
</template>

<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'

defineProps<{
  isBlueTag?: boolean
}>()

const emit = defineEmits(['close'])
const onClose = () => {
  emit('close')
}
</script>

<style lang="scss">
@import '@/assets/styles/abstracts/variables';

.neo-tag {
  border-radius: 1rem !important;
  background: transparent;
  font-size: 1rem !important;
  @include ktheme() {
    border: 1px solid theme('k-primary');
    background-color: theme('k-accentlight2');
    color: theme('text-color');
    .cross-icon {
      &:hover {
        color: theme('k-grey');
      }
    }
  }

  &.is-blue-tag {
    @include ktheme() {
      border: 1px solid theme('k-blue');
      background-color: theme('blue-light-hover-color');
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
