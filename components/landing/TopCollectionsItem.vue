<template>
  <nuxt-link :to="urlOf({ id: collection.id, url })">
    <div
      class="py-2 is-flex is-align-items-center is-justify-content-space-between is-clickable">
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
          <div class="has-text-weight-semibold">
            {{ collection.name | truncateStr(22) }}
          </div>
          <div class="has-text-grey is-size-7">
            Floor: <Money :value="collection.floorPrice" inline />
          </div>
        </div>
      </div>
      <div class="is-pulled-right has-text-right">
        <div
          :class="
            displayVolumePercent(
              collection.dailyVolume,
              collection.dailyrangeVolume,
              true
            )
          ">
          {{
            displayVolumePercent(
              collection.dailyVolume,
              collection.dailyrangeVolume
            )
          }}
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

function displayVolumePercent(
  priceNow: number,
  priceAgo: number,
  getClass?: boolean
) {
  /* added getClass for getting the class name for the row
   * it would be true when you want to return the class name
   */
  const vol = ((priceNow - priceAgo) / priceAgo) * 100
  if (vol === 0 || !parseFloat(String(vol)) || !isFinite(vol)) {
    return getClass ? '' : '---'
  }
  const volumePercent = Math.round(vol * 100) / 100

  if (getClass) {
    return volumePercent > 0 ? 'has-text-success' : 'has-text-danger'
  }

  return volumePercent > 0 ? `+${volumePercent}%` : `${volumePercent}%`
}

defineProps<{
  collection: RowSeries
  index: number
}>()
</script>
