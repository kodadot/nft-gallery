<template>
  <video
    v-if="isVideo"
    :src="src"
    class="background-media"
    autoplay
    muted
    loop />
  <img v-else :src="src || placeholder" class="background-media" :alt="name" />
</template>

<script setup lang="ts">
const { placeholder } = useTheme()

const props = defineProps<{
  src: string
  mimeType: string
  name?: string
}>()

const isVideo = computed(() => /^video\//.test(props.mimeType))
</script>

<style scoped>
.background-media {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}
</style>
