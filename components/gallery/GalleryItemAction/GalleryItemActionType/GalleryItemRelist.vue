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
import { createInteraction } from '@kodadot1/minimark'

import type { JustInteraction } from '@kodadot1/minimark'

import { calculateBalance } from '@/utils/format/balance'
import { dangerMessage, infoMessage } from '@/utils/notification'
import GalleryItemPriceSection from '../GalleryItemActionSection.vue'
import GalleryItemActionSlides from '../GalleryItemActionSlides.vue'

const { urlPrefix } = usePrefix()
const { apiInstance } = useApi()
const { accountId } = useAuth()
const { howAboutToExecute, isLoading, status } = useMetaTransaction()

const props = defineProps<{
  nftId: string
  nftPrice: string
}>()

const active = ref(false)
const price = ref()
const isListed = computed(() => Number(props.nftPrice))

const actionRef = ref(null)
onClickOutside(actionRef, () => (active.value = false))

async function updatePrice() {
  if (active.value === false) {
    active.value = true
  } else {
    const api = await apiInstance.value
    const meta = calculateBalance(price.value)
    const cb = {
      rmrk: api.tx.system.remark,
    }

    if (!meta) {
      dangerMessage('Price is not valid')
      return
    }

    const arg = {
      rmrk: [
        createInteraction(
          'LIST' as JustInteraction,
          '1.0.0',
          props.nftId,
          String(meta)
        ),
      ],
    }

    // console.log('prefix', urlPrefix.value)

    howAboutToExecute(
      accountId.value,
      cb[urlPrefix.value],
      arg[urlPrefix.value],
      () => {
        infoMessage('Price updated')
      }
    )
  }
}
</script>

<style lang="scss" scoped></style>
