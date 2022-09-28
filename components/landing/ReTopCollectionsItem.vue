<template>
  <nuxt-link :to="urlOf({ id: collection.id, url })">
    <div
      class="re-top-collections-item py-2 is-flex is-align-items-center is-justify-content-space-between is-clickable">
      <div class="is-flex is-align-items-center">
        <div class="p-4 has-text-weight-bold">
          {{ index }}
        </div>
        <div>
          <BasicImage
            custom-class="is-48x48"
            rounded
            :src="collection.image || '/placeholder.webp'" />
        </div>
        <div class="px-2">
          <div class="has-text-weight-bold">
            {{ collection.name | truncateStr(12) }}
          </div>
          <div class="has-text-grey is-size-7">
            Floor: <Money :value="collection.floorPrice" inline />
          </div>
        </div>
      </div>
      <div class="is-pulled-right has-text-right px-4">
        <div>
          <Money :value="collection.volume" inline />
        </div>
        <div class="has-text-grey is-size-7">
          avg. <Money :value="collection.averagePrice" inline />
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<script lang="ts" setup>
import { RowSeries } from '@/components/series/types'
import { useCarouselUrl } from '../carousel/utils/useCarousel'

const BasicImage = defineAsyncComponent(
  () => import('@/components/shared/view/BasicImage.vue')
)

const Money = defineAsyncComponent(
  () => import('@/components/shared/format/Money.vue')
)

const { urlOf } = useCarouselUrl()
const url = inject('itemUrl') as string

defineProps<{
  collection: RowSeries
  index: number
}>()
</script>

<style lang="scss">
.re-top-collections-item {
  background-color: white;
  color: black;
  border: 1px solid black;
  -webkit-box-shadow: 4px 4px 0 0 rgba(255, 255, 255, 0);
  box-shadow: 4px 4px 0 0 rgba(255, 255, 255, 0);
  -webkit-transition-duration: 0.4s;
  transition-duration: 0.4s;
  -webkit-transition-property: -webkit-box-shadow;
  transition-property: -webkit-box-shadow;
  transition-property: box-shadow;
  transition-property: box-shadow, -webkit-box-shadow;

  &:hover {
    -webkit-box-shadow: 4px 4px 0 0 rgb(0, 0, 0);
    box-shadow: 4px 4px 0 0 rgb(0, 0, 0);
  }
}

.dark-mode {
  .re-top-collections-item {
    background-color: #1a1718;
    color: white;
    border: 1px solid white;
    -webkit-box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0);
    box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0);

    &:hover {
      -webkit-box-shadow: 4px 4px 0 0 #fff;
      box-shadow: 4px 4px 0 0 #fff;
    }
  }
}
</style>
