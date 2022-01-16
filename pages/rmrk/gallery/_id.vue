<template>
  <GalleryItem />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import GalleryItem from '@/components/rmrk/Gallery/GalleryItem.vue';
import formatBalance from '@/utils/formatBalance';
import { generateNftImage } from '@/utils/seoImageGenerator';

@Component<GalleryItemPage>({
  name: 'GalleryItemPage',
  components: {
    GalleryItem,
  },
  head() {
    const title = this.currentlyViewedItem.name;
    const metaData = {
      title,
      type: 'profile',
      description: this.currentlyViewedItem.description,
      url: this.$route.path,
      image: this.image,
    };
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
    };
  },
})
export default class GalleryItemPage extends Vue {
  get currentlyViewedItem() {
    return this.$store.getters['history/getCurrentlyViewedItem'];
  }

  get currentPrice(): string {
    // need to remove whitespaces here since formatBalance return 'xxx KSM'
    const price =
      this.currentlyViewedItem.price !== '0'
        ? formatBalance(this.currentlyViewedItem.price, 12, 'KSM').replaceAll(
            ' ',
            ''
          )
        : '';
    return price;
  }

  get image(): string {
    return generateNftImage(
      this.currentlyViewedItem.name,
      this.currentPrice,
      this.currentlyViewedItem.image,
      this.currentlyViewedItem.mimeType
    );
  }
}
</script>
