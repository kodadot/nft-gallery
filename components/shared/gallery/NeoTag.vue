<template>
  <!-- NeoTag -->
  <b-tag
    attached
    closable
    class="neo-tag pl-3 pr-1"
    :class="{
      'is-blue-tag': isBlueTag,
    }"
    aria-close-label="clear filter"
    @close="onClose">
    <slot></slot>
  </b-tag>
</template>

<script lang="ts" setup>
defineProps<{
  isBlueTag?: boolean
}>()

const emit = defineEmits(['close'])
const onClose = () => {
  emit('close')
}
</script>

<style lang="scss">
@import '@/styles/abstracts/variables';

.neo-tag {
  @include ktheme() {
    border: 1px solid theme('k-primary');
  }
  &:hover {
    @include ktheme() {
      background-color: theme('k-accentlight2');
    }
  }

  &.is-blue-tag {
    @include ktheme() {
      border: 1px solid theme('k-blue');

      &:hover {
        background-color: theme('blue-light-hover-color');
      }
    }
  }

  .tag {
    margin-bottom: 0;
    padding: 0;
    background-color: inherit;
    font-size: 16px;

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
