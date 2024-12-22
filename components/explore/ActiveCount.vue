<template>
  <div
    v-if="count"
    class="count absolute h-5 w-5 leading-6 text-center flex justify-center items-center"
    :class="[`count--${position}`, { 'rounded-full': rounded }]"
  >
    {{ count }}
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    count?: number
    rounded?: boolean
    position?: string
  }>(),
  {
    rounded: false,
    count: 0,
    position: 'top-left' as 'top-left' | 'top-right',
  },
)
</script>
