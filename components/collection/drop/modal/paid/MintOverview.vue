<template>
  <ModalIdentityItem class="mb-5" />

  <div class="pt-2 pb-5">
    <div class="flex gap-4 flex-col">
      <ConfirmPurchaseItemRow
        v-for="toMintNft in toMintNfts"
        :key="toMintNft.image"
        :name="toMintNft.name"
        :collection-name="toMintNft.collectionName"
        :price="toMintNft.price">
        <template #image>
          <div class="relative">
            <NeoSkeleton
              v-if="!toMintNft.metadata"
              class="absolute border border-border-color overflow-hidden"
              :width="48"
              :height="48"
              :rounded="false"
              no-margin />

            <BaseMediaItem
              :src="sanitizeIpfsUrl(toMintNft.image)"
              :alt="toMintNft.name"
              mime-type="text/html"
              preview
              is-detail
              :class="{ 'opacity-0': !toMintNft.metadata }"
              class="border image is-48x48" />
          </div>
        </template>
      </ConfirmPurchaseItemRow>
    </div>

    <hr class="my-4" />

    <div class="flex justify-between items-center">
      <span class="text-xs">{{ $t('confirmPurchase.priceForNFTs') }}</span>
      <CommonTokenMoney :value="totalPrice" />
    </div>

    <hr class="my-4" />

    <div class="flex justify-between">
      {{ $t('confirmPurchase.youWillPay') }}:
      <div class="flex items-center">
        <CommonTokenMoney :value="totalPrice" class="text-k-grey text-xs" />
        <span class="font-bold ml-2">
          {{ priceUSD }}
        </span>
      </div>
    </div>
  </div>

  <div
    v-if="!hasMinimumFunds && !hideMinimumFundsWarning"
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
      :label="mintButton.label"
      :disabled="mintButton.disabled"
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
import { NeoIcon, NeoSkeleton } from '@kodadot1/brick'
import AutoTeleportActionButton from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'
import ModalIdentityItem from '@/components/shared/ModalIdentityItem.vue'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'
import type { MassMintNFT } from '@/composables/drop/useDropMassMint'

defineEmits(['confirm', 'close'])

const props = withDefaults(
  defineProps<{
    toMintNfts: MassMintNFT[]
    action: AutoTeleportAction
    mintButton: { label: string; disabled: boolean; loading?: boolean }
    minimumFunds: number
    hasMinimumFunds: boolean
    hideMinimumFundsWarning: boolean
    formattedMinimumFunds: string
    formattedExistentialDeposit: string
  }>(),
  {
    hideMinimumFundsWarning: false,
  },
)

const { chainSymbol, decimals } = useChain()

const body = ref(document.body)
const autoteleport = ref()

const canAutoTeleport = computed(() => autoteleport.value?.canAutoTeleport)
const loading = computed(() => !autoteleport.value?.isReady)

const totalPrice = computed(
  () => getSumOfObjectField(props.toMintNfts, 'price') as number,
)

const { usd: priceUSD } = useAmount(totalPrice, decimals, chainSymbol)

defineExpose({ loading })
</script>
