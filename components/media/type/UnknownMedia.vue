<template>
  <div>
    <a v-safe-href="src" target="_blank" rel="nofollow noopener noreferrer"
      >Unknown animated media, click to download</a
    >
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  src?: string
}>()
</script>
