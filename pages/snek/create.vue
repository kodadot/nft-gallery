<template>
  <section>
    <br />
    <b-tabs v-model="activeTab" destroy-on-hide expanded>
      <b-tab-item
        v-for="component in components"
        :key="component"
        :label="component">
        <component
          :is="component"
          v-if="components[activeTab] === component"
          :show-explainer-text="showExplainerText"
          @navigateToCreateNftTab="switchToNft" />
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import CreateMixin from '~/utils/mixins/createMixin'

const Collection = () =>
  import('@/components/bsx/Create/CreateCollectionParent.vue')
const NFT = () => import('@/components/bsx/Create/CreateToken.vue')

const components = { Collection, NFT }

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
      url: '/snek/create',
      image: `${this.$config.public.baseUrl}/k_card.png`,
    }
    return {
      title,
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: this.$root.$config.public.baseUrl + this.$route.path,
        },
      ],
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
