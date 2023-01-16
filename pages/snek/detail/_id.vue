<template>
  <GalleryItem />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import GalleryItem from '@/components/bsx/Gallery/Item/GalleryItem.vue'

@Component<GalleryItemPage>({
  name: 'GalleryItemPage',
  components: {
    GalleryItem,
  },
  head() {
    return {
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: this.$root.$config.public.baseUrl + this.$route.path,
        },
      ],
    }
  },
})
export default class GalleryItemPage extends Vue {}
</script>
