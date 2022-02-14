<template>
  <CollectionList />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import CollectionList from '@/components/rmrk/Collection/List/CollectionList.vue'

const components = {
  CollectionList,
}

@Component<CollectionListPage>({
  components,
  head() {
    const title = 'Low minting fees and carbonless NFTs'
    const metaData = {
      title,
      type: 'profile',
      description: 'Buy Carbonless NFTs on Kusama',
      url: '/rmrk/collections',
      image: `${this.$config.baseUrl}/k_card_collections.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
})
export default class CollectionListPage extends Vue {}
</script>
