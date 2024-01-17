<template>
  <div
    class="slide flex"
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
@import '@/assets/styles/abstracts/variables';

.slide {
  @include ktheme() {
    box-shadow: theme('primary-shadow');
  }

  overflow: hidden;
  transition-duration: 0.2s;
  width: 10rem;

  &-active {
    width: 22rem;
  }

  &-action {
    @apply relative z-[1];

    & > * {
      font-size: 1rem !important;
      height: 100% !important;
    }
  }

  &-content {
    border-left: initial !important;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    height: 54px;
    width: 12rem;

    @include ktheme() {
      border: 1px solid theme('border-color');
    }

    & > * {
      width: 12rem;
    }

    input {
      border-left: 0 !important;
      height: 54px;
      outline: none;
      width: 100%;

      @include ktheme() {
        border: 1px solid theme('border-color');
        color: theme('text-color');
        background-color: theme('background-color');
      }
    }
  }

  &-disabled {
    @include ktheme() {
      box-shadow: 4px 4px theme('k-grey');
    }

    &:hover {
      @apply cursor-not-allowed;
    }
  }

  @include until-widescreen {
    &-active {
      width: 100%;
    }
    &-content,
    &-content > * {
      width: 100%;
    }
  }
}

@include until-widescreen {
  .slide {
    width: 100%;
    align-items: stretch;
    &:not(.slide-active) {
      .slide-action {
        flex: 1;
        button {
          width: 100%;
        }
      }
      .slide-content {
        display: none;
      }
    }
    .slide-content {
      height: auto;
      & > div,
      input {
        height: 100%;
      }
    }
  }
}

.gallery-item-slides-entry {
  width: 10rem;
  font-size: 1rem;
  position: relative;

  .o-tip {
    @apply w-full h-full absolute z-[2];
  }

  .slide-action .o-tip {
    position: relative;
  }

  .full-width-action-button {
    @apply text-base w-full h-full absolute z-[2];
  }

  @include until-widescreen {
    width: 100%;

    .wrapper {
      position: initial;
    }
  }
}
</style>
