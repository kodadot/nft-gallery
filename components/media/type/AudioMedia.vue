<template>
  <div class="is-flex is-justify-content-center is-align-content-center">
    <audio
      :controls="controls"
      :muted="preview"
      :src="src"
      :type="mimeType"
      controlslist="nodownload"
      data-cy="type-audio" />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  src?: string
  mimeType?: string
  preview?: boolean
}>()

const controls = computed(() => !props.preview)
</script>
