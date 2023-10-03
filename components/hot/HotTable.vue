<template>
  <div>
    <Loader :modelValue="pending" />
    <NeoTable
      :data="hot"
      hoverable
      class="hot-sticky-header"
      td-class="is-vcentered">
      <NeoTableColumn v-slot="props" label="N°">
        {{ props.row.id }}
      </NeoTableColumn>
      <NeoTableColumn v-slot="props" label="Series Name">
        <nuxt-link :to="`/${urlPrefix}/collection/${props.row.collectionId}`">
          {{ props.row.name }}
        </nuxt-link>
      </NeoTableColumn>
      <NeoTableColumn v-slot="props" label="Buys">
        {{ props.row.buys }}
      </NeoTableColumn>
      <NeoTableColumn v-slot="props" label="Total Volume(KSM)">
        {{ props.row.totalVolume }}
      </NeoTableColumn>
      <NeoTableColumn v-slot="props" label="Last Sale Size(KSM)">
        {{ props.row.latestSoldSize }}
      </NeoTableColumn>
      <NeoTableColumn v-slot="props" label="Time Since Last Sale">
        {{ props.row.latestSoldTime }}
      </NeoTableColumn>

      <NeoTableColumn v-slot="props" label="Median Time Between Sales">
        {{ props.row.medianDate }}
      </NeoTableColumn>

      <template #empty>
        <div v-if="!pending" class="w-100 has-text-centered">
          {{ $t('spotlight.empty') }}
        </div>
        <NeoSkeleton :active="pending" />
      </template>
    </NeoTable>
  </div>
</template>

<script setup lang="ts">
import hotNfts from '@/queries/rmrk/subsquid/hotNfts.graphql'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'
import { NeoSkeleton, NeoTable, NeoTableColumn } from '@kodadot1/brick'
import formatBalance from '@/utils/format/balance'
import { getVolume } from '@/utils/math'
import { lastweekDate } from '@/components/series/utils'

const hot = ref([])
const { client, urlPrefix } = usePrefix()
const { decimals } = useChain()

const { pending, refresh: refreshHotNfts } = useLazyAsyncData(
  'data',
  async () => {
    const data = await fetchHotNfts()
    const collectionMap = groupBy(data, 'nft.collection.id')
    const sortOrder = [...new Set(data.map((e) => e.nft.collection.id))]
    const result = sortOrder.map((colId, idx) => {
      const collection = collectionMap[colId][0].nft.collection
      const nfts = sortBy(collectionMap[colId], 'timestamp').reverse()
      const totalVolume = toKSM(getVolume(nfts))
      const buys = nfts.length
      const latestSale = nfts[0]
      const medianIdx = Math.floor(buys / 2)
      return {
        id: idx + 1,
        collectionId: colId,
        name: collection.name,
        totalVolume,
        buys,
        latestSoldSize: toKSM(latestSale.meta),
        latestSoldTime: formatDistanceToNow(new Date(latestSale.timestamp)),
        medianDate: formatDistanceToNow(new Date(nfts[medianIdx].timestamp)),
        nfts,
      }
    })

    hot.value = result
  }
)

watch(client, (value) => {
  if (value) {
    refreshHotNfts()
  }
})

const toKSM = (amount) => {
  return formatBalance(amount, decimals.value, '')
}

const fetchHotNfts = async () => {
  const { data } = await useAsyncQuery({
    query: hotNfts,
    variables: {
      gte: lastweekDate,
    },
    clientId: client.value,
  })

  return data.value.result
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.hot-sticky-header th {
  top: 120px;
  position: sticky;
  background: $frosted-glass-background;
  backdrop-filter: $frosted-glass-backdrop-filter;
}

.front-stack-layer {
  z-index: 1;
}
</style>
