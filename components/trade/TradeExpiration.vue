<template>
  <div
    v-if="trade.expirationDate && !trade.isExpired"
    class="flex gap-3"
  >
    <NeoIcon icon="clock" />
    <span class="capitalize"> {{ label }}</span>
  </div>
  <span v-else>
    {{ blank }}
  </span>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
import { formatToNow } from '@/utils/format/time'
import type { TradeNftItem } from '@/components/trade/types'
import { blank } from '@/components/collection/activity/events/eventRow/common'

const props = defineProps<{
  trade: TradeNftItem
  withPrefix?: boolean
}>()

const { $i18n } = useNuxtApp()

const label = computed(() => {
  const formatted = formatToNow(props.trade.expirationDate, props.trade.isExpired)

  return props.withPrefix ? `${$i18n.t('trades.expiresIn')} ${formatted}` : formatted
})
</script>
