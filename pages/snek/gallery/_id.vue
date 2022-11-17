<template>
  <GalleryItem v-if="redesign" />
  <OldGalleryItem v-else />
</template>

<script lang="ts">
import GalleryItem from '@/components/gallery/GalleryItem.vue'
import OldGalleryItem from '@/components/bsx/Gallery/Item/GalleryItem.vue'

const { redesign } = useExperiments()

export default {
  name: 'GalleryItemPage',
  components: { GalleryItem, OldGalleryItem },
  setup() {
    return { redesign }
  },
}
</script>
