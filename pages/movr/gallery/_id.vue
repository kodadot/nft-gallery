<template>
  <GalleryItem />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import GalleryItem from '@/components/movr/Gallery/Item/GalleryItem.vue'
import { generateNftImage } from '@/utils/seoImageGenerator'
import { formatBalanceEmptyOnZero } from '@/utils/format/balance'

@Component<GalleryItemPage>({
  name: 'GalleryItemPage',
  components: {
    GalleryItem,
  },
  head() {
    const title = this.currentlyViewedItem.title
    const metaData = {
      title,
      type: 'profile',
      description: this.currentlyViewedItem.description,
      url: this.$route.path,
      image: this.image,
    }
    return {
      title,
      meta: [
        ...this.$seoMeta(metaData),
        {
          hid: 'og:author',
          property: 'og:author',
          content: this.currentlyViewedItem.author,
        },
      ],
    }
  },
})
export default class GalleryItemPage extends Vue {
  get currentlyViewedItem() {
    return this.$store.getters['history/getCurrentlyViewedItem']
  }

  get image(): string {
    return generateNftImage(
      this.currentlyViewedItem.name,
      formatBalanceEmptyOnZero(this.currentlyViewedItem.price),
      this.currentlyViewedItem.image,
      this.currentlyViewedItem.mimeType
    )
  }
}
</script>
