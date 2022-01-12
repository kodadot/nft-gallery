<template>
  <AdminPanel />
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'
import AdminPanel from '@/components/rmrk/Create/Admin/AdminPanel.vue'

@Component({
  components: {
    AdminPanel
  },
  head() {
    const title = 'KodaDot | Low fees and low carbon minting'
    const metaData = {
      title,
      description: 'Create carbonless NFTs with low on-chain fees',
      url: '/rmrk/admin',
      image: `${this.$config.baseUrl}/k_card_mint.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)]
    }
  }
})

export default class TransferPage extends Vue {
}
</script>
