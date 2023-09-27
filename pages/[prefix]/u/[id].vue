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
  setup() {
    const title = useHead({
      title: 'NFT Artist Profile on KodaDot',
      meta: [
        {
          name: 'description',
          content: 'Find more NFTs from this creator',
        },
      ],
    })
  },
}
</script>
