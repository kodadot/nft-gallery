<template>
  <section>
    <br />
    <b-tabs v-model="activeTab" destroy-on-hide expanded>
      <b-tab-item v-for="x in components" :key="x" :label="x">
        <component
          :is="x"
          v-if="components[activeTab] === x"
          @navigateToCreateNftTab="switchToCreateNFT" />
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import CreateMixin from '~/utils/mixins/createMixin'

const Collection = () => import('@/components/bsx/Create/Create.vue')
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
      url: '/statemine/create',
      image: `${this.$config.baseUrl}/k_card_mint.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
})
export default class BsxCreatePage extends mixins(CreateMixin) {}
</script>
