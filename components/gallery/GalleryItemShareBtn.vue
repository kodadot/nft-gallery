<template>
  <div>
    <NeoDropdown append-to-body>
      <NeoButton label="Share" icon="share-square" />

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

const QRCode = () => import('@/components/shared/QRCode.vue')

const route = useRoute()
const { $buefy } = useNuxtApp()

const isModalActive = ref(false)
// TODO: sharingTxt = $t('sharing.nft')
const sharingTxt = ref('Check out this awesome NFT on Kodadot ')
const realworldFullPathShare = ref(`${window.location.origin}${route.fullPath}`)
const twitterUri = ref(
  `https://twitter.com/intent/tweet?text=${sharingTxt.value}&via=KodaDot&url=${realworldFullPathShare.value}`
)
const toast = (message: string): void => {
  $buefy.toast.open({
    message,
    type: 'is-neo',
  })
}
const actionTwitterShare = (): void => {
  window.open(twitterUri.value, '_blank')
}
</script>
