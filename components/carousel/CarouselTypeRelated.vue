<template>
  <div ref="target"></div>
  <CarouselIndex
    v-if="nfts && targetIsVisible"
    :title="`${$t('nft.related')}`"
    :nfts="nfts" />
</template>

<script lang="ts" setup>
import { useCarouselRelated } from './utils/useCarousel'

const props = defineProps<{
  collectionId: string
}>()

const { nfts } = await useCarouselRelated({ collectionId: props.collectionId })

const target = ref(null)
const targetIsVisible = ref(false)

useIntersectionObserver(target, ([{ isIntersecting }]) => {
  // set visible only once
  if (!targetIsVisible.value && isIntersecting) {
    targetIsVisible.value = isIntersecting
  }
})
</script>
