<template>
  <NeoModal
    v-model="isModalActive"
    scroll="clip"
    :can-cancel="!loading"
    @close="emit('close')">
    <div class="p-7">
      <div
        v-if="loading"
        class="is-flex is-flex-direction-column is-align-items-center">
        <img src="/preloader.svg" width="200" />
        <span class="mt-6">{{ $t('massmint.mintingYourNFTs') }}</span>
      </div>
      <div
        v-else
        class="is-flex is-flex-direction-column is-align-items-center">
        <NeoIcon icon="circle-check" class="check-icon has-text-k-green" />
        <span class="mt-4">{{ $t('massmint.mintDone') }}</span>
        <div class="is-flex w-full is-justify-content-center pt-6 px-7">
          <NeoButton
            :label="$t('massmint.done')"
            variant="k-accent"
            no-shadow
            class="is-flex is-flex-grow-1 btn-height"
            @click.native="emit('close')" />
        </div>
      </div>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon, NeoModal } from '@kodadot1/brick'

const props = defineProps<{
  value: boolean
  loading: boolean
}>()

const isModalActive = useVModel(props, 'value')

const emit = defineEmits(['close'])
</script>

<style lang="scss" scoped>
@import './modals.scss';
.check-icon {
  font-size: 2.5rem;
}
</style>
