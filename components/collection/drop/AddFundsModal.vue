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
      @close="onClose">
      <div
        class="rounded border shade-border-color flex justify-start flex-grow pl-3 mb-6">
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
            `${minimumFunds} ${token}`,
          ])
        "
        class="mb-4" />
      <p class="mb-4">{{ $t('mint.unlockable.addFundsModal.textP2') }}</p>
      <NeoTooltip multiline multiline-width="256px" content-class="p-4">
        <div
          class="flex justify-between items-center has-text-grey add-funds-note">
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
      <div class="flex">
        <NeoButton
          class="flex-1 h-14 is-capitalized shine"
          no-shadow
          variant="k-accent"
          @click="onShowRamp">
          {{ $t('autoTeleport.addFundsViaOnramp') }}
        </NeoButton>
      </div>
    </ModalBody>
  </NeoModal>
  <OnRampModal v-model="onRampActive" @close="onRampActive = false" />
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon, NeoModal, NeoTooltip } from '@kodadot1/brick'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import OnRampModal from '@/components/shared/OnRampModal.vue'

type Props = {
  modelValue: boolean
  minimumFunds: number
  token: string
}

withDefaults(defineProps<Props>(), {
  modelValue: false,
})

const { urlPrefix } = usePrefix()
const { accountId } = useAuth()

const onRampActive = ref(false)

const emit = defineEmits(['confirm', 'update:modelValue'])

const onClose = () => {
  emit('update:modelValue', false)
}

const onShowRamp = () => {
  onRampActive.value = true
  onClose()
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
</style>
