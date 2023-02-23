<template>
  <!-- NeoTag -->
  <b-tag
    attached
    closable
    class="neo-tag pl-3 pr-1"
    aria-close-label="clear filter"
    @close="onClose">
    <slot></slot>
  </b-tag>
</template>

<script lang="ts" setup>
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
    // color: theme('text-color') !important;
  }

  .tag {
    margin-bottom: 0;
    padding: 0;
    background-color: transparent;
    font-size: 16px;

    @include ktheme() {
      color: theme('text-color');
    }
    &:hover {
      @include ktheme() {
        background-color: theme('k-accentlight2');
      }
    }

    &:first-child {
      margin-right: 0.3rem;
      cursor: default;
    }
    &.is-delete {
      &:hover,
      &:focus {
        background-color: transparent;
        @include ktheme() {
          color: theme('k-grey');
        }
      }
    }
  }
}
</style>
