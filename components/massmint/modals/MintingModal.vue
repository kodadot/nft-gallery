<template>
  <NeoModal
    :value="isModalActive"
    scroll="clip"
    :can-cancel="!loading"
    @close="emit('close')">
    <div class="p-7">
      <div v-if="loading" class="flex flex-col items-center">
        <img src="/preloader.svg" width="200" />
        <span class="mt-6">{{ $t('massmint.mintingYourNFTs') }}</span>
      </div>
      <div v-else class="flex flex-col items-center">
        <NeoIcon icon="circle-check" class="check-icon has-text-k-green" />
        <span class="mt-4">{{ $t('massmint.mintDone') }}</span>
        <div class="flex w-full justify-center pt-6 px-7">
          <NeoButton
            :label="$t('massmint.done')"
            variant="k-accent"
            no-shadow
            class="flex flex-grow btn-height"
            @click="emit('close')" />
        </div>
      </div>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon, NeoModal } from '@kodadot1/brick'

const props = defineProps<{
  modelValue: boolean
  loading: boolean
}>()

const isModalActive = useVModel(props, 'modelValue')

const emit = defineEmits(['close'])
</script>

<style lang="scss" scoped>
@import './modals.scss';
.check-icon {
  font-size: 2.5rem;
}
</style>
