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
      <span class="is-size-7">{{ $t('confirmPurchase.priceForNFTs') }}</span>
      <CommonTokenMoney :value="toMintNft.price" />
    </div>

    <hr class="my-4" />

    <div class="flex justify-between">
      {{ $t('confirmPurchase.youWillPay') }}:
      <div class="flex">
        <CommonTokenMoney :value="toMintNft.price" class="has-text-grey" />
        <span class="has-text-weight-bold ml-2">
          {{ toMintNft.priceUSD }}
        </span>
      </div>
    </div>
  </div>

  <div v-if="!hasMinimumFunds" class="border k-orange-light border-k-orange2">
    <div class="p-4 flex gap-3">
      <NeoIcon icon="circle-exclamation-check" size="large" />

      <p class="is-size-7">
        {{ $t('drops.yourWalletNeeds', [formattedMinimumFunds]) }}
      </p>
    </div>
    <div class="py-2 border-top border-k-orange2 text-center">
      <p class="is-size-7">
        {{
          canAutoTeleport
            ? $t('drops.youCanContinueWithAutoteleport')
            : $t('drops.pleaseAddFunds')
        }}
      </p>
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
import { NeoIcon } from '@kodadot1/brick'
import AutoTeleportActionButton from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'
import ModalIdentityItem from '@/components/shared/ModalIdentityItem.vue'
import type { ToMintNft } from '../../PaidGenerative.vue'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'

defineEmits(['confirm', 'close'])

defineProps<{
  toMintNft: ToMintNft
  action: AutoTeleportAction

  minimumFunds: number
  hasMinimumFunds: boolean
  formattedMinimumFunds: string
}>()

const autoteleport = ref()

const canAutoTeleport = computed(() => autoteleport.value?.canAutoTeleport)
const loading = computed(() => !autoteleport.value?.isReady)

defineExpose({ loading })
</script>

<style scoped></style>
