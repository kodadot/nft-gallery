<template>
  <div v-if="redesign" class="container">
    <Items />
  </div>
  <CollectionItem v-else />
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import CollectionItem from '@/components/rmrk/Gallery/CollectionItem.vue'
import { generateCollectionImage } from '~/utils/seoImageGenerator'
import ExperimentMixin from '@/utils/mixins/experimentMixin'
import Items from '@/components/items/Items.vue'

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
    Items,
  },
  layout(context) {
    return context.query.redesign === 'true' ? 'explore-layout' : 'default'
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
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
})
export default class CollectionItemPage extends mixins(ExperimentMixin) {
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
