<template>
  <div>
    <o-table v-if="events.length" :data="events" hoverable class="py-5">
      <!-- event name -->
      <o-table-column
        v-slot="props"
        width="10%"
        field="interaction"
        :label="$t('tabs.tabActivity.event')">
        {{ props.row.interaction }}
      </o-table-column>

      <!-- price -->
      <o-table-column
        v-slot="props"
        field="meta"
        :label="$t('tabs.tabActivity.price')">
        <p v-if="Number(props.row.meta)">
          {{ formatPrice(props.row.meta) }}
        </p>
      </o-table-column>

      <!-- from -->
      <o-table-column
        v-slot="props"
        field="caller"
        :label="$t('tabs.tabActivity.from')">
        <nuxt-link
          v-if="props.row.interaction === 'BUY'"
          :to="`/${urlPrefix}/u/${props.row.currentOwner}`"
          class="has-text-link">
          <Identity :address="props.row.currentOwner" />
        </nuxt-link>
        <nuxt-link
          v-else
          :to="`/${urlPrefix}/u/${props.row.caller}`"
          class="has-text-link">
          <Identity :address="props.row.caller" />
        </nuxt-link>
      </o-table-column>

      <!-- to -->
      <o-table-column
        v-slot="props"
        field="currentOwner"
        :label="$t('tabs.tabActivity.to')">
        <div v-if="props.row.caller !== props.row.currentOwner">
          <nuxt-link
            v-if="props.row.interaction === 'BUY'"
            :to="`/${urlPrefix}/u/${props.row.caller}`"
            class="has-text-link">
            <Identity :address="props.row.caller" />
          </nuxt-link>
          <nuxt-link
            v-else
            :to="`/${urlPrefix}/u/${props.row.currentOwner}`"
            class="has-text-link">
            <Identity :address="props.row.currentOwner" />
          </nuxt-link>
        </div>
      </o-table-column>

      <!-- date -->
      <o-table-column
        v-slot="props"
        field="timestamp"
        :label="$t('tabs.tabActivity.date')">
        <o-tooltip :label="parseDate(props.row.timestamp)" position="left">
          {{ formatToNow(props.row.timestamp) }}
        </o-tooltip>
      </o-table-column>
    </o-table>
    <div v-else-if="loading" class="p-5">
      <o-skeleton animated size="large" :count="5"></o-skeleton>
    </div>
    <div v-else class="p-5">{{ $t('tabs.tabActivity.empty') }}</div>
  </div>
</template>

<script setup lang="ts">
import { OSkeleton, OTable, OTableColumn, OTooltip } from '@oruga-ui/oruga'
import Identity from '@/components/identity/IdentityIndex.vue'

import { formatToNow } from '@/utils/format/time'
import formatBalance from '@/utils/formatBalance'
import { parseDate } from '@/utils/datetime'

import type { Interaction } from '@/components/rmrk/service/scheme'

const dprops = defineProps<{
  nftId: string
  interactions: string[]
}>()

const { decimals, unit } = useChain()
const { urlPrefix, tokenId, assets } = usePrefix()

const { data, loading } = useGraphql({
  queryName: 'itemEvents',
  clientName: urlPrefix.value,
  variables: {
    id: dprops.nftId,
    interaction: dprops.interactions,
  },
})

interface ItemEvents {
  events?: Interaction[]
}

const events = ref<Interaction[]>([])

watchEffect(() => {
  const itemEvents = data.value as unknown as ItemEvents

  if (itemEvents?.events?.length) {
    events.value = itemEvents.events
  }
})

const formatPrice = (price) => {
  const { symbol } = assets(tokenId.value)
  const tokenSymbol = urlPrefix.value === 'rmrk' ? unit.value : symbol

  return formatBalance(price, decimals.value, tokenSymbol)
}
</script>
