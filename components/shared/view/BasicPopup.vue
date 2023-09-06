<template>
  <tippy
    class="tippy-container"
    interactive
    :animate-fill="false"
    :placement="placement"
    :delay="delay">
    <slot name="content" />

    <template #content>
      <div class="popover-content-container p-4">
        <slot />
      </div>
    </template>
  </tippy>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    delay?: [number, number]
    placement?: string
  }>(),
  {
    delay: () => [100, 800],
    placement: 'bottom',
  }
)
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.tippy-container {
  width: 100%;
  display: inline-block;
}

.popover-content-container {
  max-width: 350px;

  @include ktheme() {
    box-shadow: theme('primary-shadow');
    border: 1px solid theme('border-color');
  }
}

.break-word {
  overflow-wrap: break-word;
}
</style>
