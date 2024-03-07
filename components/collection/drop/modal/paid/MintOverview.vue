<template>
  <ModalIdentityItem class="mb-5" />

  <div class="pt-2 pb-5">
    <ConfirmPurchaseItemRow
      :name="toMintNft.name"
      :collection-name="toMintNft.collectionName"
      :price="toMintNft.price">
      <template #image>
        <BaseMediaItem
          :src="toMintNft.image"
          :alt="toMintNft.name"
          mime-type="text/html"
          preview
          is-detail
          class="border image is-48x48" />
      </template>
    </ConfirmPurchaseItemRow>

    <hr class="my-4" />

    <div class="flex justify-between items-center">
      <span class="text-xs">{{ $t('confirmPurchase.priceForNFTs') }}</span>
      <CommonTokenMoney :value="toMintNft.price" />
    </div>

    <hr class="my-4" />

    <div class="flex justify-between">
      {{ $t('confirmPurchase.youWillPay') }}:
      <div class="flex">
        <CommonTokenMoney :value="toMintNft.price" class="text-k-grey" />
        <span class="font-bold ml-2">
          {{ toMintNft.priceUSD }}
        </span>
      </div>
    </div>
  </div>

  <div class="flex pt-5">
    <AutoTeleportActionButton
      ref="autoteleport"
      :label="$t('drops.proceedToSigning')"
      :amount="minimumFunds"
      :actions="[action]"
      :fees="{
        actionAutoFees: false,
      }"
      auto-close-modal
      :auto-close-modal-delay-modal="0"
      @confirm="(e) => $emit('confirm', e)"
      @modal:close="(e) => $emit('close', e)" />
  </div>
</template>

<script setup lang="ts">
import AutoTeleportActionButton from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'
import ModalIdentityItem from '@/components/shared/ModalIdentityItem.vue'
import type { ToMintNft } from '../../types'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'

defineEmits(['confirm', 'close'])

defineProps<{
  toMintNft: ToMintNft
  action: AutoTeleportAction

  minimumFunds: number

  formattedMinimumFunds: string
  formattedExistentialDeposit: string
}>()

const autoteleport = ref()

const loading = computed(() => !autoteleport.value?.isReady)

defineExpose({ loading })
</script>
