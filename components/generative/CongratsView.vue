<template>
  <section>
    <br />
    <p class="title is-size-3">Waii you made it! ✨</p>
    <p class="title is-size-4">Your NFT should be ready in 1 minute</p>
    <nuxt-link class="is-size-4 link" :to="`/bsx/collection/${collectionId}`">
      In the meanwhile, click here to check the collection ♥️🍷
    </nuxt-link>
    <b-image
      src="https://imagedelivery.net/jk5b6spi_m_-9qC4VTnjpg/bafkreiao33lq57laoccwj47gw46tnf76xypfug66p7aj2amwkjtf2k52r4/aaa" />
    <br />
    <SubmitButton
      icon="sync"
      type="is-success"
      label="Start over"
      expanded
      @click="submit" />
  </section>
</template>

<script setup lang="ts">
import { COLLECTION_ID } from './promptBuilder'

const SubmitButton = defineAsyncComponent(
  () => import('@/components/base/SubmitButton.vue')
)

const { urlPrefix } = usePrefix()
const collectionId = COLLECTION_ID

const emit = defineEmits(['select'])

const submit = () => {
  emit('select')
}
</script>
