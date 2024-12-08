<template>
  <div class="flex flex-wrap items-center gap-6">
    <div class="px-4 py-2 bg-neutral-3 text-black text-xl rounded-full">
      {{ step }}
    </div>
    <div class="flex flex-col justify-center capitalize">
      <h1 class="title">
        {{ title }}
      </h1>
      <p class="subtitle">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  step: string
  title: string
  subtitle: string
}>()
</script>
