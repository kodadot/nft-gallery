<template>
  <GenerativeMint />
</template>

<script lang="ts">
definePageMeta({
  layout: 'generative-mint-layout',
})
export default {
  name: 'GenerativeMintPage',
  components: {
    GenerativeMint: () => import('@/components/bsx/Create/GenerativeMint.vue'),
  },
  setup() {
    return {
      title: 'Mint Your Waifu',
      meta: [
        {
          name: 'description',
          content: 'Create yourself a uique Waifu NFT',
        },
      ],
    }
  },
}
</script>
