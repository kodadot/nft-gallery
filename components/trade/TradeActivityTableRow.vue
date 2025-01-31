<template>
  <div
    v-if="isDesktop"
    class="flex items-stretch gap-3 py-[.6rem]"
  >
    <div class="flex-1 overflow-hidden">
      <TradeActivityTableRowItem
        :id="offered.id"
        :price="offered.price"
      />
    </div>

    <div class="flex-auto max-w-10">
      <div class="flex items-center justify-start h-full">
        <NeoIcon
          icon="arrow-right-arrow-left"
          class="text-k-grey"
        />
      </div>
    </div>

    <div class="flex-1 overflow-hidden">
      <TradeActivityTableRowItemCollection
        v-if="trade.isAnyTokenInCollectionDesired"
        :trade="trade"
        :price="desired.price"
      />
      <TradeActivityTableRowItem
        v-else
        :id="desired.id"
        :price="desired.price"
      />
    </div>

    <!--
    <div class="flex-1 is-ellipsis">
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
    -->

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
        <template v-if="trade.expirationDate && !trade.isExpired">
          <div class="flex gap-3">
            <NeoIcon icon="clock" />
            <span>{{ formatToNow(trade.expirationDate, trade.isExpired) }}</span>
          </div>
        </template>
        <span v-else>
          {{ blank }}
        </span>
      </div>
    </div>

    <div class="flex-1">
      <div class="h-[50px] flex items-center">
        <TradeOwnerButton
          main-class="max-md:!w-full"
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
    <div class="flex flex-col gap-5">
      <div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-4 items-center">
        <div class="min-w-0 overflow-hidden">
          <TradeActivityTableRowItem
            :id="offered.id"
            :price="offered.price"
            container-spacing="gap-3"
          />
        </div>

        <NeoIcon
          icon="arrow-right-arrow-left"
          class="text-k-grey"
        />

        <div class="min-w-0 overflow-hidden flex justify-end">
          <TradeActivityTableRowItemCollection
            v-if="trade.isAnyTokenInCollectionDesired"
            :trade="trade"
            :price="desired.price"
          />
          <TradeActivityTableRowItem
            v-else
            :id="desired.id"
            :price="desired.price"
            container-spacing="gap-3"
          />
        </div>
      </div>

      <div class="flex gap-4">
        <div class="flex flex-1 items-center justify-between">
          <span class="text-sm text-k-grey">{{ $t('swap.counterparty') }}</span>

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

        <template v-if="trade.expirationDate && !trade.isExpired">
          <div class="flex gap-3">
            <NeoIcon icon="clock" />
            <span class="capitalize"> {{ $t('trades.expiresIn') }} {{ formatToNow(trade.expirationDate, trade.isExpired) }}</span>
          </div>
        </template>
        <span v-else>
          {{ blank }}
        </span>
      </div>
    </div>

    <TradeOwnerButton
      class="mt-5"
      main-class="!w-full"
      detailed
      :trade="trade"
      @click:main="$emit('select')"
      @click:counter-swap="$emit('counter-swap')"
    />
  </div>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
import { formatToNow } from '@/utils/format/time'
import { blank } from '@/components/collection/activity/events/eventRow/common'
import { type TradeNftItem } from '@/components/trade/types'

defineEmits(['select', 'counter-swap'])

const props = defineProps<{
  trade: TradeNftItem
  variant: ResponsiveVariant
  target: 'from' | 'to'
}>()

const getRowConfig = () => {
  const surcharge = props.trade.surcharge!

  const desired = props.trade.desired

  return {
    send: {
      id: props.trade.offered.id,
      price: surcharge === 'Send' ? props.trade.price : undefined,
      currentOwner: props.trade.offered.currentOwner,
    },
    receive: {
      id: desired?.id,
      price: surcharge === 'Receive' ? props.trade.price : undefined,
      currentOwner: desired?.currentOwner,
    },
  }
}

const { urlPrefix } = usePrefix()

const { send: offered, receive: desired } = getRowConfig()

const isDesktop = computed(() => props.variant === 'Desktop')

const targetAddress = computed(() => props.target === 'to' ? offered.currentOwner : props.trade.caller)


</script>
