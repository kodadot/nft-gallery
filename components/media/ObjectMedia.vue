<script lang="ts" setup>
import { defineProps } from '#app'

defineProps<{
  src?: string
  mimeType?: string
}>()
</script>

<template>
  <object class="iframe-model__wrapper" :type="mimeType" :data="src" />
</template>

<style scoped>
.iframe-model__wrapper {
  height: 100%;
  min-height: 37em;
  width: 100%;
}
</style>
