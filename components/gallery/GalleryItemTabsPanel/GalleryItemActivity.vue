<template>
  <div>
    <o-table v-if="events.length" :data="events" hoverable class="py-5">
      <!-- event name -->
      <o-table-column v-slot="props" field="interaction" label="Event">
        {{ props.row.interaction }}
      </o-table-column>

      <!-- price -->
      <o-table-column v-slot="props" field="meta" label="Price">
        <p v-if="props.row.interaction === 'ROYALTY'">{{ props.row.meta }}%</p>
        <p v-else-if="Number(props.row.meta)">
          {{ formatPrice(props.row.meta) }}
        </p>
      </o-table-column>

      <!-- from -->
      <o-table-column v-slot="props" field="caller" label="From">
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
      <o-table-column v-slot="props" field="currentOwner" label="To">
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
      <o-table-column v-slot="props" field="timestamp" label="Date">
        {{ formatToNow(props.row.timestamp) }}
      </o-table-column>
    </o-table>
  </div>
</template>

<script setup lang="ts">
import { OTable, OTableColumn } from '@oruga-ui/oruga'
import Identity from '@/components/identity/IdentityIndex.vue'

import { formatToNow } from '@/utils/format/time'
import formatBalance from '@/utils/formatBalance'

import type { Interaction } from '@/components/rmrk/service/scheme'

const dprops = defineProps<{
  nftId: string
}>()

const { decimals, unit } = useChain()
const { urlPrefix, tokenId, assets } = usePrefix()
const { data } = useGraphql({
  queryName: 'itemEvents',
  clientName: urlPrefix.value,
  variables: {
    id: dprops.nftId,
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

<style scoped></style>
