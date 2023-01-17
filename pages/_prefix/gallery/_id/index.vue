<template>
  <GalleryItem />
</template>

<script lang="ts" setup>
import GalleryItem from '@/components/gallery/GalleryItem.vue'

const { $store } = useNuxtApp()
const { urlPrefix } = usePrefix()
const route = useRoute()
const router = useRouter()

onBeforeMount(() => {
  const prefix = route.params.prefix

  if (urlPrefix.value !== prefix) {
    $store.dispatch('setUrlPrefix', prefix)
    router.go(0)
  }
})
</script>
