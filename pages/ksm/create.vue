<template>
  <section>
    <br />
    <b-tabs v-model="activeTab" destroy-on-hide expanded>
      <b-tab-item v-for="x in components" :key="x" :label="x">
        <component
          :is="x"
          v-if="components[activeTab] === x"
          @navigateToCreateNftTab="switchToNft" />
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import CreateMixin from '~/utils/mixins/createMixin'

const Collection = () => import('@/components/rmrk/Create/Create.vue')
const NFT = () => import('@/components/rmrk/Create/CreateToken.vue')

const components = { Collection, NFT }

@Component({ components })
export default class RmrkCreatePage extends mixins(CreateMixin) {
  layout() {
    return 'centered-half-layout'
  }

  protected switchToNft() {
    this.switchToCreateNFT()
    this.showExplainerText = true
  }
}
</script>
