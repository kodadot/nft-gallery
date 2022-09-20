<template>
  <div class="carousel-info">
    <nuxt-link
      :to="urlOf({ id: item.id, url })"
      class="has-text-weight-bold"
      :class="{ 'carousel-info-collection': isCollection }">
      <span class="carousel-info-name">{{ item.name }}</span>
      <span v-if="isCollection" class="carousel-info-arrow">----></span>
    </nuxt-link>

    <!-- TODO: collection name. currently `lastNftListByEvent` not provide collection name -->
    <!-- <p v-if="!isCollection" class="is-size-7">{collection.name}</p> -->

    <div v-if="item.price && !isCollection" class="carousel-meta">
      <Money :value="item.price" class="has-text-weight-bold" />
      <p class="is-size-7">{{ urlPrefix }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Money from '@/components/shared/format/Money.vue'
import type { CarouselNFT } from '@/components/base/types'

import { useCarouselUrl } from '../utils/useCarousel'

defineProps<{
  item: CarouselNFT
}>()

const { urlPrefix } = usePrefix()
const { urlOf } = useCarouselUrl()
const url = inject('itemUrl') as string
const isCollection = inject('isCollection')
</script>
