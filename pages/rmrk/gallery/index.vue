<template>
  <Gallery />
</template>

<script lang="ts">
export default{
  head() {
    return {
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'test Low minting fees and carbonless NFTs'
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: '/kodadot_gallery.png'
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: 'Buy Carbonless NFTs on Kusama'
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: 'Low minting fees and carbonless NFTs'
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content: 'Buy Carbonless NFTs on Kusama'
        },
        {
          hid: 'twitter:image',
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

