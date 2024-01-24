<template>
  <NeoModal
    :value="isModalActive"
    scroll="clip"
    :enable-mobile="false"
    content-class="mx-4"
    :can-cancel="false">
    <div class="px-6 py-5 modal-width">
      <div class="flex is-size-5 mb-4 items-center">
        <NeoIcon icon="triangle-exclamation" pack="fasr" class="mr-3" />
        <span class="font-bold">
          {{ $t('massmint.mobileDisclaimer.title') }}
          <br />
        </span>
      </div>
      <div
        class="px-4 py-3 bakground-warning-yellow border border-color-k-orange">
        {{ $t('massmint.mobileDisclaimer.content1') }}
        <br />
        <br />
        {{ $t('massmint.mobileDisclaimer.content2') }}
      </div>
      <div class="flex mt-5 items-center">
        <NeoButton
          variant="text"
          class="mr-4"
          no-shadow
          :label="$t('massmint.mobileDisclaimer.continueAnyway')"
          @click="emit('continue')" />
        <NeoButton
          variant="pill"
          :label="$t('massmint.mobileDisclaimer.leave')"
          @click="emit('leave')" />
      </div>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon, NeoModal } from '@kodadot1/brick'

const props = defineProps<{
  modelValue: boolean
}>()

const isModalActive = useVModel(props, 'modelValue')

const emit = defineEmits(['leave', 'continue'])
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables.scss';

.bakground-warning-yellow {
  @include ktheme() {
    background-color: theme('warning-yellow');
  }
}
.border-color-k-orange {
  @include ktheme() {
    border-color: theme('k-orange') !important;
  }
}
</style>
