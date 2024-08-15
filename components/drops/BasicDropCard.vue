<template>
  <div>
    <div
      v-if="!loading"
      class="border border-card-border-color hover:border-border-color bg-background-color group"
    >
      <component
        :is="cardIs"
        class="flex flex-col hover:text-text-color"
        rel="nofollow noopener noreferrer"
        :to="to"
        @click="emit('click')"
      >
        <img
          :src="image || placeholder"
          :alt="name"
          class="group-hover:opacity-[0.85] aspect-square object-cover w-full"
        >

        <div
          class="min-h-[115px] py-5 px-2 sm:!px-5 flex flex-col justify-between gap-4 border-t border-card-border-color"
        >
          <div class="flex flex-col gap-2 min-h-[60px]">
            <div class="flex justify-between items-center">
              <span
                class="font-bold overflow-hidden text-ellipsis whitespace-nowrap text-xl"
              >{{ name }}</span>
              <DropsChainPill :prefix="dropPrefix" />
            </div>

            <div
              v-if="dropCreator"
              class="flex gap-2 items-center"
            >
              <ProfileAvatar
                :size="24"
                :address="dropCreator"
              />
              <IdentityIndex
                :address="dropCreator"
                hide-identity-popover
              />
            </div>
          </div>
          <div
            class="h-[28px] flex justify-between items-center flex-wrap gap-y-4 gap-x-2"
          >
            <div class="flex gap-4">
              <slot name="supply">
                <div>
                  <span>{{ minted }}</span><span class="text-k-grey text-xs">/{{ dropMax }}</span>
                </div>
              </slot>
              <div
                v-if="Number(dropPrice)"
                class="flex gap-1 items-baseline"
              >
                <span>{{ formattedPrice }}</span><span class="text-k-grey text-xs">USD</span>
              </div>
              <div
                v-else
              >
                <span>{{ $t('free') }}</span>
              </div>
            </div>

            <CollectionDropCollectedBy
              v-if="ownerAddresses.length"
              :addresses="ownerAddresses"
              :max-address-count="3"
              size="small"
            />
            <DropsTimeTag
              v-else-if="dropStartTime"
              :drop-start-time="dropStartTime"
              :with-time="timeTagWithTime"
              :drop-status="dropStatus"
            />
          </div>
        </div>
      </component>
    </div>

    <DropsDropCardSkeleton v-else />
  </div>
</template>

<script setup lang="ts">
import type { Prefix } from '@kodadot1/static'
import type { DropStatus } from '@/components/drops/useDrops'
import { chainPropListOf } from '@/utils/config/chain.config'

const emit = defineEmits(['click'])
const props = withDefaults(
  defineProps<{
    image: string | undefined
    name: string
    dropStartTime?: Date | null
    dropStatus: DropStatus
    dropPrefix?: Prefix | null
    loading?: boolean
    cardIs?: string | object
    to?: string
    timeTagWithTime?: boolean
    dropMax?: number
    minted?: number
    ownerAddresses?: string[]
    dropCreator?: string | null
    dropPrice?: string
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
    dropCreator: undefined,
    ownerAddresses: () => [],
  },
)

const { placeholder } = useTheme()

const chainPropList = chainPropListOf(props.dropPrefix)
const { usd: formattedPrice } = useAmount(
  computed(() => props.dropPrice),
  toRef(chainPropList.tokenDecimals),
  toRef(chainPropList.tokenSymbol),
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
