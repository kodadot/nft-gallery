<template>
  <div
    v-if="collection"
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

            <div class="flex gap-2 items-center max-md:flex-row-reverse">
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
  <div v-else class="top-collection-card-skeleton border border-border-color">
    <div class="top-collection-card-skeleton-banner relative">
      <NeoSkeleton no-margin :rounded="false" full-size />

      <div class="top-collection-card-banner-avatar-container">
        <div class="top-collection-card-banner-avatar-inner relative">
          <NeoSkeleton
            no-margin
            :rounded="false"
            full-size
            class="border border-card-border-color" />
        </div>
      </div>
    </div>

    <div class="top-collection-card-skeleton-info">
      <div class="flex justify-center">
        <div class="relative w-40 h-6">
          <NeoSkeleton no-margin :rounded="false" full-size />
        </div>
      </div>

      <div class="info-fields">
        <div>
          <div class="relative w-10 h-3 mb-1">
            <NeoSkeleton no-margin :rounded="false" full-size />
          </div>
          <div class="relative w-20 h-5 mt-1">
            <NeoSkeleton no-margin :rounded="false" full-size />
          </div>
        </div>

        <div class="flex flex-col">
          <div class="relative w-10 h-3 mb-1">
            <NeoSkeleton no-margin :rounded="false" full-size />
          </div>
          <div class="relative w-20 h-5 mt-1">
            <NeoSkeleton no-margin :rounded="false" full-size />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TimeRange } from '~/components/series/types'
import { CollectionEntityWithVolumes } from './utils/types'
import { NeoSkeleton } from '@kodadot1/brick'

const props = defineProps<{
  collection?: CollectionEntityWithVolumes
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
.top-collection-card,
.top-collection-card-skeleton {
  @apply bg-background-color;

  &-banner {
    @apply h-[112px] md:h-[142px] flex items-center justify-center;

    &-avatar {
      &-container {
        @apply border border-card-border-color w-[4.375rem] h-[4.375rem];
      }
      &-inner {
        @apply border-[6px] h-full border-text-color-inverse;
      }
    }
  }

  &-info {
    @apply pt-3 pb-4 px-6;

    .collection-name {
      @apply text-base;
    }

    .info-fields {
      @apply mt-2 flex flex-col justify-between md:flex-row;

      > div {
        @apply flex flex-row justify-between items-center md:flex-col md:items-start;
      }

      > :nth-child(2) {
        @apply md:items-end items-center;
      }
    }
  }
}
</style>
