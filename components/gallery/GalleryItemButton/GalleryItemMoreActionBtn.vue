<template>
  <div>
    <SigningModal
      :title="signingModalTitle"
      :is-loading="isLoading"
      :status="status"
      @try-again="burn" />

    <NeoDropdown position="bottom-left" :mobile-modal="false">
      <template #trigger="{ active }">
        <NeoButton
          class="icon-action"
          icon="ellipsis-vertical"
          :active="active" />
      </template>

      <NeoDropdownItem
        v-if="mimeType?.includes('image') && ipfsImage"
        data-testid="gallery-item-more-dropdown-download"
        @click="downloadMedia">
        Download
      </NeoDropdownItem>

      <template v-if="accountId === currentOwner">
        <NeoDropdownItem @click="burn">Burn</NeoDropdownItem>
        <NeoDropdownItem v-if="price !== '0'" @click="unlist">
          Delist
        </NeoDropdownItem>
      </template>
      <NeoDropdownItem disabled>Report</NeoDropdownItem>
    </NeoDropdown>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'
import { Interaction } from '@kodadot1/minimark/v1'
import { downloadImage } from '@/utils/download'
import { toOriginalContentUrl } from '@/utils/ipfs'
import { isMobileDevice } from '@/utils/extension'

const { $i18n, $consola } = useNuxtApp()
const { toast } = useToast()
const { accountId } = useAuth()
const { transaction, isLoading, status } = useTransaction()
const { urlPrefix } = usePrefix()
const route = useRoute()

const props = defineProps<{
  mimeType?: string
  name?: string
  ipfsImage?: string
  currentOwner?: string
  price?: string
}>()

const action = ref('')
const signingModalTitle = computed(() => {
  return (
    {
      burn: $i18n.t('mint.nft.burning'),
      unlist: $i18n.t('mint.nft.delisting'),
    }[action.value] || ''
  )
})

const downloadMedia = () => {
  if (props.ipfsImage) {
    const originalUrl = toOriginalContentUrl(props.ipfsImage)
    if (isMobileDevice) {
      toast($i18n.t('toast.downloadOnMobile'))
      setTimeout(() => {
        window.open(originalUrl, '_blank')
      }, 2000)
      return
    }
    try {
      downloadImage(toOriginalContentUrl(props.ipfsImage), props.name)
    } catch (error) {
      $consola.warn('[ERR] unable to fetch image')
      toast($i18n.t('toast.downloadError'))
      return
    }
  }
}

const burn = () => {
  action.value = 'burn'
  transaction({
    interaction: Interaction.CONSUME,
    urlPrefix: urlPrefix.value,
    nftId: route.params.id as string,
    successMessage: $i18n.t('transaction.consume.success') as string,
    errorMessage: $i18n.t('transaction.consume.error') as string,
  })
}

const unlist = () => {
  action.value = 'unlist'
  transaction({
    interaction: Interaction.LIST,
    urlPrefix: urlPrefix.value,
    token: {
      nftId: route.params.id as string,
      price: '0',
    },
    successMessage: $i18n.t('transaction.unlist.success') as string,
    errorMessage: $i18n.t('transaction.unlist.error') as string,
  })
}
</script>
