<template>
  <CollectionItem />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import CollectionItem from '@/components/rmrk/Gallery/CollectionItem.vue';

@Component<CollectionItemPage>({
  name: 'CollectionItemPage',
  components: {
    CollectionItem,
  },
  head() {
    const image = `https://og-image-green-seven.vercel.app/${encodeURIComponent(
      this.currentlyViewedCollection.name as string
    )}.png?price=Items:${this.currentlyViewedCollection.numberOfItems}&image=${
      this.currentlyViewedCollection.image as string
    }`;
    const title = this.currentlyViewedCollection.name;
    const metaData = {
      title,
      type: 'profile',
      description: this.currentlyViewedCollection.description,
      url: this.$route.path,
      image: image,
    };
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    };
  },
})
export default class CollectionItemPage extends Vue {
  get currentlyViewedCollection() {
    return this.$store.getters['history/getCurrentlyViewedCollection'];
  }
}
</script>
