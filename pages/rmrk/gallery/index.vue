<template>
  <Gallery />
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'

@Component<GalleryPage>({
  head() {
    const title = 'Low minting fees and carbonless NFTs'
    const metaData = {
      title,
      type: 'profile',
      description: 'Buy Carbonless NFTs on Kusama',
      url: '/rmrk/gallery',
      image: `${this.$config.baseUrl}/k_card_gallery.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)]
    }
  }
})
export default class GalleryPage extends Vue {
}
</script>

