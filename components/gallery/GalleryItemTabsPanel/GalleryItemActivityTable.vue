<template>
  <div class="gallery-item-activity-table is-flex is-flex-direction-column">
    <o-table
      v-if="events.length"
      :data="events"
      hoverable
      class="py-5 padding-top-mobile">
      <!-- event name -->
      <o-table-column
        v-slot="props"
        width="20%"
        field="interaction"
        :label="$t('tabs.tabActivity.event')">
        {{ props.row.interaction.toLowerCase() }}
      </o-table-column>

      <!-- price -->
      <o-table-column
        v-slot="props"
        width="20%"
        field="meta"
        :label="`${$t(`tabs.tabActivity.price`)} (${chainSymbol})`">
        <p v-if="Number(props.row.meta)">
          {{ formatPrice(props.row.meta) }}
        </p>
      </o-table-column>

      <!-- from -->
      <o-table-column
        v-slot="props"
        width="20%"
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
        width="20%"
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
        <nuxt-link
          v-else-if="props.row.interaction === 'SEND'"
          :to="`/${urlPrefix}/u/${props.row.meta}`"
          class="has-text-link">
          <Identity :address="props.row.meta" />
        </nuxt-link>
      </o-table-column>

      <!-- date -->
      <o-table-column
        v-slot="props"
        width="20%"
        field="timestamp"
        :label="$t('tabs.tabActivity.date')">
        <o-tooltip :label="parseDate(props.row.timestamp)" position="left">
          <span class="no-wrap">{{ formatToNow(props.row.timestamp) }}</span>
        </o-tooltip>
      </o-table-column>
    </o-table>
    <div v-else-if="loading" class="p-5">
      <o-skeleton animated size="large"></o-skeleton>
    </div>
    <div v-else class="p-5">{{ $t('tabs.tabActivity.empty') }}</div>
  </div>
</template>

<script setup lang="ts">
import { OSkeleton, OTable, OTableColumn, OTooltip } from '@oruga-ui/oruga'
import Identity from '@/components/identity/IdentityIndex.vue'

import { formatToNow } from '@/utils/format/time'
import formatBalance from '@/utils/format/balance'
import { parseDate } from '@/utils/datetime'

import type { Interaction } from '@/components/rmrk/service/scheme'
import useSubscriptionGraphql from '@/composables/useSubscriptionGraphql'

const dprops = defineProps<{
  nftId: string
  interactions: string[]
}>()

const { decimals, chainSymbol } = useChain()
const { urlPrefix, tokenId, assets } = usePrefix()

const interaction =
  urlPrefix.value === 'ksm'
    ? dprops.interactions.filter((i) => i !== 'MINTNFT' && i !== 'CONSUME')
    : dprops.interactions

const { data, loading, refetch } = useGraphql({
  queryName: 'itemEvents',
  clientName: urlPrefix.value,
  variables: {
    id: dprops.nftId,
    interaction,
    limit: 100,
  },
})

useSubscriptionGraphql({
  query: `
  events (
    where: { nft: { id_eq: "${dprops.nftId}" }, interaction_in: [${interaction}] }
    orderBy: timestamp_DESC
    limit: 5
  ) {
    id
    interaction
    timestamp
    meta
  }`,
  onChange: refetch,
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
  /** hiding unit temporarily */
  // const { symbol } = assets(tokenId.value)
  // const tokenSymbol = ['rmrk', 'ksm'].includes(urlPrefix.value)
  //   ? unit.value
  //   : symbol

  return formatBalance(price, decimals.value, false)
}
</script>
<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.gallery-item-activity-table {
  overflow-y: auto;
}

@include mobile {
  .padding-top-mobile {
    padding-top: 0 !important;
  }
}
</style>
