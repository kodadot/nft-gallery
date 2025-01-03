<template>
  <div
    class="flex flex-col gap-4"
  >
    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold capitalize">
        Any in collection
      </div>
      <CollectionItemDetails
        :trade="trade"
      />
    </div>
    <div class="flex flex-col gap-2">
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
        v-if="sendItem"
        :nft="sendItem"
      />

      <TokenSearchInput
        v-else
        :where="{
          currentOwner_eq: accountId,
          collection: {
            id_eq: trade.considered.id,
          },
        }"
        @select="s => {
          selected = s
          $emit('send-item:select', s)
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

defineEmits(['send-item:select', 'send-item:clear'])
defineProps<{
  sendItem?: NFT
  trade: TradeNftItem
}>()

const selected = ref()
const { accountId } = useAuth()
</script>
