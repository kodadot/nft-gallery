<template>
  <SimpleMint />
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'
import SimpleMint from '@/components/rmrk/Create/SimpleMint.vue'
import createSiteMeta from '@/utils/createSiteMeta'

@Component({
  components: {
    SimpleMint
  },
  head() {
    const title = 'KodaDot | Low fees and low carbon minting'
    const metaData = {
      title: title,
      description: 'Create carbonless NFTs with low on-chain fees',
      url: `${this.$config.baseUrl}/mint`,
      image: `${this.$config.baseUrl}/k_card_mint.png`,
    }
    return {
      title: title,
      meta: [...createSiteMeta(metaData)]
    }
  }
})

export default class SimpleMintPage extends Vue {
}
</script>
