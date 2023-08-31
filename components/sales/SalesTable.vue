<template>
  <div>
    <Loader :value="pending" />
    <NeoTable :data="sales" hoverable>
      <NeoTableColumn v-slot="props" position="centered" field="idx" label="N°">
        {{ props.row.idx }}
      </NeoTableColumn>
      <NeoTableColumn
        v-slot="props"
        field="image"
        label=""
        class="front-stack-layer"
        position="centered">
        <div class="image is-48x48">
          <nuxt-link :to="`/${urlPrefix}/gallery/${props.row.id}`">
            <BasicPopup placement="top">
              <template #trigger>
                <BasicImage
                  :src="props.row.image"
                  :alt="props.row.name"
                  :rounded="true" />
              </template>
              <template #content>
                <BasicImage
                  :src="props.row.image"
                  :alt="props.row.name"
                  class="popup-image" />
              </template>
            </BasicPopup>
          </nuxt-link>
        </div>
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        position="centered"
        field="name"
        :label="$t('name')">
        <nuxt-link :to="`/rmrk/gallery/${props.row.id}`">
          {{ props.row.name }}
        </nuxt-link>
      </NeoTableColumn>
      <NeoTableColumn
        v-slot="props"
        position="centered"
        field="collectionId"
        label="Collection">
        <nuxt-link :to="`/rmrk/collection/${props.row.collectionId}`">
          {{ props.row.collectionName }}
        </nuxt-link>
      </NeoTableColumn>
      <NeoTableColumn
        v-slot="props"
        position="centered"
        field="buyer"
        :label="$t('sales.buyer')">
        <nuxt-link :to="`/rmrk/u/${props.row.buyer}`">
          <Identity :address="props.row.buyer" />
        </nuxt-link>
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        position="centered"
        field="timestamp"
        :label="$t('sales.tableDate')">
        <div>
          <NeoTooltip :label="props.row.date" position="left">
            <BlockExplorerLink
              :text="props.row.relDate"
              :block-id="props.row.blockNumber" />
          </NeoTooltip>
        </div>
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        position="centered"
        field="salePrice"
        :label="$t('sales.price')">
        <Money :value="props.row.salePrice" inline />
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
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import {
  NeoSkeleton,
  NeoTable,
  NeoTableColumn,
  NeoTooltip,
} from '@kodadot1/brick'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import salesFeedGql from '@/queries/rmrk/subsquid/salesFeed.graphql'
import BasicImage from '@/components/shared/view/BasicImage.vue'
import BasicPopup from '@/components/shared/view/BasicPopup.vue'
import Identity from '@/components/identity/IdentityIndex.vue'
import Money from '@/components/shared/format/Money.vue'

const sales = ref([])
const { $apollo } = useNuxtApp()
const { client, urlPrefix } = usePrefix()

const parseDate = (ts: number) => {
  return new Date(ts).toLocaleString('en-GB', {
    timeZone: 'UTC',
    timeZoneName: 'short',
  })
}

const { pending, refresh: refreshNftSales } = useLazyAsyncData(
  'data',
  async () => {
    const {
      data: { salesFeed },
    } = await $apollo.query({
      query: salesFeedGql,
      client: client.value,
      variables: {},
    })

    salesFeed.forEach((nft, idx) => {
      nft.idx = idx + 1
      nft.image = sanitizeIpfsUrl(nft.image)
      nft.date = parseDate(Number(nft.timestamp))
      nft.relDate = formatDistanceToNow(Number(nft.timestamp), {
        addSuffix: true,
      })
    })

    sales.value = salesFeed
  }
)

watch(client, (value) => {
  if (value) {
    refreshNftSales()
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.history {
  width: 200px;
  height: 100px;
}

.front-stack-layer {
  z-index: 1;
}
.popup-image {
  width: 300px;
  height: 300px;
}
</style>
