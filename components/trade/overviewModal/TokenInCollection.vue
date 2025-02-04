<template>
  <div
    class="flex flex-col gap-4"
  >
    <div class="flex flex-col gap-2">
      <div class="text-sm capitalize text-k-grey">
        {{ title }}
      </div>
      <CollectionItemDetails
        :trade="trade"
      />
    </div>
    <div
      v-if="isTargetOfTrade"
      class="flex flex-col gap-2"
    >
      <div class="flex justify-between items-center h-[1.5rem]">
        <div class="text-sm font-semibold capitalize">
          To trade
        </div>

        <NeoButton
          v-if="sendItem"
          variant="icon"
          @click="() => {
            selected = undefined
            $emit('send-item:clear')
          }"
        >
          <NeoIcon
            icon="close"
            size="small"
          />
        </NeoButton>
      </div>

      <TokenItemDetails
        v-if="selected"
        :nft="sendItem"
        :type="trade.type"
      />

      <TokenSearchInput
        v-else
        :where="{
          currentOwner_eq: accountId,
          collection: {
            id_eq: trade.considered.id,
          },
        }"
        @select="sendItem => {
          selected = sendItem
          $emit('send-item:select', sendItem)
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import CollectionItemDetails from './CollectionItemDetails.vue'
import TokenSearchInput from './TokenSearchInput.vue'
import TokenItemDetails from './TokenItemDetails.vue'
import type { NFT } from '@/types'
import { type TradeNftItem } from '@/components/trade/types'

defineEmits(['send-item:select', 'send-item:clear'])
const props = defineProps<{
  sendItem?: NFT | null
  trade: TradeNftItem
  title: string
}>()

const selected = ref()
const { accountId } = useAuth()
const { isTargetOfTrade } = useIsTrade(computed(() => props.trade), accountId)
</script>
