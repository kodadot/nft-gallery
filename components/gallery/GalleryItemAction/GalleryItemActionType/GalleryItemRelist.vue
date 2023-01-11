<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <GalleryItemPriceSection title="Price" :price="nftPrice">
      <GalleryItemActionSlides ref="actionRef" :active="active">
        <template #action>
          <NeoButton
            :label="isListed ? 'Change Price' : 'List'"
            size="large"
            fixed-width
            no-shadow
            :variant="isListed ? 'k-accent' : 'primary'"
            @click.native="updatePrice" />
        </template>

        <template #content>
          <div>
            <input
              v-model="price"
              type="number"
              :placeholder="
                isListed ? 'Your New Price' : 'Your Listing Price'
              " />
          </div>
        </template>
      </GalleryItemActionSlides>
    </GalleryItemPriceSection>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { NeoButton } from '@kodadot1/brick'
import { calculateBalance } from '@/utils/format/balance'

import GalleryItemPriceSection from '../GalleryItemActionSection.vue'
import GalleryItemActionSlides from '../GalleryItemActionSlides.vue'
import { useGalleryItemAction } from './useGalleryItemAction'

const { transactionList, status, isLoading } = useGalleryItemAction()

const props = defineProps<{
  collectionId: string
  nftId: string
  nftPrice: string
}>()

const active = ref(false)
const price = ref()
const isListed = computed(() => Boolean(props.nftPrice))

const actionRef = ref(null)
onClickOutside(actionRef, () => (active.value = false))

function updatePrice() {
  if (active.value === false) {
    active.value = true
  } else {
    transactionList({
      price: String(calculateBalance(price.value)),
      nftId: props.nftId,
      successMessage: 'Price updated',
      errorMessage: 'Price update failed',
    })
  }
}
</script>

<style lang="scss" scoped></style>
