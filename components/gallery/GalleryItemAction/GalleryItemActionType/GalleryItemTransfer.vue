<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <div class="is-flex is-justify-content-space-between">
      <div>&nbsp;</div>
      <GalleryItemActionSlides ref="actionRef" :active="active">
        <template #action>
          <NeoTooltip
            :active="isTransferButtonDisabled"
            position="bottom"
            :label="$t('tooltip.emptyAddress')">
            <NeoButton
              :label="`${$i18n.t('transaction.transfer')}`"
              size="large"
              fixed-width
              :disabled="isTransferButtonDisabled"
              no-shadow
              @click.native="sendItem" />
          </NeoTooltip>
        </template>

        <template #content>
          <div>
            <input
              v-model="address"
              type="text"
              class="pl-3"
              :placeholder="`${$i18n.t('transaction.transferTo')}:`" />
          </div>
        </template>
      </GalleryItemActionSlides>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { NeoButton, NeoTooltip } from '@kodadot1/brick'

import GalleryItemActionSlides from '../GalleryItemActionSlides.vue'
import { Interaction } from '@kodadot1/minimark'

const { transaction, status, isLoading } = useTransaction()
const { $route, $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()

const props = defineProps<{
  nftId: string
}>()

const active = ref(false)
const address = ref()

const isTransferButtonDisabled = computed(() => {
  return active.value && !address.value
})

function sendItem() {
  if (active.value === false) {
    active.value = true
  } else {
    transaction({
      interaction: Interaction.SEND,
      urlPrefix: urlPrefix.value,
      address: address.value,
      tokenId: $route.params.id,
      nftId: props.nftId,
      successMessage: $i18n.t('transaction.item.success') as string,
      errorMessage: $i18n.t('transaction.item.error') as string,
    })
  }
}

const actionRef = ref(null)
onClickOutside(actionRef, () => (active.value = false))
</script>

<style lang="scss" scoped></style>
