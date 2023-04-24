<template>
  <img
    v-if="avatar"
    :src="avatar"
    :alt="name"
    class="border image-size"
    :style="customStyle"
    @error="onError" />
  <img
    v-else
    :src="placeholder"
    :style="customStyle"
    class="border image-size" />
</template>

<script setup lang="ts">
const { placeholder } = useTheme()
const props = defineProps<{
  avatar?: string
  name: string
  size: number
}>()

const customStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}))

const onError = (e: Event) => {
  const target = e.target as HTMLImageElement
  if (target) {
    target.src = placeholder.value
  }
}
</script>

<style scoped lang="scss">
.image-size {
  max-width: none !important;
}
</style>
