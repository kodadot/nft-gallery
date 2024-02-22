<template>
  <div
    class="w-full border border-card-border-color hover:border-border-color bg-background-color group">
    <nuxt-link
      class="flex flex-col hover:text-text-color"
      rel="nofollow noopener noreferrer"
      :to="`${collection?.id && `/${urlPrefix}/collection/${collection.id}`}`">
      <div
        class="h-[112px] md:h-[142px] flex items-center justify-center group-hover:opacity-[0.85] bg-center bg-cover"
        :class="[
          `${!collection && 'bg-k-shade animate-pulse'}`,
          `bg-[${collection?.image}]`,
        ]">
        <div class="border border-card-border-color w-[4.375rem] h-[4.375rem]">
          <BasicImage
            v-if="collection"
            custom-class="avatar-border [&>img]:border [&>img]:border-card-border-color !p-0"
            :src="collection?.image || placeholder" />
          <div v-else class="avatar-border relative">
            <NeoSkeleton
              no-margin
              :rounded="false"
              full-size
              class="border border-card-border-color" />
          </div>
        </div>
      </div>

      <div class="pt-3 pb-4 !px-6 border-t border-card-border-color">
        <p class="font-bold text-base whitespace-nowrap text-center truncate">
          <span v-if="collection?.name">{{ collection.name }}</span>
          <span v-else class="flex justify-center">
            <NeoSkeleton
              no-margin
              :rounded="false"
              width="160"
              height="24"
              class="!w-min" />
          </span>
        </p>

        <div
          class="mt-2 flex flex-col justify-between md:flex-row"
          :class="{ 'max-md:gap-2': !collection }">
          <div
            class="flex flex-row justify-between items-center md:flex-col md:items-start">
            <p class="capitalize text-k-grey text-xs">
              <span v-if="collection?.floorPrice || collection?.floor">
                {{ $t('price') }}
              </span>
              <NeoSkeleton
                v-else
                no-margin
                :rounded="false"
                width="40"
                height="12" />
            </p>

            <div
              v-if="collection?.floorPrice || collection?.floor"
              class="flex gap-2 items-center max-md:flex-row-reverse">
              <CommonTokenMoney
                :value="collection.floorPrice || collection.floor"
                inline
                :round="2" />

              <div v-if="formattedDiffPercent" :class="color" class="text-xs">
                {{ formattedDiffPercent }}
              </div>
            </div>
            <NeoSkeleton
              v-else
              no-margin
              :rounded="false"
              width="80"
              height="20"
              class="!w-min md:mt-1" />
          </div>

          <div
            class="flex flex-row justify-between items-center md:flex-col md:items-end">
            <p class="capitalize text-k-grey text-end text-xs">
              <span v-if="collection">{{ $t('volume') }}</span>
              <NeoSkeleton
                v-else
                no-margin
                :rounded="false"
                width="40"
                height="12" />
            </p>
            <div class="flex gap-2 items-center">
              <CommonTokenMoney
                v-if="collection"
                :value="volume"
                inline
                :round="1" />
              <NeoSkeleton
                v-else
                no-margin
                :rounded="false"
                width="80"
                class="md:mt-1"
                height="20" />
            </div>
          </div>
        </div>
      </div>
    </nuxt-link>
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
.avatar-border {
  @apply border-[6px] h-full border-text-color-inverse;
}
</style>
