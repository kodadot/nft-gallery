<template>
  <NuxtImg
    v-if="avatar"
    :src="avatar"
    :alt="name"
    class="border neo-avatar"
    :width="size"
    :height="size"
    @error="onError" />
  <img
    v-else
    :src="placeholder"
    :width="size"
    :height="size"
    class="border neo-avatar" />
</template>

<script setup lang="ts">
const props = defineProps<{
  avatar?: string
  placeholder: string
  name: string
  size: number
}>()

const onError = (e: Event) => {
  const target = e.target as HTMLImageElement
  if (target) {
    target.src = props.placeholder
  }
}
</script>

<style lang="scss">
@import './NeoAvatar.scss';
</style>
