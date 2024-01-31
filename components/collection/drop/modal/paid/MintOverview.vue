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

  <div
    v-if="!hasMinimumFunds"
    class="border border-k-orange2 bg-k-orange-light">
    <div class="p-4 flex gap-3">
      <NeoIcon
        icon="circle-exclamation-check"
        class="text-k-orange3"
        size="large" />

      <div class="text-xs">
        <span class="text-text-color">
          {{ $t('drops.yourWalletNeeds', [formattedMinimumFunds]) }}
        </span>

        <tippy placement="left" :append-to="body" class="float-right">
          <p class="lowercase text-k-orange3">
            {{ $t('teleport.why') }}
          </p>

          <template #content>
            <div
              class="bg-background-color text-xs border p-4 text-left w-[15rem]">
              <p
                v-dompurify-html="
                  $t('drops.paidDropWhyTooltip', [
                    formattedMinimumFunds,
                    formattedExistentialDeposit,
                  ])
                " />

              <a
                href="https://hello.kodadot.xyz/multi-chain/existential-deposit"
                class="text-k-blue hover:text-k-blue-hover text-xs capitalize mt-5 block"
                target="_blank"
                rel="nofollow noopener noreferrer"
                >{{ $t('helper.learnMoreAboutEd') }}</a
              >
            </div>
          </template>
        </tippy>
      </div>
    </div>

    <div class="py-2 border-t border-k-orange2 text-center">
      <p class="text-xs">
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
  formattedExistentialDeposit: string
}>()

const body = ref(document.body)
const autoteleport = ref()

const canAutoTeleport = computed(() => autoteleport.value?.canAutoTeleport)
const loading = computed(() => !autoteleport.value?.isReady)

defineExpose({ loading })
</script>

<style scoped></style>
