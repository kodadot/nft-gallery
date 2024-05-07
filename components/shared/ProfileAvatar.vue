<template>
  <div
    v-if="user?.image"
    class="rounded-full overflow-hidden bg-background-color border"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      padding: `${size / 16}px`,
    }">
    <BaseMediaItem
      :src="user?.image"
      :image-component="NuxtImg"
      title="User Avatar"
      class="object-cover overflow-hidden rounded-full h-full w-full" />
  </div>
  <Avatar v-else :size="size" :value="address" />
</template>

<script lang="ts" setup>
import { Profile, fetchProfileByAddress } from '@/services/profile'

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

const user = ref<Profile | null>(null)

const fetchUserProfile = async () => {
  if (!props.address) {
    return
  }
  try {
    const res = await fetchProfileByAddress(props.address)
    if (res) {
      user.value = res
    }
  } catch (error) {
    // no profile data for current user
  }
}

watch(
  () => props.address,
  () => {
    user.value = null
    fetchUserProfile()
  },
  { immediate: true },
)
</script>
