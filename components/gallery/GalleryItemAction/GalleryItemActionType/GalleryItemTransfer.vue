<template>
  <div class="is-flex is-justify-content-end">
    <NeoButton
      :label="`${$i18n.t('transaction.transfer')}`"
      size="large"
      variant="k-accent"
      @click.native="sendItem" />

    <ItemTransferModal
      v-model="isModalActive"
      :nft="nft"
      @close="isModalActive = false" />
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
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

const actionRef = ref(null)
onClickOutside(actionRef, () => (isModalActive.value = false))
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
.gallery-item-transfer {
  justify-content: flex-end;
}
@include until-widescreen {
  .gallery-item-transfer {
    margin-top: 0.5rem;
    justify-content: flex-start;
  }
}
</style>
