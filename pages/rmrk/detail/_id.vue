<template>
  <GalleryItem />
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'
import GalleryItem from '@/components/rmrk/Gallery/GalleryItem.vue'
import createSiteMeta from '@/utils/createSiteMeta'
import formatBalance from '@/utils/formatBalance'

@Component<GalleryItemPage>({
  name: 'GalleryItemPage',
  components: {
    GalleryItem
  },
  head() {
    const title = this.currentlyViewedItem.title
    const metaData = {
      title: title,
      description: this.currentlyViewedItem.description,
      url: `https://nft.kodadot.xyz/${this.$route.path}`,
      image: this.image,
    }
    return {
      title: title,
      meta: [
        ...createSiteMeta(metaData),
        { hid: 'og:author', property: 'og:author', content: this.currentlyViewedItem.author },
      ]
    }
  }
})

export default class GalleryItemPage extends Vue {
  get currentlyViewedItem() {
    return this.$store.getters['history/getCurrentlyViewedItem']
  }

  get currentPrice(): string {
    // need to remove whitespaces here since formatBalance return 'xxx KSM'
    const price = this.currentlyViewedItem.price !== '0' ? formatBalance(this.currentlyViewedItem.price, 12, 'KSM').replaceAll(' ', '') : ''
    return price
  }

  get image(): string {
    return `https://og-image-green-seven.vercel.app/${encodeURIComponent(this.currentlyViewedItem.name)}.png?price=${this.currentPrice}&image=${this.currentlyViewedItem.image}&mime=${this.currentlyViewedItem.mimeType}`
  }
}
</script>
