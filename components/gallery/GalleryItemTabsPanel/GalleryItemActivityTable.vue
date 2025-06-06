<template>
  <div
    class="gallery-item-activity-table flex flex-col"
    data-testid="gallery-item-activity-table"
  >
    <NeoTable
      v-if="events.length"
      :data="events"
      hoverable
      class="py-5 bulma-mobile:pt-0"
    >
      <!-- event name -->
      <NeoTableColumn
        v-slot="props"
        width="20%"
        field="interaction"
        :label="$t('tabs.tabActivity.event')"
      >
        {{ props.row.interaction.toLowerCase() }}
      </NeoTableColumn>

      <!-- price -->
      <NeoTableColumn
        v-slot="props"
        width="20%"
        field="meta"
        :label="$t(`amount`)"
      >
        <p v-if="Number(props.row.meta)">
          {{ formatPrice(props.row.meta).amount }}
          <span class="text-k-grey">{{ formatPrice(props.row.meta).price }}</span>
        </p>
      </NeoTableColumn>

      <!-- from -->
      <NeoTableColumn
        v-slot="props"
        width="20%"
        field="caller"
        :label="$t('tabs.tabActivity.from')"
      >
        <nuxt-link
          v-if="props.row.interaction === 'BUY'"
          :to="`/${urlPrefix}/u/${props.row.currentOwner}`"
          class="text-k-blue hover:text-k-blue-hover"
        >
          <Identity :address="props.row.currentOwner" />
        </nuxt-link>
        <nuxt-link
          v-else
          :to="`/${urlPrefix}/u/${props.row.caller}`"
          class="text-k-blue hover:text-k-blue-hover"
        >
          <Identity :address="props.row.caller" />
        </nuxt-link>
      </NeoTableColumn>

      <!-- to -->
      <NeoTableColumn
        v-slot="props"
        width="20%"
        field="currentOwner"
        :label="$t('tabs.tabActivity.to')"
      >
        <div v-if="props.row.caller !== props.row.currentOwner">
          <nuxt-link
            v-if="props.row.interaction === 'BUY'"
            :to="`/${urlPrefix}/u/${props.row.caller}`"
            class="text-k-blue hover:text-k-blue-hover"
          >
            <Identity :address="props.row.caller" />
          </nuxt-link>
          <nuxt-link
            v-else
            :to="`/${urlPrefix}/u/${props.row.currentOwner}`"
            class="text-k-blue hover:text-k-blue-hover"
          >
            <Identity :address="props.row.currentOwner" />
          </nuxt-link>
        </div>
        <nuxt-link
          v-else-if="props.row.interaction === 'SEND'"
          :to="`/${urlPrefix}/u/${props.row.meta}`"
          class="text-k-blue hover:text-k-blue-hover"
        >
          <Identity :address="props.row.meta" />
        </nuxt-link>
      </NeoTableColumn>

      <!-- date -->
      <NeoTableColumn
        v-slot="props"
        width="20%"
        field="timestamp"
        :label="$t('tabs.tabActivity.date')"
      >
        <NeoTooltip
          :label="parseDate(props.row.timestamp)"
          position="left"
        >
          <span class="whitespace-nowrap">{{
            formatToNow(props.row.timestamp)
          }}</span>
        </NeoTooltip>
      </NeoTableColumn>
    </NeoTable>
    <div
      v-else-if="loading"
      class="p-5"
    >
      <NeoSkeleton
        animated
        size="large"
        :count="3"
      />
    </div>
    <div
      v-else
      class="p-5"
    >
      {{ $t('tabs.tabActivity.empty') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NeoSkeleton,
  NeoTable,
  NeoTableColumn,
  NeoTooltip,
} from '@kodadot1/brick'
import itemEvents from '@/queries/subsquid/general/itemEvents.graphql'

import Identity from '@/components/identity/IdentityIndex.vue'
import { formatToNow } from '@/utils/format/time'
import { parseDate } from '@/utils/datetime'

import type { Interaction } from '@/types'
import useSubscriptionGraphql from '@/composables/useSubscriptionGraphql'

const dprops = defineProps<{
  nftId: string
  interactions: string[]
}>()

const { urlPrefix, client } = usePrefix()
const { format: formatPrice } = useFormatAmount()

const interaction = computed(() =>
  dprops.interactions.map((key) => {
    if (['ahk', 'ahp', 'base'].includes(urlPrefix.value)) {
      switch (key) {
        case 'MINTNFT':
          return 'MINT'
        case 'CONSUME':
          return 'BURN'
      }
    }
    return key
  }),
)

const {
  data,
  pending: loading,
  refresh,
} = await useAsyncQuery({
  query: itemEvents,
  variables: {
    id: dprops.nftId,
    interaction: interaction.value,
    limit: 100,
  },
  clientId: client.value,
})

useSubscriptionGraphql({
  query: `
  events (
    where: { nft: { id_eq: "${dprops.nftId}" }, interaction_in: [${interaction.value}] }
    orderBy: timestamp_DESC
    limit: 5
  ) {
    id
    interaction
    timestamp
    meta
  }`,
  onChange: refresh,
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
</script>

<style scoped>
@reference '@/assets/css/tailwind.css';

.gallery-item-activity-table {
  overflow-y: auto;

  :deep(table tr > *:first-child) {
    @apply bulma-desktop:pl-8;
  }
}

.gallery-item-activity-table {
  :deep(.o-table__td) {
    @apply bulma-touch:border-inherit;

    &:before {
      @apply bulma-touch:font-normal;
    }
  }
}
</style>
