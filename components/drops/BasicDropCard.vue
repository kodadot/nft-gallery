<template>
  <div>
    <div
      v-if="!loading"
      class="border border-card-border-color hover:border-border-color bg-background-color group">
      <component
        :is="cardIs"
        class="flex flex-col hover:text-text-color"
        rel="nofollow noopener noreferrer"
        :to="to"
        @click="emit('click')">
        <img
          :src="image"
          :alt="name"
          class="group-hover:opacity-[0.85] h-[174px] object-cover w-full" />

        <div
          class="py-5 px-5 flex flex-col justify-between gap-4 border-t border-card-border-color">
          <span
            class="font-bold overflow-hidden text-ellipsis whitespace-nowrap text-xl"
            >{{ name }}</span
          >

          <div
            class="flex item-start sm:items-center flex-col sm:flex-row justify-between flex-wrap gap-y-4 gap-x-2">
            <div class="flex justify-between items-center min-h-[34px]">
              <TimeTag
                v-if="showTimeTag"
                :drop-start-time="dropStartTime"
                :drop-status="dropStatus" />
            </div>

            <div class="flex gap-2">
              <span class="text-k-grey">{{ $t('price') }}</span>
              <span v-if="isFreeDrop">{{ $t('free') }}</span>
              <Money v-else :value="price" :prefix="dropPrefix" inline />
            </div>
          </div>
        </div>
      </component>
    </div>

    <DropsDropCardSkeleton v-else />
  </div>
</template>

<script setup lang="ts">
import type { Prefix } from '@kodadot1/static'
import { DropStatus } from '@/components/drops/useDrops'
import TimeTag from './TimeTag.vue'

const emit = defineEmits(['click'])
withDefaults(
  defineProps<{
    image: string
    name: string
    showTimeTag: boolean
    dropStartTime: Date
    dropStatus: DropStatus
    isFreeDrop: boolean
    price: string
    dropPrefix?: Prefix
    loading?: boolean
    cardIs?: string | object
    to?: string
  }>(),
  {
    loading: false,
    cardIs: 'a',
    to: undefined,
    dropPrefix: 'ahp',
  },
)
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';
.is-ellipsis {
  @include mobile {
    white-space: unset;
  }
}
</style>
