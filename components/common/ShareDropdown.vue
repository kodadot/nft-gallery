<template>
  <NeoDropdown position="bottom-left" :mobile-modal="mobileModal">
    <template #trigger="{ active }">
      <NeoButton
        class="sm:max-md:icon-action"
        :label="label"
        :icon="icon"
        :no-shadow="noShadow"
        :active="active" />
    </template>

    <NeoDropdownItem
      v-clipboard:copy="shareLink"
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
          :text="shareLink"
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
import QRCode from '@/components/shared/QRCode.vue'

const props = withDefaults(
  defineProps<{
    noShadow: boolean
    mobileModal: boolean
    link?: string
    sharingContent?: string
  }>(),
  {
    noShadow: false,
    mobileModal: false,
    link: '',
    sharingContent: '',
  },
)

const route = useRoute()
const { $i18n } = useNuxtApp()
const { toast } = useToast()
const { isMobile } = useViewport()
const { shareOnX } = useSocialShare()
const propsSharingContent = computed(() => props.sharingContent)
const isModalActive = ref(false)
const sharingText = computed(
  () => propsSharingContent.value || $i18n.t('sharing.nft'),
)
const realworldFullPathShare = ref(`${window.location.origin}${route.fullPath}`)
const shareLink = computed(() =>
  props.link ? props.link : realworldFullPathShare.value,
)

const label = computed(() => (isMobile.value ? '' : 'Share'))
const icon = computed(() => (isMobile.value ? 'share' : ''))

const actionTwitterShare = (): void => {
  shareOnX(
    sharingText.value,
    shareLink.value,
    propsSharingContent.value ? '' : 'KodaDot',
  )
}
</script>
