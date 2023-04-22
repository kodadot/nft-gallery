<template>
  <NeoModal v-model="isModalActive" scroll="clip" @close="emit('close')">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title is-flex is-justify-content-center">
          {{ `Are You sure You Want To Delete ${nft?.name || ''} #${nft?.id}` }}
        </p>
      </header>
      <div class="card-content is-flex">
        <NeoButton
          class="mr-3 is-flex is-flex-grow-1"
          label="Yes, Delete"
          @click.native="deleteNFT(nft)" />
        <NeoButton
          label="Cancel"
          variant="k-accent"
          class="is-flex is-flex-grow-1"
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
li {
  list-style-type: disc;
}

.limit-note-width {
  max-width: 20rem;
}
</style>
