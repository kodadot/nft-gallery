<template>
  <nuxt-link :to="`/${urlPrefix}/collection/${collection.id}`">
    <div
      class="re-top-collections-item py-2 is-flex is-align-items-center is-justify-content-space-between is-clickable">
      <div class="is-flex is-align-items-center">
        <div class="p-4 has-text-weight-bold">
          {{ index }}
        </div>
        <div>
          <BasicImage
            custom-class="is-48x48 image-outline"
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

const BasicImage = defineAsyncComponent(
  () => import('@/components/shared/view/BasicImage.vue')
)

const Money = defineAsyncComponent(
  () => import('@/components/shared/format/Money.vue')
)

const { urlPrefix } = usePrefix()

defineProps<{
  collection: RowSeries
  index: number
}>()
</script>
