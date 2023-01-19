<template>
  <div
    class="slide is-flex"
    :class="{ 'slide-active': active, 'slide-disabled': disabled }">
    <slot name="entry"></slot>

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

<style lang="scss">
@import '@/styles/abstracts/variables';
.slide {
  box-shadow: 4px 4px hsl(0deg, 0%, 4%);
  overflow: hidden;
  transition-duration: 0.2s;
  width: 10rem;

  &-active {
    width: 22rem;
  }

  &-action {
    position: relative;
    z-index: 1;

    & > * {
      font-size: 1rem !important;
      height: 100% !important;
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
    width: 12rem;

    & > * {
      width: 12rem;
    }

    input {
      border: 1px solid black;
      border-left: 0;
      height: 54px;
      outline: none;
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

.gallery-item-slides-entry {
  width: 10rem;
  font-size: 1rem;
  position: relative;
  .wrapper {
    width: 100%;
    height: 100%;
  }
  .full-width-action-button {
    width: 100%;
    height: 100%;
    font-size: 1rem;
    position: absolute;
    z-index: 2;
  }
  @include until-widescreen {
    width: 100%;
    .wrapper {
      position: initial;
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
        background-color: $k-dark;
      }
    }
    &-disabled {
      box-shadow: 4px 4px $shade;
    }
  }
}
</style>
