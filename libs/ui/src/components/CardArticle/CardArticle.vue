<template>
  <a
    v-safe-href="link"
    class="group block h-full no-underline border border-card-border-color bg-background-color hover:border-border-color"
    target="_blank"
    rel="nofollow noopener noreferrer">
    <img
      class="w-full object-cover h-56 border-b border-b-card-border-color group-hover:opacity-card-hover-opacity"
      :src="image"
      :alt="title" />
    <div class="p-4">
      <p class="leading-5 text-text-color font-bold">
        {{ title }}
      </p>
      <p class="text-xs/5 text-text-color">
        {{ description }}
      </p>
    </div>
  </a>
</template>

<script lang="ts" setup>
defineProps<{
  link: string
  image: string
  title: string
  description: string
}>()
</script>
