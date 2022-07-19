<template>
  <GalleryItem />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import GalleryItem from '@/components/rmrk/Gallery/GalleryItem.vue'

@Component<GalleryItemPage>({
  name: 'GalleryItemPage',
  components: {
    GalleryItem,
  },
})
export default class GalleryItemPage extends Vue {}
</script>
