<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <div class="is-flex is-justify-content-space-between">
      <div>&nbsp;</div>
      <GalleryItemActionSlides ref="actionRef" :active="active">
        <template #action>
          <NeoButton
            label="Transfer"
            size="large"
            fixed-width
            no-shadow
            @click.native="sendItem" />
        </template>

        <template #content>
          <div>
            <input v-model="address" type="text" placeholder="Transfer To:" />
          </div>
        </template>
      </GalleryItemActionSlides>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { NeoButton } from '@kodadot1/brick'

import GalleryItemActionSlides from '../GalleryItemActionSlides.vue'
import { useGalleryItemAction } from './useGalleryItemAction'

const { transactionSend, status, isLoading } = useGalleryItemAction()
const { $route } = useNuxtApp()

const props = defineProps<{
  nftId: string
}>()

const active = ref(false)
const address = ref()

async function sendItem() {
  if (active.value === false) {
    active.value = true
  } else {
    transactionSend({
      address: address.value,
      tokenId: $route.params.id,
      nftId: props.nftId,
      successMessage: 'Item sent',
      errorMessage: 'Failed to send item',
    })
  }
}

const actionRef = ref(null)
onClickOutside(actionRef, () => (active.value = false))
</script>

<style lang="scss" scoped></style>
