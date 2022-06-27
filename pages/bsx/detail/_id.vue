<template>
  <GalleryItem />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import GalleryItem from '@/components/rmrk/Gallery/GalleryItem.vue'
import { generateNftImage } from '@/utils/seoImageGenerator'
import { formatBalanceEmptyOnZero } from '@/utils/format/balance'

@Component<GalleryItemPage>({
  name: 'GalleryItemPage',
  components: {
    GalleryItem,
  },
  head() {
    const { title, description, author: content } = this.currentlyViewedItem
    const metaData = {
      title,
      type: 'profile',
      description,
      url: this.$route.path,
      image: this.image,
    }
    return {
      title,
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: this.$root.$config.baseUrl + this.$route.path,
        },
      ],
      meta: [
        ...this.$seoMeta(metaData),
        {
          hid: 'og:author',
          property: 'og:author',
          content,
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
