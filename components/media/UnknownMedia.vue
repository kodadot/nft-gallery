<script lang="ts" setup>
import { defineProps } from '#app'

defineProps<{
  src?: string
}>()
</script>

<template>
  <div>
    <a :href="src" target="_blank" rel="noopener noreferrer"
      >Unknown animated media, click to download</a
    >
  </div>
</template>
