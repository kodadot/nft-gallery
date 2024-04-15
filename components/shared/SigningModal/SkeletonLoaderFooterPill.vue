<template>
  <div
    :class="{
      'min-w-[80px]': !fullWidth,
      'w-max': fullWidth,
    }"
    class="absolute z-[4] left-2/4 top-[90%] -translate-x-2/4 -translate-y-[90%] px-3 text-center rounded-full py-1 text-k-grey bg-background-color text-xs">
    <slot />
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  fullWidth?: boolean
}>()
</script>
