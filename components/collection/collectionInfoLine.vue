<template>
  <div class="flex mb-2 items-center whitespace-nowrap">
    <div class="text-k-grey pr-4 grow">
      {{ title }}
    </div>
    <div class="font-bold flex text-sm md:text-lg">
      <slot>
        <div>{{ value }}</div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value?: string | number
}>()
</script>
