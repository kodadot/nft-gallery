<template>
  <NeoDropdown position="bottom-left" :mobile-modal="false">
    <template #trigger="{ active }">
      <NeoButton
        :class="isMobileDevice ? 'icon-action' : ''"
        :label="label"
        :icon="icon"
        :no-shadow="noShadow"
        :active="active" />
    </template>

    <NeoDropdownItem
      v-clipboard:copy="realworldFullPathShare"
      @click="toast(String($t('toast.urlCopy')))">
      {{ $t('share.copyLink') }}
    </NeoDropdownItem>
    <NeoDropdownItem @click="isModalActive = true">
      {{ $t('share.qrCode') }}
    </NeoDropdownItem>
    <NeoDropdownItem
      data-testid="gallery-item-share-dropdown-twitter"
      @click="actionTwitterShare">
      {{ $t('share.twitter') }}
    </NeoDropdownItem>
  </NeoDropdown>

  <NeoModal :value="isModalActive" @close="isModalActive = false">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          {{ $t('share.qrCode') }}
        </p>
      </header>
      <div class="card-content">
        <QRCode
          :text="realworldFullPathShare"
          data-testid="gallery-item-share-dropdown-qrcode" />
      </div>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import {
  NeoButton,
  NeoDropdown,
  NeoDropdownItem,
  NeoModal,
} from '@kodadot1/brick'
import { isMobileDevice } from '@/utils/extension'
import QRCode from '@/components/shared/QRCode.vue'

withDefaults(
  defineProps<{
    noShadow: boolean
  }>(),
  {
    noShadow: false,
  },
)

const route = useRoute()
const { $i18n } = useNuxtApp()
const { toast } = useToast()

const { shareOnX } = useSocialShare()

const isModalActive = ref(false)
const sharingTxt = $i18n.t('sharing.nft')
const realworldFullPathShare = ref(`${window.location.origin}${route.fullPath}`)

const label = computed(() => (isMobileDevice ? '' : 'Share'))
const icon = computed(() => (isMobileDevice ? 'share' : ''))

const actionTwitterShare = (): void => {
  shareOnX(sharingTxt, realworldFullPathShare.value)
}
</script>
