<template>
  <section>
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
const Collection = () => import('@/components/stmn/Create/CreateCollection.vue')
const NFT = () => import('@/components/stmn/Create/CreateToken.vue')

export default {
  components: {
    Collection,
    NFT,
  },
  layout: 'centered-half-layout',
  setup() {
    const { activeTab, showExplainerText, components, switchToNft } =
      useCreate()
    return {
      activeTab,
      showExplainerText,
      components,
      switchToNft,
    }
  },
}
</script>
