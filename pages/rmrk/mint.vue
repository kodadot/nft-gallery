<template>
  <SimpleMint />
</template>

<script lang="ts">
definePageMeta({
  layout: 'centered-half-layout',
})

export default {
  name: 'SimpleMintPage',
  components: {
    SimpleMint: () => import('@/components/rmrk/Create/SimpleMint.vue'),
  },
  setup() {
    useHead({
      title: 'Mint a new NFT',
      meta: [
        {
          name: 'description',
          content: 'Mint new NFT with low on-chain fees',
        },
      ],
    })
  },
}
</script>
