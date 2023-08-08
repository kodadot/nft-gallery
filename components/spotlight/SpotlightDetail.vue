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

watch(
  () => props.account,
  async (newAccount) => {
    await fetchNFT(newAccount)
  }
)

const fetchNFT = async (account: string) => {
  const nfts = await $apollo.query({
    query: nftSimpleListByAccount,
    client: client.value,
    variables: {
      account,
      first: 4,
    },
    fetchPolicy: 'network-only',
  })

  const {
    data: { nftEntities },
  } = nfts

  nfts.value = nftEntities || []
}
</script>
