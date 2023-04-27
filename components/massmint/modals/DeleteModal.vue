<template>
  <NeoModal v-model="isModalActive" scroll="clip" @close="emit('close')">
    <div class="p-6 modal-width">
      <div
        class="is-flex is-justify-content-center is-size-5 pb-4 border-bottom border-grey">
        <span>
          {{ $t('massmint.areYouSureDelete') }}
          <br />
          <span class="has-text-weight-bold">
            “{{ nft.name }} #{{ nft.id }}”
          </span>
          ?
        </span>
      </div>
      <div class="is-flex mt-6">
        <NeoButton
          class="mr-3 is-flex is-flex-grow-1 is-flex-1 btn-height"
          no-shadow
          variant="k-accent"
          :label="$t('massmint.yesDelete')"
          @click.native="deleteNFT(nft)" />
        <NeoButton
          :label="$t('massmint.cancel')"
          no-shadow
          class="is-flex is-flex-grow-1 is-flex-1 btn-height"
          @click.native="emit('close')" />
      </div>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoModal } from '@kodadot1/brick'
import { NFT } from '../types'

const props = defineProps<{
  value: boolean
  nft: NFT
}>()

const isModalActive = useVModel(props, 'value')

const emit = defineEmits(['close', 'delete'])

const deleteNFT = (nft: NFT) => {
  emit('delete', nft)
}
</script>

<style lang="scss" scoped>
@import './modals.scss';
</style>
