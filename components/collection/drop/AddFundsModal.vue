<template>
  <NeoModal
    :value="modelValue"
    :can-cancel="['outside', 'escape']"
    scroll="clip"
    content-class="add-funds-modal"
    @close="onClose">
    <ModalBody
      :title="$t('mint.unlockable.addFundsModal.title')"
      :scrollable="false"
      :loading="loading"
      @close="onClose">
      <ModalIdentityItem class="mb-5" />

      <p
        v-dompurify-html="
          $t('mint.unlockable.addFundsModal.textP1', [
            formattedMinimumFunds,
            chain,
          ])
        "
        class="mb-4" />
      <template v-if="!canAutoTeleport">
        <p class="mb-4">{{ $t('mint.unlockable.addFundsModal.textP2') }}</p>
        <NeoTooltip multiline multiline-width="256px" content-class="p-4">
          <div
            class="flex justify-between items-center text-k-grey cursor-default mb-4">
            <NeoIcon icon="circle-info" class="mr-3" />
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
              class="tooltip__text mb-2" />
            <p
              v-dompurify-html="
                $t('mint.unlockable.addFundsModal.tooltip.exchange')
              "
              class="tooltip__text mb-2"></p>

            <p
              v-dompurify-html="
                $t('mint.unlockable.addFundsModal.tooltip.transfer', [token])
              "
              class="tooltip__text mb-6" />
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
          :interaction="interaction"
          @modal:close="handleModalClose" />
      </div>
    </ModalBody>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoIcon, NeoModal, NeoTooltip } from '@kodadot1/brick'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import AutoTeleportActionButton from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'
import ModalIdentityItem from '@/components/shared/ModalIdentityItem.vue'
import { ActionlessInteraction } from '@/components/common/autoTeleport/utils'

const emit = defineEmits(['confirm', 'update:modelValue'])
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    minimumFunds: number
    formattedMinimumFunds: string
    token: string
    chain: string
    free?: boolean
  }>(),
  {
    free: false,
  },
)

const autoteleport = ref()
const interaction = computed(() => {
  //tmp solution till drop type check is fixed
  return props.free
    ? ActionlessInteraction.FREE_DROP
    : ActionlessInteraction.PAID_DROP
})

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
@import '@/assets/styles/abstracts/variables';

.add-funds-modal {
  .o-tip {
    display: flex;
  }

  .o-tip__trigger > * {
    height: initial;
  }
}

@include mobile() {
  .modal-width {
    width: unset;
  }
}
</style>
