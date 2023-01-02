<template>
  <div
    class="slide is-flex"
    :class="{ 'slide-active': active, 'slide-disabled': disabled }">
    <div class="slide-action">
      <slot name="action"></slot>
    </div>
    <div class="slide-content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  active: boolean
  disabled?: boolean
}>()
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
.slide {
  box-shadow: 4px 4px hsl(0deg, 0%, 4%);
  overflow: hidden;
  transition-duration: 0.2s;
  width: 10rem;

  &-active {
    width: 30rem;
  }

  &-action {
    position: relative;
    z-index: 1;

    & > * {
      font-size: 1rem;
      height: 100%;
    }
  }

  &-content {
    border: 1px solid black;
    border-left: initial;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    height: 54px;
    width: 20rem;

    & > * {
      width: 20rem;
    }

    input {
      border: 1px solid black;
      border-left: 0;
      height: 54px;
      outline: none;
      padding: 0 1rem;
      width: 100%;
    }
  }
  &-disabled {
    box-shadow: 4px 4px $k-grey;
    &:hover {
      cursor: not-allowed;
    }
  }
}

.dark-mode {
  .slide {
    box-shadow: 4px 4px $white;
    &-content {
      border-color: $white;
      input {
        border-color: $white;
      }
    }
    &-disabled {
      box-shadow: 4px 4px $shade;
    }
  }
}
</style>
