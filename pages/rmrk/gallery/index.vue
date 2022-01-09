<template>
  <Gallery />
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'
import createSiteMeta from '@/utils/createSiteMeta'

@Component<GalleryPage>({
  head() {
    const title = 'Low minting fees and carbonless NFTs'
    const metaData = {
      title: title,
      description: 'Buy Carbonless NFTs on Kusama',
      url: `${this.$config.baseUrl}/rmrk/gallery`,
      image: `${this.$config.baseUrl}/k_card_gallery.png`,
    }
    return {
      title: title,
      meta: [...createSiteMeta(metaData)]
    }
  }
})
export default class GalleryPage extends Vue {
}
</script>

