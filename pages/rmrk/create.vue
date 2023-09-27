<template>
  <section>
    <NeoTabs v-model="activeTab" expanded>
      <NeoTabItem v-for="x in components" :key="x" :label="x">
        <component
          :is="x"
          :show-explainer-text="false"
          :class-column="false"
          @navigateToCreateNftTab="switchToNft" />
      </NeoTabItem>
    </NeoTabs>
  </section>
</template>

<script lang="ts">
import { NeoTabItem, NeoTabs } from '@kodadot1/brick'

import Collection from '@/components/create/CreateCollection.vue'
import NFT from '@/components/rmrk/Create/CreateToken.vue'

const components = { Collection, NFT, NeoTabItem, NeoTabs }

definePageMeta({
  layout: 'centered-half-layout',
})

export default {
  name: 'RmrkCreatePage',
  components,
  setup() {
    const { activeTab, components, switchToNft } = useCreate()

    useHead({
      title: 'Create carbonless NFTs',
      meta: [
        {
          name: 'description',
          content: 'Create carbonless NFTs with low on-chain fees',
        },
      ],
    })

    return {
      activeTab,
      components,
      switchToNft,
    }
  },
}
</script>
