<template>
  <div class="columns">
    <div v-for="nft in nfts.nftEntities" :key="nft.id" class="column">
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

const { result: nfts } = useQuery(nftSimpleListByAccount, {
  account: props.account,
  first: 4,
})
</script>
