<template>
  <div
    class="top-collection-card w-full border border-card-border-color hover:border-border-color bg-background-color group">
    <nuxt-link
      class="flex flex-col hover:text-text-color"
      rel="nofollow noopener noreferrer"
      :to="`/${urlPrefix}/collection/${collection.id}`">
      <div
        class="top-collection-card-banner group-hover:opacity-[0.85] bg-center bg-cover"
        :style="{ backgroundImage: `url(${collection.image})` }">
        <div class="top-collection-card-banner-avatar-container">
          <BasicImage
            custom-class="top-collection-card-banner-avatar-inner [&>img]:border [&>img]:border-card-border-color !p-0"
            :src="collection.image || placeholder" />
        </div>
      </div>

      <div class="top-collection-card-info border-t border-card-border-color">
        <p
          class="collection-name font-bold text-base whitespace-nowrap text-center truncate">
          {{ collection.name }}
        </p>

        <div class="info-fields">
          <div v-if="collection.floorPrice || collection.floor">
            <p class="capitalize text-k-grey text-xs">
              {{ $t('price') }}
            </p>

            <div class="flex gap-2 items-center">
              <CommonTokenMoney
                :value="collection.floorPrice || collection.floor"
                inline
                :round="2" />

              <div v-if="formattedDiffPercent" :class="color" class="text-xs">
                {{ formattedDiffPercent }}
              </div>
            </div>
          </div>

          <div>
            <p class="capitalize text-k-grey text-end text-xs">
              {{ $t('volume') }}
            </p>
            <div class="flex gap-2 items-center">
              <CommonTokenMoney :value="volume" inline :round="1" />
            </div>
          </div>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
import { TimeRange } from '~/components/series/types'
import { CollectionEntityWithVolumes } from '../utils/types'

const props = defineProps<{
  collection: CollectionEntityWithVolumes
  timeRange?: TimeRange
}>()

const { placeholder } = useTheme()
const { urlPrefix } = usePrefix()

const timeRange = computed(() => props.timeRange || 'Month')

const { diffPercent, formattedDiffPercent, volume } = useCollectionVolume(
  props.collection,
  timeRange,
)

const color = computed(() => {
  if (!diffPercent.value) {
    return undefined
  }
  return diffPercent.value < 0 ? 'text-k-red' : 'text-k-green'
})
</script>

<style lang="scss" scoped>
@import './TopCollectionsCard.scss';
</style>
