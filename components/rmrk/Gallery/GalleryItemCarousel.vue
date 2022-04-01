<template>
  <div>
    <div class="my-5">
      <p class="subtitle is-size-4">{{ title }}</p>
      <CarouselCardList :nfts="data" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { CarouselNFT } from '@/components/base/types'

@Component({
  components: {
    CarouselCardList: () => import('@/components/base/CarouselCardList.vue'),
  },
})
/**
 * class name
 */
export default class GalleryItemCarousel extends Vue {
  @Prop({ type: Array, required: true }) data!: CarouselNFT[]
  @Prop({ type: String, required: true }) title!: string
}
</script>
