<template>
  <NeoModal :value="isModalActive" scroll="clip" @close="emit('close')">
    <div class="p-6 w-[unset] lg:w-[25rem]">
      <div class="flex justify-center is-size-5 pb-4 border-b border-k-shade">
        <span>
          {{ $t('massmint.areYouSureDelete') }}
          <br />
          <span class="font-bold"> “{{ nft.name }} #{{ nft.id }}” </span>
          ?
        </span>
      </div>
      <div class="flex mt-6">
        <NeoButton
          class="mr-3 flex flex-grow flex-1 h-[3.25rem]"
          no-shadow
          variant="k-accent"
          :label="$t('massmint.yesDelete')"
          @click="deleteNFT(nft)" />
        <NeoButton
          :label="$t('massmint.cancel')"
          no-shadow
          class="flex flex-grow flex-1 h-[3.25rem]"
          @click="emit('close')" />
      </div>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoModal } from '@kodadot1/brick'
import { NFT } from '../types'

const props = defineProps<{
  modelValue: boolean
  nft: NFT
}>()

const isModalActive = useVModel(props, 'modelValue')

const emit = defineEmits(['close', 'delete'])

const deleteNFT = (nft: NFT) => {
  emit('delete', nft)
}
</script>
