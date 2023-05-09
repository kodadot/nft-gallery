<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <GalleryItemPriceSection title="Price" :price="nftPrice">
      <GalleryItemActionSlides ref="actionRef" :active="active">
        <template #action>
          <NeoTooltip
            :active="isListDisabled"
            :label="$t('tooltip.emptyListAmount')">
            <NeoButton
              :label="
                isListed
                  ? `${$i18n.t('transaction.price.change')}`
                  : `${$i18n.t('transaction.list')}`
              "
              size="large"
              :disabled="isListDisabled"
              fixed-width
              :variant="isListed ? undefined : 'k-accent'"
              no-shadow
              @click.native="updatePrice" />
          </NeoTooltip>
        </template>

        <template #content>
          <div>
            <input
              v-model="price"
              class="input-price pl-3"
              type="number"
              :placeholder="
                isListed
                  ? `${$i18n.t('transaction.price.new')}`
                  : `${$i18n.t('transaction.price.list')}`
              " />
          </div>
        </template>
      </GalleryItemActionSlides>
    </GalleryItemPriceSection>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { NeoButton, NeoTooltip } from '@kodadot1/brick'
import { calculateBalance } from '@/utils/format/balance'

import GalleryItemPriceSection from '../GalleryItemActionSection.vue'
import GalleryItemActionSlides from '../GalleryItemActionSlides.vue'
import { Interaction } from '@kodadot1/minimark/v1'

const { transaction, status, isLoading } = useTransaction()
const { urlPrefix } = usePrefix()
const { $i18n } = useNuxtApp()

const props = defineProps<{
  collectionId: string
  nftId: string
  nftPrice: string
}>()

const active = ref(false)
const price = ref()
const isListed = computed(() => Boolean(Number(props.nftPrice)))
const isListDisabled = computed(() => {
  return (
    active.value &&
    (price.value === undefined ||
      price.value === '' ||
      Number(price.value) <= 0)
  )
})
const actionRef = ref(null)
onClickOutside(actionRef, () => (active.value = false))

function updatePrice() {
  if (active.value === false) {
    active.value = true
  } else {
    transaction({
      interaction: Interaction.LIST,
      urlPrefix: urlPrefix.value,
      token: {
        price: price.value && String(calculateBalance(price.value)),
        nftId: props.nftId,
      },
      successMessage: $i18n.t('transaction.price.success') as string,
      errorMessage: $i18n.t('transaction.price.error') as string,
    })
  }
}
</script>

<style lang="scss" scoped></style>
