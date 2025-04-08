<template>
  <div
    v-if="isDesktop"
    class="flex items-stretch gap-3 py-[.6rem]"
  >
    <div
      v-if="isSwap"
      class="flex-1 overflow-hidden"
    >
      <TradeActivityTableRowItem
        :item="offered.item"
        :surcharge="offered.surcharge"
      />
    </div>

    <div
      v-if="isSwap"
      class="flex-auto max-w-10"
    >
      <div class="flex items-center justify-start h-full">
        <NeoIcon
          icon="arrow-right-arrow-left"
          class="text-k-grey"
        />
      </div>
    </div>

    <!-- Offered -->
    <div class="flex-1 overflow-hidden">
      <TradeActivityTableRowItemCollection
        v-if="trade.isAnyTokenInCollectionDesired"
        :considered="trade.considered"
        :surcharge="desired.surcharge"
      />
      <TradeActivityTableRowItem
        v-else
        :item="desired.item"
        :surcharge="desired.surcharge"
      />
    </div>

    <div
      v-if="isOffer"
      class="flex-1 is-ellipsis"
    >
      <div class="h-[50px] flex items-center">
        <div
          v-if="parseInt(trade.price)"
          class="flex gap-2 items-center"
        >
          <span>{{ amount }}</span> <span class="text-k-grey text-sm">({{ price }})</span>
        </div>
        <div v-else>
          {{ blank }}
        </div>
      </div>
    </div>

    <div
      class="flex-1"
    >
      <div class="h-[50px] flex items-center gap-2">
        <ProfileAvatar
          :size="24"
          :address="targetAddress"
        />
        <nuxt-link
          :to="`/${urlPrefix}/u/${targetAddress}`"
          class="text-k-blue hover:text-k-blue-hover"
        >
          <IdentityIndex
            :address="targetAddress"
          />
        </nuxt-link>
      </div>
    </div>

    <div class="flex-1">
      <TradeTags
        class="h-full"
        :trade="trade"
      />
    </div>

    <div class="flex-1">
      <div class="h-[50px] flex items-center">
        <TradeExpiration :trade="trade" />
      </div>
    </div>

    <div class="flex-1">
      <div class="h-[50px] flex items-center">
        <TradeOwnerButton
          main-class="max-md:w-full!"
          detailed
          :trade="trade"
          @click:main="$emit('select')"
          @click:counter-swap="$emit('counter-swap')"
        />
      </div>
    </div>
  </div>
  <!-- Mobile -->
  <div
    v-else
    class="mb-6 flex flex-col"
  >
    <div
      class="flex flex-col"
      :class="[mobileGap]"
    >
      <div
        v-if="isSwap"
        class="flex justify-between items-center"
      >
        <span class="text-k-grey text-sm">{{ $t(`trades.${directionKey}.send`) }}</span>
        <span class="text-k-grey text-sm">{{ $t(`trades.${directionKey}.receive`) }}</span>
      </div>

      <div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-4 items-center">
        <template v-if="isSwap">
          <div class="min-w-0 overflow-hidden">
            <TradeActivityTableRowItem
              :item="offered.item"
              :surcharge="offered.surcharge"
              container-spacing="gap-3"
            />
          </div>

          <NeoIcon
            icon="arrow-right-arrow-left"
            class="text-k-grey"
          />
        </template>

        <div
          class="min-w-0 overflow-hidden flex"
          :class="{ 'justify-end': isSwap }"
        >
          <TradeActivityTableRowItemCollection
            v-if="trade.isAnyTokenInCollectionDesired"
            :considered="trade.considered"
            :surcharge="desired.surcharge"
          />
          <TradeActivityTableRowItem
            v-else
            :item="desired.item"
            :surcharge="desired.surcharge"
            container-spacing="gap-3"
          />
        </div>
      </div>

      <template v-if="isOffer">
        <div
          v-if="parseInt(trade.price)"
          class="flex gap-2 items-center"
        >
          <span>{{ amount }}</span> <span class="text-k-grey text-sm">({{ price }})</span>
        </div>
        <div v-else>
          {{ blank }}
        </div>
      </template>

      <div
        class="flex flex-col"
        :class="[{ 'flex-col-reverse': isOffer }, mobileGap]"
      >
        <div class="flex gap-4">
          <div
            class="flex flex-1 items-center"
            :class="{ 'justify-between': isSwap, 'gap-3': isOffer }"
          >
            <span
              v-if="isOffer"
              class="text-xs"
            >{{ $t(`activity.event.${target}`) }}:</span>
            <span
              v-else
              class="text-sm text-k-grey"
            >{{ $t('swap.counterparty') }}</span>

            <div class="flex items-center gap-2">
              <ProfileAvatar
                :size="24"
                :address="targetAddress"
              />
              <nuxt-link
                :to="`/${urlPrefix}/u/${targetAddress}`"
                class="text-k-blue hover:text-k-blue-hover"
              >
                <IdentityIndex
                  :address="targetAddress"
                />
              </nuxt-link>
            </div>
          </div>
        </div>

        <div class="flex flex-1 justify-between">
          <TradeTags :trade="trade" />

          <TradeExpiration
            :trade="trade"
            with-prefix
          />
        </div>
      </div>
    </div>

    <TradeOwnerButton
      class="mt-5"
      main-class="w-full!"
      detailed
      :trade="trade"
      @click:main="$emit('select')"
      @click:counter-swap="$emit('counter-swap')"
    />
  </div>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
import { blank } from '@/components/collection/activity/events/eventRow/common'
import type { TradeNftItem, TradeConsidered, TradeToken } from '@/components/trade/types'
import type { SwapSurcharge } from '@/composables/transaction/types'

type TradeItem = { item: TradeToken | TradeConsidered, surcharge: SwapSurcharge }

defineEmits(['select', 'counter-swap'])

const props = defineProps<{
  trade: TradeNftItem
  variant: ResponsiveVariant
  target: 'from' | 'to'
}>()

const { chainSymbol, decimals } = useChain()

const { formatted: amount, usd: price } = useAmount(
  computed(() => props.trade?.price),
  decimals,
  chainSymbol,
)

const getRowConfig = (): { offered: TradeItem, desired: TradeItem } => {
  const direction = props.trade.surcharge!
  const surcharge = props.trade.surcharge ? { amount: props.trade.price, direction: 'Send' } : undefined

  const desired = props.trade.desired

  const offered = {
    item: props.trade.offered,
    surcharge: direction === 'Send' ? surcharge : undefined,
  } as TradeItem

  return props.target === 'from'
    ? ({
        offered,
        desired: {
          item: desired,
          surcharge: direction === 'Receive' ? surcharge : undefined,
        } as TradeItem,
      })
    : ({
        offered,
        desired: {
          item: (props.trade.isAnyTokenInCollectionDesired ? props.trade.considered : props.trade.desired),
          surcharge: direction === 'Receive' ? surcharge : undefined,
        } as TradeItem,
      })
}

const { urlPrefix } = usePrefix()

const { offered, desired } = getRowConfig()

const { isOffer, isSwap } = useTradeType(computed(() => props.trade))

const targetAddress = computed(() => props.target === 'to' ? (props.trade.desired || props.trade.considered).currentOwner : props.trade.caller)
const directionKey = computed(() => props.target === 'to' ? 'outgoing' : 'incoming')

const mobileGap = computed(() => isOffer.value ? 'gap-[10px]' : 'gap-5')
const isDesktop = computed(() => props.variant === 'Desktop')
</script>
