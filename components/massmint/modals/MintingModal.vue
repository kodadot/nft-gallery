<template>
  <NeoModal v-model="isModalActive" scroll="clip" :can-cancel="!loading">
    <div class="p-7">
      <div
        v-if="loading"
        class="is-flex is-flex-direction-column is-align-items-center">
        <img src="/preloader.svg" width="200" />
        <span class="mt-6">Minting Your NFTS...</span>
      </div>
      <div
        v-else
        class="is-flex is-flex-direction-column is-align-items-center">
        <NeoIcon icon="circle-check" class="check-icon has-text-k-green" />
        <span class="mt-4">All of your NFTs were successfuly minted.</span>
        <div class="is-flex w-full is-justify-content-center pt-5 px-7">
          <NeoButton
            :label="'Done'"
            variant="k-accent"
            class="is-flex is-flex-grow-1"
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
.check-icon {
  font-size: 2.5rem;
}
</style>
