<template>
  <div>
    <NeoDropdown>
      <NeoButton
        :class="isMobileDevice ? 'icon-action' : ''"
        :label="label"
        :icon="icon" />

      <template #items>
        <NeoDropdownItem
          v-clipboard:copy="realworldFullPathShare"
          item="Copy Link"
          @click.native="toast(String($t('toast.urlCopy')))" />
        <NeoDropdownItem item="QR Code" @click.native="isModalActive = true" />
        <NeoDropdownItem
          item="Share On Twitter"
          @click.native="actionTwitterShare" />
      </template>
    </NeoDropdown>

    <b-modal v-model="isModalActive">
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
    </b-modal>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'
import { isMobileDevice } from '@/utils/extension'

const QRCode = () => import('@/components/shared/QRCode.vue')

const route = useRoute()
const { $i18n } = useNuxtApp()
const { toast } = useToast()

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
</script>
