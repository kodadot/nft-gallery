<template>
  <AdminPanel />
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'
import AdminPanel from '@/components/rmrk/Create/Admin/AdminPanel.vue'
import createSiteMeta from '@/utils/createSiteMeta'

@Component({
  components: {
    AdminPanel
  },
  head() {
    const title = 'KodaDot | Low fees and low carbon minting'
    const metaData = {
      title: title,
      description: 'Create carbonless NFTs with low on-chain fees',
      url: 'https://nft.kodadot.xyz',
      image: '/k_card_mint.png',
    }
    return {
      title: title,
      meta: [...createSiteMeta(metaData)]
    }
  }
})

export default class TransferPage extends Vue {
}
</script>
