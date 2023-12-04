<template>
  <object class="w-full h-full min-h-[37em]" :type="mimeType" :data="src" />
</template>

<script lang="ts" setup>
defineProps<{
  src?: string
  mimeType?: string
}>()
</script>
