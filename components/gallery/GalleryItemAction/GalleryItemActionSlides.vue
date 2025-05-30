<template>
  <div
    class="slide flex"
    :class="{ 'slide-active': active, 'slide-disabled': disabled }"
  >
    <slot name="entry" />

    <div class="slide-action">
      <slot name="action" />
    </div>
    <div class="slide-content">
      <slot name="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  active: boolean
  disabled?: boolean
}>()
</script>

<style scoped>
@reference '@/assets/css/tailwind.css';

.slide {
  box-shadow: var(--primary-shadow);
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
    border: 1px solid var(--border-color);

    & > * {
      width: 12rem;
    }

    input {
      border-left: 0 !important;
      height: 54px;
      outline: none;
      width: 100%;

      border: 1px solid var(--border-color);
      color: var(--text-color);
      background-color: var(--background-color);
    }
  }

  &-disabled {
    box-shadow: 4px 4px var(--k-grey);

    &:hover {
      @apply cursor-not-allowed;
    }
  }

  &-active {
    @apply bulma-until-widescreen:w-full;
  }
  &-content,
  &-content > * {
    @apply bulma-until-widescreen:w-full;
  }
}

.slide {
  @apply bulma-until-widescreen:w-full bulma-until-widescreen:items-stretch;

  &:not(.slide-active) {
    .slide-action {
      @apply bulma-until-widescreen:flex-grow;

      button {
        @apply bulma-until-widescreen:w-full;
      }
    }
    .slide-content {
      @apply bulma-until-widescreen:hidden;
    }
  }
  .slide-content {
    @apply bulma-until-widescreen:h-auto;

    & > div,
    input {
      @apply bulma-until-widescreen:h-full;
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

  @apply bulma-until-widescreen:w-full;

  .wrapper {
    @apply bulma-until-widescreen:relative;
  }
}
</style>
