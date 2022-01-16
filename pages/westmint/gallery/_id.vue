<template>
  <GalleryItem />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import GalleryItem from '@/components/unique/Gallery/Item/GalleryItem.vue'

@Component({
  components: {
    GalleryItem,
  },
})
export default class GalleryItemPage extends Vue {}
</script>
