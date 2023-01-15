<template>
  <CollectionItem />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import CollectionItem from '@/components/rmrk/Gallery/CollectionItem.vue'
import { generateCollectionImage } from '~/utils/seoImageGenerator'

type CurrentCollection = {
  name: string
  numberOfItems: number
  image: string
  description: string
}

@Component<CollectionItemPage>({
  name: 'CollectionItemPage',
  components: {
    CollectionItem,
  },
  head() {
    const title = this.currentlyViewedCollection.name
    const metaData = {
      title,
      type: 'profile',
      description: this.currentlyViewedCollection.description,
      url: this.$route.path,
      image: this.image,
    }
    return {
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: this.$root.$config.public.baseUrl + this.$route.path,
        },
      ],
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
})
export default class CollectionItemPage extends Vue {
  get currentlyViewedCollection(): CurrentCollection {
    return this.$store.getters['history/getCurrentlyViewedCollection']
  }

  get image(): string {
    return generateCollectionImage(
      this.currentlyViewedCollection.name,
      this.currentlyViewedCollection.numberOfItems,
      this.currentlyViewedCollection.image
    )
  }
}
</script>
