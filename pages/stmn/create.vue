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

<script lang="ts" setup>
import { defineAsyncComponent, ref } from 'vue'

const Collection = defineAsyncComponent(
  () => import('@/components/shared/create/Create.vue')
)
const NFT = defineAsyncComponent(
  () => import('@/components/stmn/Create/CreateToken.vue')
)

const components = [Collection, NFT]

const activeTab = ref(0)
const showExplainerText = ref(false)

const switchToNft = () => {
  switchToCreateNFT()
  showExplainerText.value = true
}

const switchToCreateNFT = () => {
  activeTab.value = components.findIndex((component) => component === NFT)
}
</script>
