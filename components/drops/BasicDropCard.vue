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
          class="group-hover:opacity-[0.85] aspect-video object-cover w-full" />

        <div
          class="min-h-[115px] py-5 px-2 sm:!px-5 flex flex-col justify-between gap-4 border-t border-card-border-color">
          <span
            class="font-bold overflow-hidden text-ellipsis whitespace-nowrap text-xl"
            >{{ name }}</span
          >

          <div
            class="h-[28px] flex justify-between items-center flex-wrap gap-y-4 gap-x-2">
            <!-- <div>
              <span>{{ mintedCount }}</span
              ><span class="text-k-grey">/{{ drop.max }}</span>
            </div> -->
            <!-- <TimeTag
              v-if="dropStartTime && !ownerAddresses.length"
              :drop-start-time="drop.dropStartTime"
              :drop-status="drop.status" /> -->
            <!-- <CollectionDropCollectedBy
              v-if="ownerAddresses.length"
              :addresses="ownerAddresses"
              :max-address-count="3"
              size="small" /> -->
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
// import TimeTag from './TimeTag.vue'

const emit = defineEmits(['click'])
withDefaults(
  defineProps<{
    image: string
    name: string
    showTimeTag: boolean
    dropStartTime?: Date | null
    dropStatus: DropStatus
    price: string | null
    dropPrefix?: Prefix
    loading?: boolean
    cardIs?: string | object
    to?: string
    timeTagWithTime?: boolean
  }>(),
  {
    loading: false,
    cardIs: 'a',
    to: undefined,
    dropStartTime: undefined,
    dropPrefix: 'ahp',
    timeTagWithTime: false,
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
