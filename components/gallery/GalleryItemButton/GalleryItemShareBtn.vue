<template>
  <div>
    <NeoDropdown position="bottom-left" :mobile-modal="false">
      <template #trigger="{ active }">
        <NeoButton
          :class="isMobileDevice ? 'icon-action' : ''"
          :label="label"
          :icon="icon"
          :active="active" />
      </template>

      <NeoDropdownItem @click="handleCopy"> Copy Link </NeoDropdownItem>
      <NeoDropdownItem @click="isModalActive = true">QR Code</NeoDropdownItem>
      <NeoDropdownItem @click="actionTwitterShare">
        Share On Twitter
      </NeoDropdownItem>
    </NeoDropdown>

    <NeoModal v-model="isModalActive" @close="isModalActive = false">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">QR Code</p>
        </header>
        <div class="card-content">
          <QRCode
            :text="realworldFullPathShare"
            color="#db2980"
            bg-color="#000" />
        </div>
      </div>
    </NeoModal>
  </div>
</template>

<script setup lang="ts">
import {
  NeoButton,
  NeoDropdown,
  NeoDropdownItem,
  NeoModal,
} from '@kodadot1/brick'
import { isMobileDevice } from '@/utils/extension'

const QRCode = () => import('@/components/shared/QRCode.vue')

const route = useRoute()
const { $i18n } = useNuxtApp()
const { toast } = useToast()
const { copy, copied } = useCopyClipboard()

const isModalActive = ref(false)
const sharingTxt = $i18n.t('sharing.nft')
const realworldFullPathShare = ref(`${window.location.origin}${route.fullPath}`)
const twitterUri = ref(
  `https://twitter.com/intent/tweet?text=${sharingTxt}&via=KodaDot&url=${realworldFullPathShare.value}`
)

const label = computed(() => (isMobileDevice ? '' : 'Share'))
const icon = computed(() => (isMobileDevice ? 'share' : ''))

const actionTwitterShare = (): void => {
  window.open(twitterUri.value, '_blank')
}

function handleCopy() {
  copy(realworldFullPathShare.value)
  if (copied) {
    toast(`${$i18n.t('toast.urlCopy')}`)
  }
}
</script>
