<template>
  <CreateCollection />
</template>

<script lang="ts">
import CreateCollection from '@/components/create/CreateCollection.vue'

export default {
  components: {
    CreateCollection,
  },
  layout() {
    return 'background-layout'
  },
  setup() {
    useHead({
      title: 'Create carbonless NFTs',
      meta: [
        {
          name: 'description',
          content: 'Create carbonless NFTs with low on-chain fees',
        },
      ],
    })
  },
}
</script>
