<template>
  <div>
    <ProfileDetail />
    <ListingCartMini />
    <ListingCartModal />
  </div>
</template>

<script lang="ts">
import ProfileDetail from '@/components/profile/ProfileDetail.vue'

definePageMeta({
  layout: 'no-footer',
})

export default {
  name: 'Profile',
  components: {
    ProfileDetail,
  },
  head() {
    const title = 'NFT Artist Profile on KodaDot'
    const metaData = {
      title,
      type: 'profile',
      description: 'Find more NFTs from this creator',
      url: this.$route.path,
      // image: this.firstNFTData.image || this.defaultNFTImage,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
}
</script>
