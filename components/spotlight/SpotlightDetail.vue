<template>
  <div class="flex flex-col md:flex-row gap-3">
    <div v-for="nft in nfts.nftEntities" :key="nft.id" class="flex-1">
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

const { client } = usePrefix()
const { result: nfts } = useQuery(
  nftSimpleListByAccount,
  {
    account: props.account,
    first: 4,
  },
  { clientId: client.value },
)
</script>
