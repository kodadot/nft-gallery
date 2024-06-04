<template>
  <div>
    <LoadLazly>
      <CarouselIndex v-if="nfts" :title="`${$t('nft.related')}`" :nfts="nfts" />
    </LoadLazly>
  </div>
</template>

<script lang="ts" setup>
import { useCarouselRelated } from './utils/useCarousel'

const props = defineProps<{
  collectionId: string
}>()

const { nfts } = await useCarouselRelated({ collectionId: props.collectionId })
</script>
