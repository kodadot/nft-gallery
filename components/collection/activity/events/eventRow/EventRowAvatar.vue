<template>
  <img
    v-if="avatar"
    :src="avatar"
    :alt="name"
    width="50"
    height="50"
    class="border image-size"
    @error="onError" />
  <img
    v-else
    :src="placeholder"
    class="border image-size"
    width="50"
    height="50" />
</template>

<script setup lang="ts">
const { placeholder } = useTheme()
defineProps<{
  avatar?: string
  name: string
}>()

const onError = (e: Event) => {
  const target = e.target as HTMLImageElement
  if (target) {
    target.src = placeholder.value
  }
}
</script>

<style scoped lang="scss">
.image-size {
  width: 50px !important;
  height: 50px !important;
  max-width: none !important;
}
</style>
