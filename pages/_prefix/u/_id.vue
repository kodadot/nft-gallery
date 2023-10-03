<template>
  <div>
    <ProfileDetail />
    <ListingCartMini />
    <ListingCartModal />
  </div>
</template>

<script lang="ts">
import ProfileDetail from '@/components/profile/ProfileDetail.vue'

export default {
  name: 'Profile',
  components: {
    ProfileDetail,
  },
  layout() {
    return 'noFooter'
  },
  setup() {
    const { redesign } = useExperiments()

    return {
      redesign,
    }
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
