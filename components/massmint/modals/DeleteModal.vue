<template>
  <NeoModal v-model="isModalActive" scroll="clip" @close="emit('close')">
    <div class="p-7">
      <header class="">
        <p class="is-flex is-justify-content-center is-size-4">
          {{
            $t('massmint.areYouSureDelete', {
              name: nft.name || '',
              id: nft.id,
            })
          }}
        </p>
      </header>
      <div class="is-flex mt-6">
        <NeoButton
          class="mr-3 is-flex is-flex-grow-1 is-flex-1"
          :label="$t('massmint.yesDelete')"
          @click.native="deleteNFT(nft)" />
        <NeoButton
          :label="$t('massmint.cancel')"
          variant="k-accent"
          class="is-flex is-flex-grow-1 is-flex-1"
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
