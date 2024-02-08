<template>
  <NeoModal
    :value="isModalActive"
    scroll="clip"
    :enable-mobile="false"
    content-class="mx-4 "
    :can-cancel="false">
    <div class="px-6 py-5 max-w-[350px]">
      <div class="flex mb-4 items-center">
        <NeoIcon
          icon="triangle-exclamation"
          pack="fasr"
          class="mr-3"
          size="medium" />
        <span class="font-bold">{{ $t('teleport.fundLossRisk') }}</span>
      </div>
      <div class="flex flex-col px-4 bg-k-red-accent-2 border border-k-red">
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
        <div class="flex py-4">
          <NeoCheckbox
            v-model="checked"
            class="mr-3 text-xs"
            :label="$t('teleport.checkboxLabel')" />
        </div>
      </div>
      <div class="flex mt-5 items-center justify-between">
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
