<template>
  <Story title="NeoModal">
    <Variant title="Modal">
      <NeoModal :value="modalActive" @close="modalActive = false">
        Modal Content
      </NeoModal>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import NeoModal from './NeoModal.vue'

const modalActive = ref(true)
</script>
