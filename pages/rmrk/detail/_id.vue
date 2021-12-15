<template>
  <GalleryItem />
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'
import GalleryItem from '@/components/rmrk/Gallery/GalleryItem.vue'

@Component({
  components: {
    GalleryItem
  }
})

export default class GalleryItemPage extends Vue {
}
</script>
