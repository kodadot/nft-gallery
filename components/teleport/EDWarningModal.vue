<template>
  <NeoModal
    :value="isModalActive"
    scroll="clip"
    :enable-mobile="false"
    content-class="mx-4 "
    :can-cancel="false">
    <div class="px-6 py-5 width-350">
      <div class="is-flex mb-4 items-center">
        <NeoIcon
          icon="triangle-exclamation"
          pack="fasr"
          class="mr-3"
          size="medium" />
        <span class="font-bold">{{ $t('teleport.fundLossRisk') }}</span>
      </div>
      <div
        class="is-flex is-flex-direction-column px-4 bakground-warning-red border border-color-k-red">
        <span class="my-3">
          {{
            reason === 'source'
              ? $t('teleport.sourceExistentialDepositWarning', [
                  sourceExistentialDeposit,
                  currency,
                ])
              : $t('teleport.targetExistentialDepositWarning', [
                  targetExistentialDeposit,
                  currency,
                ])
          }}
          <b>{{ $t('teleport.lossOfFunds') }}</b>
        </span>
        <div class="is-flex py-4">
          <NeoCheckbox
            v-model="checked"
            class="mr-3 text-xs"
            :label="$t('teleport.checkboxLabel')" />
        </div>
      </div>
      <div class="is-flex mt-5 items-center justify-between">
        <NeoButton
          variant="pill"
          :disabled="!checked"
          class="mr-4"
          no-shadow
          :label="$t('massmint.mobileDisclaimer.continueAnyway')"
          @click="emit('continue')" />
        <NeoButton
          variant="pill"
          :label="$t('autoTeleport.close')"
          @click="emit('close')" />
      </div>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoCheckbox, NeoIcon, NeoModal } from '@kodadot1/brick'

const props = defineProps<{
  modelValue: boolean
  sourceExistentialDeposit: number | string
  targetExistentialDeposit: number | string
  currency: Currency
  reason: 'source' | 'target'
}>()

const isModalActive = useVModel(props, 'modelValue')
const checked = ref(false)
watch(isModalActive, () => {
  checked.value = false
})

const emit = defineEmits(['close', 'continue'])
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables.scss';

.width-350 {
  max-width: 350px;
}

.bakground-warning-red {
  @include ktheme() {
    background-color: theme('k-redaccent2');
  }
}
.border-color-k-red {
  @include ktheme() {
    border-color: theme('k-red') !important;
  }
}
</style>
