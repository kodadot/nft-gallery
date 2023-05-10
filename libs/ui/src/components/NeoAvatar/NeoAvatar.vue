<template>
  <img
    v-if="avatar"
    :src="avatar"
    :alt="name"
    class="border neo-avatar"
    :style="customStyle"
    @error="onError" />
  <img
    v-else
    :src="placeholder"
    :style="customStyle"
    class="border neo-avatar" />
</template>

<script setup lang="ts">
const props = defineProps<{
  avatar?: string
  placeholder: string
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
    target.src = props.placeholder
  }
}
</script>

<style lang="scss">
@import './NeoAvatar.scss';
</style>
