<template>
  <object class="iframe-model__wrapper" :type="mimeType" :data="src" />
</template>

<script lang="ts" setup>
defineProps<{
  src?: string
  mimeType?: string
}>()
</script>

<style scoped>
.iframe-model__wrapper {
  height: 100%;
  min-height: 37em;
  width: 100%;
}
</style>
