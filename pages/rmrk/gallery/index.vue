<template>
  <Gallery />
</template>

<script lang="ts" >
export default {
  head() {
    return {
      meta: [
        {
          property: 'og:title',
          content: 'test Low minting fees and carbonless NFTs'
        },
        {
          property: 'og:image',
          content: '/kodadot_gallery.png'
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
          content: '/kodadot_gallery.png'
        }
      ]
    }
  }
  // get defaultGalleryMetaImage(): string {
  //   // const url = new URL(window.location.href)
  //   return (
  //     '~/assets/kodadot_gallery.png'
  //   )
  // }
}
</script>

