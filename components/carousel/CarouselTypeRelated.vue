<template>
  <div>
    <div ref="target"></div>
    <CarouselIndex
      v-if="nfts && targetIsVisible"
      :title="`${$t('nft.related')}`"
      :nfts="nfts" />
  </div>
</template>

<script lang="ts" setup>
import { useCarouselRelated } from './utils/useCarousel'

const props = defineProps<{
  collectionId: string
}>()

const { nfts } = await useCarouselRelated({ collectionId: props.collectionId })

const target = ref<HTMLHtmlElement>()
const targetIsVisible = useOnceIsVisible(target)
</script>
