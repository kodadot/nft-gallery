<template>
  <div class="offer-table-container">
    <NeoTable
      v-model:current-page="currentPage"
      :data="displayOffers(offers)"
      :paginated="displayOffers(offers).length > itemsPerPage"
      :per-page="itemsPerPage"
      :class="{ scrollable: offers.length > 0 }"
      td-class="is-vcentered is-narrow"
      pagination-position="top">
      <div v-if="headerText" class="has-text-centered offer-title mb-2">
        {{ headerText }}
      </div>
      <NeoSelect v-model="selectedStatus">
        <option
          v-for="option in getUniqType(offers)"
          :key="option.type"
          :value="option.type">
          {{ option.value }}
        </option>
      </NeoSelect>
      <NeoTableColumn
        v-if="displayCollection"
        v-slot="props"
        :label="$t('offer.collection')"
        field="nft.collection.name"
        sortable>
        <nuxt-link
          :to="`/${urlPrefix}/collection/${props.row.nft.collection.id}`">
          <p
            class="limit-width-text"
            :title="
              props.row.nft.collection.name
                ? props.row.nft.collection.name
                : props.row.nft.collection.id
            ">
            {{
              props.row.nft.collection.name
                ? props.row.nft.collection.name
                : props.row.nft.collection.id
            }}
          </p>
        </nuxt-link>
      </NeoTableColumn>
      <NeoTableColumn
        v-if="isBsxStats"
        v-slot="props"
        :label="$t('offer.nftName')"
        field="nft.name"
        sortable>
        <nuxt-link :to="`/${urlPrefix}/gallery/${props.row.nft.id}`">
          <p
            class="limit-width-text"
            :title="props.row.nft.name ? props.row.nft.name : props.row.nft.id">
            {{ props.row.nft.name ? props.row.nft.name : props.row.nft.id }}
          </p>
        </nuxt-link>
      </NeoTableColumn>
      <NeoTableColumn
        v-slot="props"
        field="caller"
        :label="$t('offer.caller')"
        sortable>
        <nuxt-link :to="`/${urlPrefix}/u/${props.row.caller}`">
          <Identity :address="props.row.caller" />
        </nuxt-link>
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        field="formatPrice"
        :label="$t('offer.price')"
        sortable>
        <Money :value="props.row.price" inline />
      </NeoTableColumn>
      <NeoTableColumn
        v-slot="props"
        field="expirationBlock"
        :label="$t('offer.expiration')"
        sortable>
        <NeoTooltip
          v-if="!isExpired(props.row.expiration)"
          :label="calcExpirationDate(props.row.expiration)">
          {{ calcExpirationTime(props.row.expiration) }}
        </NeoTooltip>
        <span v-else>
          {{ calcExpirationTime(props.row.expiration) }}
        </span>
      </NeoTableColumn>
      <NeoTableColumn
        v-if="!isBsxStats"
        v-slot="props"
        :label="$t('offer.action')"
        width="120"
        sortable>
        <div class="buttons">
          <NeoTooltip
            v-if="isOwner"
            :label="$t('offer.expired')"
            :active="calcExpirationTime(props.row.expiration) === 'expired'"
            class="mr-2">
            <NeoButton
              variant="success"
              no-shadow
              icon-left="money-bill"
              :disabled="calcExpirationTime(props.row.expiration) === 'expired'"
              @click="tellFrens(props.row.caller, false)" />
          </NeoTooltip>
          <NeoButton
            v-if="props.row.caller === accountId || isOwner"
            variant="warning"
            no-shadow
            icon-left="times"
            @click="tellFrens(props.row.caller, true)" />
        </div>
      </NeoTableColumn>
      <NeoTableColumn
        v-if="isBsxStats"
        v-slot="props"
        field="status"
        :label="$t('nft.offer.status')"
        sortable>
        <p>{{ props.row.status }}</p>
      </NeoTableColumn>
      <NeoTableColumn
        v-if="isBsxStats"
        v-slot="props"
        field="createdAt"
        :label="$t('nft.offer.date')"
        sortable>
        <p>
          {{ timeAgo(new Date(props.row.createdAt).getTime()) }}
        </p>
      </NeoTableColumn>
      <template #empty>
        <div class="w-100 has-text-centered">
          {{ $t('nft.offer.empty') }}
        </div>
      </template>
    </NeoTable>
  </div>
</template>

<script setup lang="ts">
import { AllOfferStatusType } from '@/utils/offerStatus'
import { formatBsxBalanceToNumber } from '@/utils/format/balance'
import { endDate, formatSecondsToDuration } from '@/utils/format/time'
import { timeAgo } from '@/components/collection/utils/timeAgo'

import { Offer } from './types'
import {
  NeoButton,
  NeoSelect,
  NeoTable,
  NeoTableColumn,
  NeoTooltip,
} from '@kodadot1/brick'

import Identity from '@/components/identity/IdentityIndex.vue'
import Money from '@/components/shared/format/Money.vue'

withDefaults(
  defineProps<{
    offers: Offer[]
    isOwner?: boolean
    isBsxStats: boolean
    isCollection?: boolean
    displayCollection: boolean
    headerText?: string
  }>(),
  {
    headerText: '',
    displayCollection: false,
  },
)

const route = useRoute()
const { urlPrefix } = usePrefix()
const { accountId } = useAuth()
const { replaceUrl } = useReplaceUrl()

const itemsPerPage = ref(20)
const currentPage = ref(parseInt(route.query?.page as string) || 1)
const selectedStatus = ref<AllOfferStatusType>(AllOfferStatusType.ALL)

const emit = defineEmits(['select'])
const tellFrens = (caller: string, withdraw: boolean) => {
  emit('select', { caller, withdraw })
}

watch(currentPage, (val) => {
  replaceUrl({ page: String(val) })
})

const currentBlock = ref(0)
onMounted(async () => {
  const { apiInstance } = useApi()
  const api = await apiInstance.value
  const block = await api.rpc.chain.getHeader()
  currentBlock.value = block.number.toNumber()
})

const getUniqType = (offers: Offer[]) => {
  const statusSet = new Set(offers.map((offer) => offer.status))
  const singleEventList = Array.from(statusSet).map((type) => ({
    type: type as AllOfferStatusType,
    value: AllOfferStatusType[type],
  }))
  return [{ type: AllOfferStatusType.ALL, value: 'All' }, ...singleEventList]
}

const displayOffers = (offers: Offer[]) => {
  return offers.map((offer) => ({
    ...offer,
    formatPrice: formatBsxBalanceToNumber(offer.price),
    expirationBlock: parseInt(offer.expiration),
  }))
}

const calcSecondsToBlock = (block: number): number => {
  const secondsForEachBlock = 12
  return secondsForEachBlock * (block - currentBlock.value)
}

const calcExpirationTime = (expirationBlock: number): string => {
  if (currentBlock.value === 0) {
    return 'computing'
  }
  if (currentBlock.value > expirationBlock) {
    return 'expired'
  }
  return formatSecondsToDuration(calcSecondsToBlock(expirationBlock))
}

const calcExpirationDate = (expirationBlock: number): string => {
  return endDate(calcSecondsToBlock(expirationBlock))
}

const isExpired = (expirationBlock: number): boolean => {
  return currentBlock.value >= expirationBlock
}
</script>

<style lang="scss">
.offer-table-container {
  .scrollable.table-wrapper {
    overflow-x: scroll;
  }
  .limit-width-text {
    max-width: 20ch;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .offer-title {
    line-height: 2rem;
    font-size: 1.2rem;
  }
  .pagination-list {
    margin: 0;
  }
}
</style>
