<template>
  <section>
    <br />
    <NeoTabs v-model="activeTab" destroy-on-hide expanded>
      <NeoTabItem v-for="x in components" :key="x" :label="x">
        <component
          :is="x"
          :show-explainer-text="showExplainerText"
          @navigateToCreateNftTab="switchToNft" />
      </NeoTabItem>
    </NeoTabs>
  </section>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import CreateMixin from '@/utils/mixins/createMixin'
import { NeoTabItem, NeoTabs } from '@kodadot1/brick'

const Collection = () =>
  import('@/components/bsx/Create/CreateCollectionPage.vue')
const NFT = () => import('@/components/bsx/Create/CreateToken.vue')

const components = { Collection, NFT, NeoTabItem, NeoTabs }

@Component<BsxCreatePage>({
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
      url: '/bsx/create',
      image: `${this.$config.public.baseUrl}/k_card.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
})
export default class BsxCreatePage extends mixins(CreateMixin) {
  public showExplainerText = false

  public switchToNft() {
    this.switchToCreateNFT()
    this.showExplainerText = true
  }
}
</script>
