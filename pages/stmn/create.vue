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
import CreateMixin from '~/utils/mixins/createMixin'

const Collection = () => import('@/components/stmn/Create/CreateCollection.vue')
const NFT = () => import('@/components/stmn/Create/CreateToken.vue')

const components = { Collection, NFT }

@Component({ components })
export default class StmnCreatePage extends mixins(CreateMixin) {
  layout() {
    return 'centered-half-layout'
  }

  public showExplainerText = false

  protected switchToNft() {
    this.switchToCreateNFT()
    this.showExplainerText = true
  }
}
</script>
