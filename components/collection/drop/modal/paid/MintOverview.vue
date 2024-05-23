<template>
  <ModalIdentityItem class="mb-5" />

  <div class="pt-2 pb-5">
    <div class="flex gap-4 flex-col">
      <ConfirmPurchaseItemRow
        v-for="toMintNft in toMintNfts"
        :key="toMintNft.hash"
        :name="toMintNft.name"
        :collection-name="toMintNft.collectionName"
        :price="toMintNft.price"
        :hide-collection="true">
        <template #image>
          <div class="relative">
            <NeoSkeleton
              v-if="!toMintNft.imageDataPayload"
              class="border border-border-color overflow-hidden"
              :class="{ absolute: toMintNft.canRender }"
              :width="46"
              :height="46"
              :rounded="false"
              no-margin />

            <BaseMediaItem
              v-if="toMintNft.canRender"
              :src="
                toMintNft.imageDataPayload
                  ? toMintNft.imageDataPayload.image
                  : sanitizeIpfsUrl(toMintNft.animationUrl)
              "
              :alt="toMintNft.name"
              :mime-type="!toMintNft.imageDataPayload ? 'text/html' : undefined"
              preview
              is-detail
              :class="{ 'opacity-0': !toMintNft.imageDataPayload }"
              class="border image is-48x48" />
          </div>
        </template>
      </ConfirmPurchaseItemRow>
    </div>

    <hr class="my-4" />

    <div class="flex justify-between items-center">
      <span class="text-xs">{{ $t('confirmPurchase.priceForNFTs') }}</span>
      <CommonTokenMoney :value="minimumFunds" />
    </div>

    <hr class="my-4" />

    <div class="flex justify-between">
      {{ $t('confirmPurchase.youWillPay') }}:
      <div class="flex items-center">
        <CommonTokenMoney :value="minimumFunds" class="text-k-grey text-xs" />
        <span class="font-bold ml-2">
          {{ priceUSD }}
        </span>
      </div>
    </div>
  </div>

  <div class="flex pt-5">
    <AutoTeleportActionButton
      ref="autoteleport"
      :label="mintButton.label"
      :disabled="mintButton.disabled"
      :loading="mintButton.disabled"
      :amount="minimumFunds"
      :actions="[action]"
      :fees="{
        actionAutoFees: false,
      }"
      shiny
      auto-close-modal
      :auto-close-modal-delay-modal="0"
      @confirm="(e) => $emit('confirm', e)"
      @modal:close="(e) => $emit('close', e)" />
  </div>
</template>

<script setup lang="ts">
import { NeoSkeleton } from '@kodadot1/brick'
import AutoTeleportActionButton from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'
import ModalIdentityItem from '@/components/shared/ModalIdentityItem.vue'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'
import { type MassMintNFT } from '@/composables/drop/massmint/useDropMassMint'

defineEmits(['confirm', 'close'])

const { chainSymbol, decimals } = useChain()

const props = defineProps<{
  toMintNfts: MassMintNFT[]
  action: AutoTeleportAction
  minimumFunds: number
  mintButton: { label: string; disabled: boolean; loading?: boolean }
  formattedMinimumFunds: string
  formattedExistentialDeposit: string
}>()

const autoteleport = ref()

const loading = computed(() => !autoteleport.value?.isReady)

const { usd: priceUSD } = useAmount(
  computed(() => props.minimumFunds),
  decimals,
  chainSymbol,
)

defineExpose({ loading })
</script>
