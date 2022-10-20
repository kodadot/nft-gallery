<template>
  <GalleryItem />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import GalleryItem from '@/components/rmrk/Gallery/GalleryItem.vue'

const components = {
  GalleryItem,
}

@Component<GalleryItemPage>({
  name: 'GalleryItemPage',
  components,
})
export default class GalleryItemPage extends Vue {}
</script>
