<template>
  <div class="slide is-flex" :class="{ 'slide-active': active }">
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
}>()
</script>

<style lang="scss" scoped>
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
}
</style>
