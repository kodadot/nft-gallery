<template>
  <Gallery />
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'

@Component<GalleryPage>({
  metaInfo() {
    return {
      meta: [
        {
          property: 'og:title',
          content: 'Low minting fees and carbonless NFTs'
        },
        {
          property: 'og:image',
          content: this.defaultGalleryMetaImage
        },
        {
          property: 'og:description',
          content: 'Buy Carbonless NFTs on Kusama'
        },
        {
          property: 'twitter:title',
          content: 'Low minting fees and carbonless NFTs'
        },
        {
          property: 'twitter:description',
          content: 'Buy Carbonless NFTs on Kusama'
        },
        {
          property: 'twitter:image',
          content: this.defaultGalleryMetaImage
        }
      ]
    }
  },
})
export default class GalleryPage extends Vue {
  get defaultGalleryMetaImage(): string {
    return (
      `${this.$config.ALIENS}/k_card_gallery.png`
    )
  }
}
</script>

