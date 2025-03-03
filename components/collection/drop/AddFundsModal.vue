<template>
  <NeoModal
    :value="modelValue"
    content-class="add-funds-modal !w-[unset]"
    @close="onClose"
  >
    <ModalBody
      :title="$t('mint.unlockable.addFundsModal.title')"
      :scrollable="false"
      :loading="loading"
      @close="onClose"
    >
      <ModalIdentityItem class="mb-5" />

      <p
        v-dompurify-html="
          $t('mint.unlockable.addFundsModal.textP1', [
            formattedMinimumFunds,
            chainName,
          ])
        "
        class="mb-4"
      />
      <template v-if="!canAutoTeleport">
        <p class="mb-4">
          {{ $t('mint.unlockable.addFundsModal.textP2') }}
        </p>
        <NeoTooltip
          multiline
          multiline-width="256px"
          content-class="p-4"
        >
          <div
            class="flex justify-between items-center text-k-grey cursor-default mb-4"
          >
            <Icon
              name="i-mdi:information-slab-circle-outline"
              class="mr-3"
            />
            <p class="text-xs">
              {{ $t('mint.unlockable.addFundsModal.howToAddFunds') }}
            </p>
          </div>
          <template #content>
            <h3 class="tooltip__title">
              {{ $t('mint.unlockable.addFundsModal.tooltip.title', [token]) }}
            </h3>
            <p
              v-dompurify-html="
                $t('mint.unlockable.addFundsModal.tooltip.onramp', [token])
              "
              class="tooltip__text mb-2"
            />
            <p
              v-dompurify-html="
                $t('mint.unlockable.addFundsModal.tooltip.exchange')
              "
              class="tooltip__text mb-2"
            />

            <p
              v-dompurify-html="
                $t('mint.unlockable.addFundsModal.tooltip.transfer', [token])
              "
              class="tooltip__text mb-6"
            />
            <p class="tooltip__note text-k-grey">
              {{ $t('mint.unlockable.addFundsModal.tooltip.note') }}
            </p>
          </template>
        </NeoTooltip>
      </template>

      <div class="flex">
        <AutoTeleportActionButton
          ref="autoteleport"
          :amount="minimumFunds"
          :hide-top="!canAutoTeleport"
          :interaction="NFTs.MINT_DROP"
          @modal:close="handleModalClose"
        />
      </div>
    </ModalBody>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoModal, NeoTooltip } from '@kodadot1/brick'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import AutoTeleportActionButton from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'
import ModalIdentityItem from '@/components/shared/ModalIdentityItem.vue'
import { useDrop, useDropMinimumFunds } from '@/components/drops/useDrops'
import { NFTs } from '@/composables/transaction/types'

const emit = defineEmits(['confirm', 'update:modelValue'])
defineProps<{
  modelValue: boolean
}>()

const { formattedMinimumFunds, minimumFunds } = useDropMinimumFunds()
const { token, chainName } = useDrop()

const autoteleport = ref()

const canAutoTeleport = computed(() => autoteleport.value?.canAutoTeleport)
const loading = computed(() => !autoteleport.value?.isReady)

const onClose = () => {
  emit('update:modelValue', false)
}

const handleModalClose = (completed: boolean) => {
  if (completed) {
    emit('confirm')
  }
}
</script>

<style lang="scss" scoped>
.add-funds-modal {
  .o-tip {
    display: flex;
  }

  .o-tip__trigger > * {
    height: initial;
  }
}
</style>
