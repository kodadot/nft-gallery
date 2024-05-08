<template>
  <div
    v-if="profile?.image"
    class="rounded-full overflow-hidden bg-background-color border"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      padding: `${size / 16}px`,
    }">
    <BaseMediaItem
      :src="profile?.image"
      :image-component="NuxtImg"
      title="User Avatar"
      class="object-cover overflow-hidden rounded-full h-full w-full" />
  </div>
  <Avatar v-else :size="size" :value="address" />
</template>

<script lang="ts" setup>
const NuxtImg = resolveComponent('NuxtImg')

const props = withDefaults(
  defineProps<{
    address: string
    size?: number
  }>(),
  {
    value: '',
    size: 64,
  },
)

const { profile } = useFetchProfile(computed(() => props.address))
</script>
