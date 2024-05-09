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
          :src="image || placeholder"
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
            <slot name="supply">
              <div>
                <span>{{ minted }}</span
                ><span class="text-k-grey">/{{ dropMax }}</span>
              </div>
            </slot>
            <CollectionDropCollectedBy
              v-if="ownerAddresses.length"
              :addresses="ownerAddresses"
              :max-address-count="3"
              size="small" />
            <DropsTimeTag
              v-else-if="dropStartTime"
              :drop-start-time="dropStartTime"
              :with-time="timeTagWithTime"
              :drop-status="dropStatus" />
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

const emit = defineEmits(['click'])
withDefaults(
  defineProps<{
    image: string | undefined
    name: string
    dropStartTime?: Date | null
    dropStatus: DropStatus
    dropPrefix?: Prefix
    loading?: boolean
    cardIs?: string | object
    to?: string
    timeTagWithTime?: boolean
    dropMax?: number
    minted?: number
    ownerAddresses?: string[]
  }>(),
  {
    loading: false,
    cardIs: 'a',
    to: undefined,
    dropStartTime: undefined,
    dropPrefix: 'ahp',
    minted: 0,
    dropMax: 0,
    timeTagWithTime: false,
    ownerAddresses: () => [],
  },
)

const { placeholder } = useTheme()
</script>
<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';
.is-ellipsis {
  @include mobile {
    white-space: unset;
  }
}
</style>
