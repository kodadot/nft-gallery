<template>
  <section>
    <br />
    <b-tabs v-model="activeTab" destroy-on-hide expanded>
      <b-tab-item v-for="x in components" :key="x" :label="x">
        <component
          :is="x"
          v-if="components[activeTab] === x"
          :show-explainer-text="showExplainerText"
          @navigateToCreateNftTab="switchToNft" />
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import CreateMixin from '@/utils/mixins/createMixin'

const Collection = () =>
  import('@/components/bsx/Create/CreateCollectionPage.vue')
const NFT = () => import('@/components/bsx/Create/CreateToken.vue')

const components = { Collection, NFT }

@Component<StatemineCreatePage>({
  components,
  layout() {
    return 'centered-half-layout'
  },
  head() {
    const title = 'KodaDot | Low fees and low carbon minting'
    const metaData = {
      title,
      type: 'article',
      description: 'Create carbonless NFTs with low on-chain fees',
      url: '/stmn/create',
      image: `${this.$config.public.baseUrl}/k_card.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
})
export default class StatemineCreatePage extends mixins(CreateMixin) {
  public showExplainerText = false

  public switchToNft() {
    this.switchToCreateNFT()
    this.showExplainerText = true
  }
}
</script>
