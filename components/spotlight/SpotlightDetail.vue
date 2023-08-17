<template>
  <div class="columns">
    <div v-for="nft in nfts" :key="nft.id" class="column">
      <GalleryCard :id="nft.id" :name="nft.name" :metadata="nft.metadata" />
    </div>
  </div>
</template>

<script setup lang="ts">
import nftSimpleListByAccount from '@/queries/nftSimpleListByAccount.graphql'
import GalleryCard from '@/components/rmrk/Gallery/GalleryCard.vue'

const props = defineProps<{
  account: string
}>()

const nfts = ref([])
const { $apollo } = useNuxtApp()
const { client } = usePrefix()

useLazyAsyncData('data', async () => {
  const {
    data: { nftEntities },
  } = await $apollo.query({
    query: nftSimpleListByAccount,
    client: client.value,
    variables: {
      account: props.account,
      first: 4,
    },
    fetchPolicy: 'network-only',
  })

  nfts.value = nftEntities || []
})
</script>
