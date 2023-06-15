<template>
  <section>
    <br />
    <NeoTabs v-model="activeTab" destroy-on-hide expanded>
      <NeoTabItem v-for="x in components" :key="x" :label="x">
        <component :is="x" @navigateToCreateNftTab="switchToNft" />
      </NeoTabItem>
    </NeoTabs>
  </section>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import CreateMixin from '@/utils/mixins/createMixin'
import { NeoTabItem, NeoTabs } from '@kodadot1/brick'

const Collection = () => import('@/components/rmrk/Create/Create.vue')
const NFT = () => import('@/components/rmrk/Create/CreateToken.vue')

const components = { Collection, NFT, NeoTabItem, NeoTabs }

@Component({ components })
export default class RmrkCreatePage extends mixins(CreateMixin) {
  layout() {
    return 'centered-half-layout'
  }

  public switchToNft() {
    this.switchToCreateNFT()
  }
}
</script>
