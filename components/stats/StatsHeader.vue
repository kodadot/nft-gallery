<template>
  <div class="flex flex-col md:flex-row gap-3">
    <div class="w-4/5">
      <h1 class="title is-2">{{ title }}</h1>
      <p class="subtitle text-xl">{{ subtitle }}</p>
    </div>
    <div class="flex-1">
      <img
        src="/rmrk-logo-pink-faded.png"
        alt="RMRK"
        class="chain-logo is-hidden-mobile" />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
  subtitle: string
}>()
</script>
