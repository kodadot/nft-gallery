<template>
  <ProfileDetail />
</template>

<script lang="ts">
import ProfileDetail from '@/components/Profile/ProfileDetail.vue'

export default {
  name: 'Profile',
  components: {
    ProfileDetail,
  },
  layout(context) {
    return context.query.redesign === 'true' ? 'explore-layout' : 'default'
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
