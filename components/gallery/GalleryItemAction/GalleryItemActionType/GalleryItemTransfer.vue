<template>
  <div class="is-flex is-justify-content-end gallery-item-transfer">
    <NeoButton
      :label="$t('transaction.transfer')"
      size="large"
      variant="k-pink"
      fixed-width
      @click="sendItem" />

    <ItemTransferModal
      :value="isModalActive"
      :nft="nft"
      @close="isModalActive = false" />
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

import ItemTransferModal from '@/components/common/itemTransfer/ItemTransferModal.vue'
import { NFT } from '@/components/rmrk/service/scheme'

defineProps<{
  nft: NFT
}>()

const isModalActive = ref(false)

function sendItem() {
  isModalActive.value = true
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';
.gallery-item-transfer {
  button {
    font-size: 1rem;
    height: 3.375rem;
  }
}

@include until-widescreen {
  .gallery-item-transfer {
    margin-top: 1rem !important;

    button {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
