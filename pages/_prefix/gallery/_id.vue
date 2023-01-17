<template>
  <GalleryItem />
</template>

<script lang="ts">
import GalleryItem from '@/components/gallery/GalleryItem.vue'
import PrefixMixin from '@/utils/mixins/prefixMixin'
export default {
  name: 'GalleryItemPage',
  components: { GalleryItem },
  mixins: [PrefixMixin],
  beforeMount() {
    this.$store.dispatch('gallery/getGalleryItem', this.$route.params.id)
    const prefix = this.$route.params.prefix
    if (this.urlPrefix !== prefix) {
      this.$store.dispatch('setUrlPrefix', prefix)
      this.$router.go(0)
    }
  },
}
</script>
