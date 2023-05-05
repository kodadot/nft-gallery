<template>
  <section>
    <p class="title is-size-3">Waii you made it! ✨</p>
    <p class="title is-size-4">Your NFT should be ready in 1 minute</p>
    <nuxt-link class="is-size-4 link" :to="`/bsx/collection/${collectionId}`">
      In the meanwhile, click here to check the collection ♥️🍷
    </nuxt-link>
    <BasicImage
      src="https://imagedelivery.net/jk5b6spi_m_-9qC4VTnjpg/bafkreierepnow4cazbhinko36ubpuxl6pih7wuyxvi5mfmhvcmm6xgt6ha/aaa" />
    <SubmitButton
      class="py-2"
      icon="sync"
      type="is-success"
      label="Start over"
      expanded
      @click="submit" />
  </section>
</template>

<script setup lang="ts">
import { COLLECTION_ID } from './promptBuilder'
import BasicImage from '@/components/shared/view/BasicImage.vue'
import SubmitButton from '@/components/base/SubmitButton.vue'

const collectionId = COLLECTION_ID
const emit = defineEmits(['select'])
const submit = () => emit('select')
</script>
