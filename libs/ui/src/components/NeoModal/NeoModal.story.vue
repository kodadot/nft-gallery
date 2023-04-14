<template>
  <Story title="NeoNftCard">
    <Variant title="Nft Card">
      <NeoModal v-model="modalActive" @close="modalActive = false">
        Modal Content
      </NeoModal>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import NeoModal from './NeoModal.vue'

const modalActive = ref(true)
</script>
