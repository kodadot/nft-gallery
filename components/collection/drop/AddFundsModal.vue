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
      <div
        class="rounded border shade-border-color is-flex is-justify-content-start is-flex-grow-1 pl-3 mb-6">
        <IdentityItem
          :label="$t('confirmPurchase.connectedWith')"
          hide-identity-popover
          disable-identity-link
          :prefix="urlPrefix"
          :account="accountId"
          class="identity-name-font-weight-regular"
          data-testid="item-creator" />
      </div>
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
            class="is-flex is-justify-items-space-between is-align-items-center has-text-grey add-funds-note">
            <NeoIcon icon="circle-info" class="mr-3" />
            <p class="is-size-7">
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
            <p class="tooltip__note has-text-grey">
              {{ $t('mint.unlockable.addFundsModal.tooltip.note') }}
            </p>
          </template>
        </NeoTooltip>
      </template>

      <div class="is-flex">
        <AutoTeleportActionButton
          ref="autoteleport"
          :amount="minimumFunds"
          :hide-top="!canAutoTeleport"
          interaction="drop"
          @actions:completed="$emit('confirm')" />
      </div>
    </ModalBody>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoIcon, NeoModal, NeoTooltip } from '@kodadot1/brick'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import AutoTeleportActionButton from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'

const emit = defineEmits(['confirm', 'update:modelValue'])
withDefaults(
  defineProps<{
    modelValue: boolean
    minimumFunds: number
    formattedMinimumFunds: string
    token: string
    chain: string
  }>(),
  {
    modelValue: false,
  },
)

const { urlPrefix } = usePrefix()
const { accountId } = useAuth()

const autoteleport = ref()

const canAutoTeleport = computed(() => autoteleport.value?.canAutoTeleport)

const loading = computed(() => !autoteleport.value?.hasBalances)

const onClose = () => {
  emit('update:modelValue', false)
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.shade-border-color {
  @include ktheme() {
    border-color: theme('k-shade');
  }
}

.rounded {
  border-radius: 10rem;
}

.add-funds-note {
  cursor: default;
  margin-bottom: 16px;
}
.tooltip {
  &__title {
    font-size: 16px;
    font-weight: 700;
    line-height: normal;
    margin-bottom: 12px;
    text-align: left;
  }

  &__text {
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.24px;
    line-height: normal;
    text-align: left;
  }

  &__note {
    font-style: italic;
    text-align: left;
  }
}

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
